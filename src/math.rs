use image::hdr::{HDREncoder, RGBE8Pixel};
use image::Rgb;
use nalgebra::{Rotation3, Vector2, Vector3};
use std::f32::consts::PI;

pub fn fibonacci_hemi_sphere(sample_size: u32) -> Vec<(Vector3<f32>, f32)> {
    let phi = PI * ((3f32) - (5f32).sqrt());
    let mut points: Vec<(Vector3<f32>, f32)> = Vec::with_capacity((sample_size as usize) * 4);
    let sample_size_f = sample_size as f32;
    for i in 0..sample_size {
        let i_f = i as f32;
        let y = 1f32 - (i_f / (sample_size_f - 1f32)); // y goes from 1 to 0 (hemisphere)
        let radius = (1f32 - y * y).sqrt(); //  # radius at y
        let theta = phi * i_f; //  # golden angle increment
        let x = theta.cos() * radius;
        let z = theta.sin() * radius;
        points.push((Vector3::new(x, y, z), y.asin()));
    }
    return points;
}

pub fn sample_equirect(
    img: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    x: f32,
    y: f32,
    z: f32,
) -> RGBE8Pixel {
    let tau = PI * 2f32;
    let polar = (x.atan2(z) + PI).rem_euclid(tau);
    let azimuth = Vector2::new(x, z).magnitude().atan2(y).rem_euclid(tau);
    let u = polar / tau;
    let v = azimuth / PI;
    let i = (u * (width as f32)) as usize;
    let j = (v * (height as f32)) as usize;
    return img[width * j + i];
}
static UP: Vector3<f32> = Vector3::new(0f32, 1f32, 0f32);
fn gen_side(
    read: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    env_map_size: usize,
    side_rot: &Rotation3<f32>,
    hemi: &Vec<(Vector3<f32>, f32)>,
) -> Result<Vec<u8>, std::io::Error> {
    let mut buf: Vec<u8> = Vec::new();
    let encoder = HDREncoder::new(&mut buf);
    let mut pixels: Vec<Rgb<f32>> = Vec::new();
    let env_map_size_half = env_map_size as f32 / 2f32;
    // encoder.encode(data: &[Rgb<f32>], width: usize, height: usize)
    for i in 0..env_map_size {
        for j in 0..env_map_size {
            let _dir = Vector3::new(
                j as f32 - env_map_size_half,
                env_map_size_half,
                i as f32 - env_map_size_half,
            );
            let dir = side_rot * _dir;
            let mut rot_try = Rotation3::rotation_between(&UP, &dir);
            let rot = rot_try.get_or_insert(Rotation3::from_euler_angles(0f32, 0f32, PI));

            let mut sum = Vector3::new(0f32, 0f32, 0f32);
            let hemi_len_f = hemi.len() as f32;
            for (_v, w) in hemi {
                let v = (*rot) * _v;
                let sample = sample_equirect(read, width, height, v.x, v.y, v.z);
                let rgb = sample.to_hdr();
                sum += Vector3::new(rgb[0], rgb[1], rgb[2]) * (*w) / hemi_len_f;
            }
            sum *= PI;

            pixels.push(image::Rgb {
                data: [sum.x, sum.y, sum.z],
            });
        }
    }
    // return Ok(buf);
    return encoder
        .encode(pixels.as_slice(), env_map_size, env_map_size)
        .map(|_| buf);
}
pub fn gen_irradiance_diffuse_map(
    read: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    sample_size: u32,
    env_map_size: usize,
) -> Result<Vec<Vec<u8>>, std::io::Error> {
    let hemi = fibonacci_hemi_sphere(sample_size);
    let rotations: [Rotation3<f32>; 6] = {
        let q = PI / 2f32;
        // PY,  PZ,  NX,    NZ,   PX,        NY,
        let xq = Rotation3::from_euler_angles(q, 0f32, 0f32);
        let yq = Rotation3::from_euler_angles(0f32, q, 0f32);
        let rotations: [Rotation3<f32>; 6] = [
            Rotation3::from_euler_angles(0f32, 0f32, 0f32),
            xq,
            yq * xq,
            yq * yq * xq,
            yq * yq * yq * xq,
            xq * xq,
        ];
        rotations
    };

    let sides = rotations
        .iter()
        .map(|r| gen_side(read, width, height, env_map_size, r, &hemi));
    return sides.collect();
}

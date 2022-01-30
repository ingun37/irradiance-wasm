use image::hdr::{HDREncoder, RGBE8Pixel};
use image::Rgb;
use nalgebra::{Quaternion, UnitVector2, UnitVector3, Vector2, Vector3};
use std::f32::consts::PI;
use std::io::{Cursor, Write};

pub fn fibonacci_hemi_sphere(sample_size: u32) -> Vec<f32> {
    let phi = PI * ((3f32) - (5f32).sqrt());
    let mut points: Vec<f32> = Vec::with_capacity((sample_size as usize) * 4);
    let sample_size_f = sample_size as f32;
    for i in 0..sample_size {
        let i_f = i as f32;
        let y = 1f32 - (i_f / (sample_size_f - 1f32)); // y goes from 1 to 0 (hemisphere)
        let radius = (1f32 - y * y).sqrt(); //  # radius at y
        let theta = phi * i_f; //  # golden angle increment
        let x = theta.cos() * radius;
        let z = theta.sin() * radius;
        points.push(x);
        points.push(y);
        points.push(z);
        points.push(y.asin());
    }
    return points;
}

// vecToSpherical :: V3 Double -> V2 Double
// vecToSpherical v =
//   let (V3 x y z) = v
//       polar = atan2 y x
//       azimuth = atan2 (norm (V2 x y)) z
//    in V2 (withInTau polar) (withInTau azimuth)

pub fn sample_equirect(
    img: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    x: f32,
    y: f32,
    z: f32,
) -> RGBE8Pixel {
    let xz = Vector2::new(x, z);
    let tau = PI * 2f32;
    let polar = x.atan2(z).rem_euclid(tau);
    let azimuth = xz.magnitude().atan2(y).rem_euclid(tau);
    let u = polar / tau;
    let v = azimuth / tau;
    let i = (u * (width as f32)) as usize;
    let j = (v * (height as f32)) as usize;
    return img[width * j + i];
}
pub fn gen_env_map(
    read: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    sample_size: u32,
    env_map_size: usize,
) -> Result<Vec<u8>, std::io::Error> {
    let hemi = fibonacci_hemi_sphere(sample_size);
    let env_map_size_half = env_map_size as f32 / 2f32;
    let mut buf: Vec<u8> = Vec::new();
    // let cursor: Cursor<Vec<u8>> = Cursor::new(mut_buf_ref);
    let encoder = HDREncoder::new(&mut buf);

    let mut pixels: Vec<Rgb<f32>> = Vec::new();
    // encoder.encode(data: &[Rgb<f32>], width: usize, height: usize)
    for i in 0..env_map_size {
        for j in 0..env_map_size {
            let vx = i as f32 - env_map_size_half;
            let vy = env_map_size_half;
            let vz = j as f32 - env_map_size_half;
            let sample = sample_equirect(read, width, height, vx, vy, vz);
            pixels.push(sample.to_hdr());
        }
    }
    // return Ok(buf);
    return encoder
        .encode(pixels.as_slice(), env_map_size, env_map_size)
        .map(|_| buf);
}

fn makeRotation(normalized_to: Vector3<f32>) -> Quaternion<f32> {
    let anchor = Vector3::new(0f32, 1f32, 0f32);
    let c = anchor.cross(&normalized_to);
    let w = anchor.dot(&normalized_to) + 1f32;
    let q = Quaternion::new(w, c.x, c.y, c.z);
    return q;
}

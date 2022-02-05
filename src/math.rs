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
fn radical_inverse_vdc(mut bits: u32) -> f32 {
    bits = (bits << 16) | (bits >> 16);
    bits = ((bits & 0x55555555) << 1) | ((bits & 0xAAAAAAAA) >> 1);
    bits = ((bits & 0x33333333) << 2) | ((bits & 0xCCCCCCCC) >> 2);
    bits = ((bits & 0x0F0F0F0F) << 4) | ((bits & 0xF0F0F0F0) >> 4);
    bits = ((bits & 0x00FF00FF) << 8) | ((bits & 0xFF00FF00) >> 8);
    return (bits as f32) * 2.3283064365386963e-10; // / 0x100000000
}

pub fn hammersley(i: u32, n: u32) -> Vector2<f32> {
    return Vector2::new((i as f32) / (n as f32), radical_inverse_vdc(i));
}

fn vec3(x: f32, y: f32, z: f32) -> Vector3<f32> {
    Vector3::new(x, y, z)
}

pub fn importance_sample_ggx(xi: Vector2<f32>, n: Vector3<f32>, roughness: f32) -> Vector3<f32> {
    let a = roughness * roughness;
    let phi = 2f32 * PI * xi.x;
    let cosTheta = ((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y)).sqrt();
    let sinTheta = (1.0 - cosTheta * cosTheta).sqrt();

    // from spherical coordinates to cartesian coordinates
    let h: Vector3<f32> = Vector3::new(phi.cos() * sinTheta, phi.sin() * sinTheta, cosTheta);

    // from tangent-space vector to world-spcae sample vector
    let up = if (n.z).abs() < 0.999 {
        vec3(0.0, 0.0, 1.0)
    } else {
        vec3(1.0, 0.0, 0.0)
    };

    let tangent = up.cross(&n).normalize();
    let bitangent = n.cross(&tangent);
    let sample_vec = h.x * tangent + bitangent * h.y + n * h.z;
    return sample_vec.normalize();
}

pub fn the_step(v:&Vector3<f32>, h:&Vector3<f32>) -> Vector3<f32> {
    return (2.0 * v.dot(&h) * h - v).normalize();
}

pub fn the_step_2(n:&Vector3<f32>, l:&Vector3<f32>) -> Option<(Vector3<f32>, f32)> {
    let n_dot_l = n.dot(&l);
    if 0f32 < n_dot_l {
        return Some((*l, n_dot_l))
        // buf.push(l * n_dot_r);
        // total_weight += n_dot_r;
    }
    else {
        return None
    }
}

pub fn importance_sample_vectors(
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: usize,
) -> Vec<Vector3<f32>> {
    let n = Vector3::new(nx, ny, nz).normalize();
    let r = n;
    let v = r;
    let mut buf: Vec<Vector3<f32>> = Vec::with_capacity(sample_size);
    let mut total_weight = 0f32;
    for i in 0..sample_size {
        let xi = hammersley(i as u32, sample_size as u32);
        let h = importance_sample_ggx(xi, n, roughness);
        let l = the_step(&v,&h);
        let n_dot_l = n.dot(&l);
        if 0f32 < n_dot_l {
            buf.push(l * n_dot_l);
            total_weight += n_dot_l;
        }
        // buf.push(l);
    }
    return buf;
}

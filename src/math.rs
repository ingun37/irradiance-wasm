use image::hdr::{HDREncoder, RGBE8Pixel};
use image::Rgb;
use nalgebra::{Rotation3, Vector2, Vector3};
use std::f32::consts::PI;
pub mod fibonacci_hemi_sphere;
pub fn make_6_rotations() -> [Rotation3<f32>; 6] {
    let q = PI / 2f32;
    // PY,  PZ,  NX,    NZ,   PX,        NY,
    let xq = Rotation3::from_euler_angles(q, 0f32, 0f32);
    let yq = Rotation3::from_euler_angles(0f32, q, 0f32);
    return [
        Rotation3::from_euler_angles(0f32, 0f32, 0f32),
        xq,
        yq * xq,
        yq * yq * xq,
        yq * yq * yq * xq,
        xq * xq,
    ];
}

fn sample_vec(map_size: usize, side_rot: &Rotation3<f32>, ij: usize) -> Vector3<f32> {
    let map_size_half = map_size as f32 / 2f32;

    let i = ij / map_size;
    let j = ij % map_size;
    let _dir = Vector3::new(
        j as f32 - map_size_half,
        map_size_half,
        i as f32 - map_size_half,
    );
    side_rot * _dir
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
    env: &Vec<RGBE8Pixel>,
    env_width: usize,
    env_height: usize,
    map_size: usize,
    side_rot: &Rotation3<f32>,
    sample_size: u32,
) -> Result<Vec<u8>, std::io::Error> {
    let mut buf: Vec<u8> = Vec::new();
    let encoder = HDREncoder::new(&mut buf);
    let pixels = (0..map_size * map_size)
        .map(|ij| sample_vec(map_size, side_rot, ij))
        .map(|dir| {
            let mut rot_try = Rotation3::rotation_between(&UP, &dir);
            let rot = rot_try.get_or_insert(Rotation3::from_euler_angles(0f32, 0f32, PI));
            // TODO: use wgpu
            let sum = (0..sample_size)
                .map(|i| {
                    let (v, w) = fibonacci_hemi_sphere::nth(sample_size, i);
                    (((*rot) * v), w)
                })
                .map(|(v, w)| {
                    let sample = sample_equirect(env, env_width, env_height, v.x, v.y, v.z);
                    let rgb = sample.to_hdr();
                    Vector3::new(rgb[0], rgb[1], rgb[2]) * w
                })
                .sum::<Vector3<f32>>()
                * PI
                / sample_size as f32;

            image::Rgb {
                data: [sum.x, sum.y, sum.z],
            }
        })
        .collect::<Vec<Rgb<f32>>>();
    // return Ok(buf);
    return encoder
        .encode(pixels.as_slice(), map_size, map_size)
        .map(|_| buf);
}
pub fn gen_irradiance_diffuse_map(
    env: &Vec<RGBE8Pixel>,
    env_width: usize,
    env_height: usize,
    sample_size: u32,
    map_size: usize,
) -> Result<Vec<Vec<u8>>, std::io::Error> {
    let rotations = make_6_rotations();
    let sides = rotations
        .iter()
        .map(|r| gen_side(env, env_width, env_height, map_size, r, sample_size));
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
    let cos_theta = ((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y)).sqrt();
    let sin_theta = (1.0 - cos_theta * cos_theta).sqrt();

    // from spherical coordinates to cartesian coordinates
    let h: Vector3<f32> = Vector3::new(phi.cos() * sin_theta, phi.sin() * sin_theta, cos_theta);

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

pub fn the_step(v: &Vector3<f32>, h: &Vector3<f32>) -> Vector3<f32> {
    return (2.0 * v.dot(&h) * h - v).normalize();
}

pub fn the_step_2(n: &Vector3<f32>, l: &Vector3<f32>) -> Option<(Vector3<f32>, f32)> {
    let n_dot_l = n.dot(&l);
    if 0f32 < n_dot_l {
        return Some((*l, n_dot_l));
        // buf.push(l * n_dot_r);
        // total_weight += n_dot_r;
    } else {
        return None;
    }
}
pub fn sample_specular(
    envmap: &Vec<RGBE8Pixel>,
    width: usize,
    height: usize,
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: usize,
) -> Vector3<f32> {
    let n = Vector3::new(nx, ny, nz).normalize();
    let mut total_weight = 0f32;
    let fs: Vector3<f32> = (0..sample_size)
        .map(|i| hammersley(i as u32, sample_size as u32))
        .map(|xi| importance_sample_ggx(xi, n, roughness))
        .map(|h| the_step(&n, &h))
        .flat_map(|l| the_step_2(&n, &l))
        .map(|(v, w)| {
            let color = sample_equirect(envmap, width, height, v.x, v.y, v.z).to_hdr();
            let x = color[0] * w;
            let y = color[1] * w;
            let z = color[2] * w;
            total_weight += w;
            Vector3::new(x, y, z)
        })
        .sum();
    return fs / total_weight;
}

fn gen_specular_map_side(
    env: &Vec<RGBE8Pixel>,
    env_width: usize,
    env_height: usize,
    map_size: usize,
    side_rot: &Rotation3<f32>,
    roughness: f32,
    sample_size: usize,
) -> Result<Vec<u8>, std::io::Error> {
    let mut buf: Vec<u8> = Vec::new();
    let encoder = HDREncoder::new(&mut buf);
    let pixels = (0..map_size * map_size)
        .map(|ij| sample_vec(map_size, side_rot, ij))
        .map(|dir| {
            let c = sample_specular(
                env,
                env_width,
                env_height,
                dir.x,
                dir.y,
                dir.z,
                roughness,
                sample_size,
            );
            image::Rgb {
                data: [c.x, c.y, c.z],
            }
        })
        .collect::<Vec<Rgb<f32>>>();

    return encoder
        .encode(pixels.as_slice(), map_size, map_size)
        .map(|_| buf);
}

pub fn gen_specular_map(
    env: &Vec<RGBE8Pixel>,
    env_width: usize,
    env_height: usize,
    map_size: usize,
    sample_size: usize,
    mip_levels: u32,
) -> Result<Vec<Vec<Vec<u8>>>, std::io::Error> {
    return (0..mip_levels)
        .map(|mip| {
            let mip_map_size = (0..mip).fold(map_size, |x, _| x / 2);
            let mip_roughness = (mip as f32) / ((mip_levels as f32) + 1f32);
            make_6_rotations()
                .iter()
                .map(|r| {
                    gen_specular_map_side(
                        env,
                        env_width,
                        env_height,
                        mip_map_size,
                        r,
                        mip_roughness,
                        sample_size,
                    )
                })
                .collect()
        })
        .collect();
}

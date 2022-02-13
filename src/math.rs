use image::codecs::hdr::{HdrDecoder, HdrEncoder};
use image::{ImageError, ImageResult, Rgb, Rgb32FImage};
use nalgebra::{Rotation3, Vector2, Vector3};
use std::f32::consts::PI;
use std::io::BufReader;
pub mod fibonacci_hemi_sphere;

pub fn make_6_rotations() -> [Rotation3<f32>; 6] {
    let q = PI / 2f32;

    // PX NX PY NY PZ NZ
    let xq = Rotation3::from_euler_angles(q, 0f32, 0f32);
    let yq = Rotation3::from_euler_angles(0f32, q, 0f32);
    return [
        yq * yq * yq * xq,
        yq * xq,
        Rotation3::from_euler_angles(0f32, 0f32, 0f32),
        xq * xq,
        xq,
        yq * yq * xq,
    ];
    // PY,  PZ,  NX,    NZ,   PX,        NY,

    // return [
    //     Rotation3::from_euler_angles(0f32, 0f32, 0f32),
    //     xq,
    //     yq * xq,
    //     yq * yq * xq,
    //     yq * yq * yq * xq,
    //     xq * xq,
    // ];
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

pub fn sample_equirect(hdr: &Rgb32FImage, x: f32, y: f32, z: f32) -> Rgb<f32> {
    let tau = PI * 2f32;
    let polar = (x.atan2(z) + PI).rem_euclid(tau);
    let azimuth = Vector2::new(x, z).magnitude().atan2(y).rem_euclid(tau);
    let u = polar / tau;
    let v = azimuth / PI;
    let (width, height) = hdr.dimensions();
    let i = (u * (width as f32)) as u32;
    let j = (v * (height as f32)) as u32;
    return *hdr.get_pixel(i, j);
    // return img[width * j + i];
}

static UP: Vector3<f32> = Vector3::new(0f32, 1f32, 0f32);
pub fn gen_side(
    hdr: &Rgb32FImage,
    map_size: usize,
    side_rot: &Rotation3<f32>,
    sample_size: u32,
    // e_limit: u8,
) -> Result<Vec<u8>, ImageError> {
    let mut buf: Vec<u8> = Vec::new();
    let encoder = HdrEncoder::new(&mut buf);
    let pixels = (0..map_size * map_size)
        .map(|ij| sample_vec(map_size, side_rot, ij))
        .map(|dir| {
            let mut rot_try = Rotation3::rotation_between(&UP, &dir);
            let rot = rot_try.get_or_insert(Rotation3::from_euler_angles(0f32, 0f32, PI));
            // TODO: use wgpu
            let mut total_rgb = Rgb([0f32, 0f32, 0f32]);
            (0..sample_size)
                .map(|i| {
                    let (v, w) = fibonacci_hemi_sphere::nth(sample_size, i);
                    (((*rot) * v), w)
                })
                .for_each(|(v, w)| {
                    let rgb = sample_equirect(hdr, v.x, v.y, v.z);
                    for i in 0..3 {
                        total_rgb[i] += rgb[i] * w;
                    }
                });

            for i in 0..3 {
                total_rgb[i] = total_rgb[i] * PI / sample_size as f32;
            }
            total_rgb
        })
        .collect::<Vec<Rgb<f32>>>();
    // return Ok(buf);
    return encoder
        .encode(pixels.as_slice(), map_size, map_size)
        .map(|_| buf);
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
    hdr_env: &Rgb32FImage,
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: usize,
) -> Rgb<f32> {
    let n = Vector3::new(nx, ny, nz).normalize();
    let mut total_weight = 0f32;
    let mut total_rgb = Rgb([0f32, 0f32, 0f32]);

    (0..sample_size)
        .map(|i| hammersley(i as u32, sample_size as u32))
        .map(|xi| importance_sample_ggx(xi, n, roughness))
        .map(|h| the_step(&n, &h))
        .flat_map(|l| the_step_2(&n, &l))
        .for_each(|(v, w)| {
            let rgb = sample_equirect(hdr_env, v.x, v.y, v.z);

            for i in 0..3 {
                total_rgb[i] += rgb[i] * w;
            }
            total_weight += w;
        });

    for i in 0..3 {
        total_rgb[i] /= total_weight;
    }
    total_rgb
}

pub fn gen_specular_map_side(
    env: &Rgb32FImage,
    map_size: usize,
    side_rot: &Rotation3<f32>,
    roughness: f32,
    sample_size: usize,
) -> Result<Vec<u8>, ImageError> {
    let mut buf: Vec<u8> = Vec::new();
    let encoder = HdrEncoder::new(&mut buf);
    let pixels = (0..map_size * map_size)
        .map(|ij| sample_vec(map_size, side_rot, ij))
        .map(|dir| sample_specular(env, dir.x, dir.y, dir.z, roughness, sample_size))
        .collect::<Vec<Rgb<f32>>>();

    return encoder
        .encode(pixels.as_slice(), map_size, map_size)
        .map(|_| buf);
}

fn custom_image_error() -> image::ImageError {
    image::ImageError::from(std::io::Error::new(
        std::io::ErrorKind::Other,
        "some Image error",
    ))
}

pub fn read_hdr_image(env_map_buffer: &[u8]) -> ImageResult<Rgb32FImage> {
    let buf_reader = BufReader::new(env_map_buffer);
    let decoder = HdrDecoder::new(buf_reader);

    return decoder.and_then(|x| {
        let meta = x.metadata();
        x.read_image_native()
            .map(|rgbe_vec| {
                rgbe_vec
                    .iter()
                    .map(|rgbe| rgbe.to_hdr())
                    .flat_map(|rgb| rgb.0)
                    .collect()
            })
            .and_then(|f32_vec| {
                image::Rgb32FImage::from_vec(meta.width, meta.height, f32_vec)
                    .ok_or(custom_image_error())
            })
        // .map(|img| blur(&img, PI))
        // .map(image::DynamicImage::ImageRgb32F)
        // .map(|x| x.blur(PI))
        // .map(|f32_vec| {
        //     let hh = image::Rgb32FImage::from_vec(meta.width, meta.height, f32_vec).map(image::DynamicImage::ImageRgb32F).map(|x| x.blur(PI));
        // })
    });
}

// pub fn exponent_limit(env_map_buffer: &[u8]) -> Result<u8, ImageError> {
//     return read_rgbe_pixels(env_map_buffer).map(|(pixels, w, h)| {
//         let mut chan = pixels.iter().map(|x| x.e).collect::<Vec<u8>>();
//         chan.sort();
//         let limit_idx = chan.len() / 100 * 95;
//         chan[limit_idx]
//     });
// }

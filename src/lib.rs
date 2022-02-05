mod math;
mod utils;
use image::hdr::{HDRDecoder, RGBE8Pixel};
use image::{ImageError, ImageResult};
use js_sys;
use nalgebra::Vector3;
use std::io::BufReader;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

fn bare_bones() {
    log("Hello from Rust!");
    log_u32(42);
    log_many("Logging", "many values!");
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, irradiance-wasm!");
}

#[wasm_bindgen]
pub fn fibonacci_hemi_sphere(sample_size: u32) -> js_sys::Float32Array {
    let rust_array = math::fibonacci_hemi_sphere(sample_size);
    let fs: Vec<f32> = rust_array
        .iter()
        .map(|(v, w)| vec![v.x * w, v.y * w, v.z * w])
        .flatten()
        .collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn hammersleys(sample_size: u32) -> js_sys::Float32Array {
    let rust_array = (0..sample_size).map(|i| math::hammersley(i, sample_size));
    let fs: Vec<f32> = rust_array.map(|v| vec![v.x, v.y]).flatten().collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn ggxs(nx: f32, ny: f32, nz: f32, roughness: f32, sample_size: u32) -> js_sys::Float32Array {
    let n = Vector3::new(nx, ny, nz).normalize();
    let rust_array = (0..sample_size)
        .map(|i| math::hammersley(i, sample_size))
        .map(|xi| math::importance_sample_ggx(xi, n, roughness));
    let fs: Vec<f32> = rust_array.map(|v| vec![v.x, v.y, v.z]).flatten().collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn the_step(
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: u32,
) -> js_sys::Float32Array {
    let n = Vector3::new(nx, ny, nz).normalize();
    let rust_array = (0..sample_size)
        .map(|i| math::hammersley(i, sample_size))
        .map(|xi| math::importance_sample_ggx(xi, n, roughness))
        .map(|h| math::the_step(&n, &h));
    let fs: Vec<f32> = rust_array.map(|v| vec![v.x, v.y, v.z]).flatten().collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn the_step_2(
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: u32,
) -> js_sys::Float32Array {
    let n = Vector3::new(nx, ny, nz).normalize();
    let fs: Vec<f32> = (0..sample_size)
        .map(|i| math::hammersley(i, sample_size))
        .map(|xi| math::importance_sample_ggx(xi, n, roughness))
        .map(|h| math::the_step(&n, &h))
        .flat_map(|l| math::the_step_2(&n, &l))
        .flat_map(|(v, w)| vec![v.x * w, v.y * w, v.z * w])
        .collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

fn read_hdr(env_map_buffer: &[u8]) -> ImageResult<(Vec<RGBE8Pixel>, u32, u32)> {
    let buf_reader = BufReader::new(env_map_buffer);
    let decoder = HDRDecoder::new(buf_reader);

    return decoder.and_then(|x| {
        let meta = x.metadata();
        x.read_image_native()
            .map(|pxls| (pxls, meta.width, meta.height))
    });
}

fn map_err_to_jsvalue(e: ImageError) -> JsValue {
    JsValue::from("image error")
}

#[wasm_bindgen]
pub fn irradiance(
    sample_size: u32,
    map_size: usize,
    env_map_buffer: &[u8],
    callback: &js_sys::Function,
) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let maps = read_hdr(env_map_buffer).and_then(|(pxls, w, h)| {
        math::gen_irradiance_diffuse_map(&pxls, w as usize, h as usize, sample_size, map_size)
            .map_err(ImageError::from)
    });

    return maps.map_err(map_err_to_jsvalue).and_then(|maps| {
        (0..maps.len())
            .map(|i| {
                let map = &maps[i];
                let ptr = map.as_ptr();
                let bytelen = map.len();
                let idx_js = JsValue::from(i);
                let ptr_js = JsValue::from(ptr as u32);
                let bytelen_js = JsValue::from(bytelen);
                callback
                    .call3(&JsValue::null(), &idx_js, &ptr_js, &bytelen_js)
                    .map(|_| ())
            })
            .collect::<Result<(), _>>()
    });
}

#[wasm_bindgen]
pub fn specular(
    sample_count: usize,
    map_size: usize,
    env_map_buffer: &[u8],
    callback: &js_sys::Function,
    roughness: f32,
) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();
    let maps = read_hdr(env_map_buffer).and_then(|(pxls, w, h)| {
        math::gen_specular_map(
            &pxls,
            w as usize,
            h as usize,
            map_size,
            roughness,
            sample_count,
        )
        .map_err(ImageError::from)
    });

    return maps.map_err(map_err_to_jsvalue).and_then(|maps| {
        (0..maps.len())
            .map(|i| {
                let map = &maps[i];
                let ptr = map.as_ptr();
                let bytelen = map.len();
                let idx_js = JsValue::from(i);
                let ptr_js = JsValue::from(ptr as u32);
                let bytelen_js = JsValue::from(bytelen);
                callback
                    .call3(&JsValue::null(), &idx_js, &ptr_js, &bytelen_js)
                    .map(|_| ())
            })
            .collect::<Result<(), _>>()
    });
}

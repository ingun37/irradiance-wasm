mod math;
mod utils;
use image::hdr::HDRDecoder;
use image::ImageError;
use js_sys;
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
        .map(|(v, w)| vec![v.x, v.y, v.z, *w])
        .flatten()
        .collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn low_discrepancy_sample_vectors(sample_size: u32) -> js_sys::Float32Array {
    let rust_array = math::low_discrepancy_sample_vectors(sample_size as usize);
    let fs: Vec<f32> = rust_array
        .iter()
        .map(|v| vec![v.x, v.y])
        .flatten()
        .collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn importance_sample_vectors(
    nx: f32,
    ny: f32,
    nz: f32,
    roughness: f32,
    sample_size: u32,
) -> js_sys::Float32Array {
    let rust_array = math::importance_sample_vectors(nx, ny, nz, roughness, sample_size as usize);
    let fs: Vec<f32> = rust_array
        .iter()
        .map(|v| vec![v.x, v.y, v.z])
        .flatten()
        .collect();
    return js_sys::Float32Array::from(fs.as_slice());
}

#[wasm_bindgen]
pub fn irradiance(
    // hdr_bytes:js_sys::Uint8Array
    sample_size: u32,
    env_map_size: usize,
    buffer: &[u8],
    callback: &js_sys::Function,
)
// -> Result<js_sys::Uint8Array, JsValue>
{
    console_error_panic_hook::set_once();
    let buf_reader = BufReader::new(buffer);
    let decoder = HDRDecoder::new(buf_reader);

    let irradiance_diffuse_maps = decoder.and_then(|x| {
        let meta = x.metadata();
        return x.read_image_native().and_then(|pxls| {
            math::gen_irradiance_diffuse_map(
                &pxls,
                meta.width as usize,
                meta.height as usize,
                sample_size,
                env_map_size,
            )
            .map_err(ImageError::from)
        });
    });

    match irradiance_diffuse_maps {
        Ok(maps) => {
            for i in 0..maps.len() {
                let map = &maps[i];
                let ptr = map.as_ptr();
                let bytelen = map.len();
                let idx_js = JsValue::from(i);
                let ptr_js = JsValue::from(ptr as u32);
                let bytelen_js = JsValue::from(bytelen);
                callback.call3(&JsValue::null(), &idx_js, &ptr_js, &bytelen_js);
            }
        }
        Err(e) => {
            console_log!("{}", e);
        }
    }
}

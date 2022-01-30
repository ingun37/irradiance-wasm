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
    return js_sys::Float32Array::from(&rust_array[..]);
}

#[wasm_bindgen]
pub fn irradiance(
    // hdr_bytes:js_sys::Uint8Array
    sample_size: u32,
    env_map_size: usize,
    buffer: &[u8],
) -> Result<js_sys::Uint8Array, JsValue> {
    console_error_panic_hook::set_once();
    let buf_reader = BufReader::new(buffer);
    let decoder = HDRDecoder::new(buf_reader);

    let envmap = decoder.and_then(|x| {
        let meta = x.metadata();
        return x.read_image_native().and_then(|pxls| 
            math::gen_env_map(
                &pxls,
                meta.width as usize,
                meta.height as usize,
                sample_size,
                env_map_size,
            ).map_err(ImageError::from)
        );
    });

    let hh = envmap.map(|buf| js_sys::Uint8Array::from(buf.as_slice())).map_err(|e| {
        console_log!("image error {}", e);
        return JsValue::null();
    });
    return hh;
    // let kk = hdr.map(|pixels| gen_env_map(pixels, w,hdr))
    // match hdr {
    //     Ok(x) => {
    //         console_log!("image len {}", x.len());
    //     }
    //     Err(e) => {
    //         console_log!("error {}", e)
    //     }
    // }
}

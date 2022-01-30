mod math;
mod utils;
use image::hdr::HDRDecoder;
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
    buffer: &[u8],
) {
    // let in_vec = hdr_bytes.to_vec();
    // let in_cursor = Cursor::new(in_vec);
    let buf_reader = BufReader::new(buffer);
    let hdr = HDRDecoder::new(buf_reader).and_then(|x| x.read_image_native());
    // let str1 = buffer[0].to_string();
    // let str2 = buffer[1].to_string();
    // let str3 = buffer[2].to_string();

    // alert(hh.as_str());
    match hdr {
        Ok(x) => {
            console_log!("image len {}", x.len());
        }
        Err(e) => {
            console_log!("error {}", e)
        }
    }

}

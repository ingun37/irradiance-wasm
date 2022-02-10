mod math;
mod utils;
use futures::future::FutureExt;
use futures::future::TryFutureExt;
use image::codecs::hdr::{HdrDecoder, Rgbe8Pixel};
use image::{ImageError, ImageResult};
use js_sys;
use nalgebra::Vector3;
use std::borrow::Cow;
use std::io::BufReader;
use std::io::{Error, ErrorKind};
use wasm_bindgen::prelude::*;
use wgpu::util::DeviceExt;
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
    let fs: Vec<f32> = (0..sample_size)
        .map(|i| math::fibonacci_hemi_sphere::nth(sample_size, i))
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

fn read_hdr(env_map_buffer: &[u8]) -> ImageResult<(Vec<Rgbe8Pixel>, u32, u32)> {
    let buf_reader = BufReader::new(env_map_buffer);
    let decoder = HdrDecoder::new(buf_reader);

    return decoder.and_then(|x| {
        let meta = x.metadata();
        x.read_image_native()
            .map(|pxls| (pxls, meta.width, meta.height))
    });
}

fn map_err_to_jsvalue(e: ImageError) -> JsValue {
    match e {
        ImageError::Decoding(e) => {
            console_log!("{}", e)
        }
        ImageError::Encoding(e) => {
            console_log!("{}", e)
        }
        ImageError::Parameter(e) => {
            console_log!("{}", e)
        }
        ImageError::Limits(e) => {
            console_log!("{}", e)
        }
        ImageError::Unsupported(e) => {
            console_log!("{}", e)
        }
        ImageError::IoError(e) => {
            console_log!("{}", e)
        }
    }
    JsValue::from("image error")
}

fn map_err_to_jsvalue_<A>(_: A) -> JsValue {
    JsValue::from("some error")
}

fn map_err_to_image_error(e: JsValue) -> ImageError {
    ImageError::from(Error::new(ErrorKind::Other, "jsval error"))
}

#[wasm_bindgen]
pub fn irradiance(
    sample_size: u32,
    map_size: usize,
    env_map_buffer: &[u8],
    callback: &js_sys::Function,
) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let mut idx = -1;
    read_hdr(env_map_buffer)
        .and_then(|(pxls, w, h)| {
            math::make_6_rotations()
                .iter()
                .map(|r| {
                    math::gen_side(&pxls, w as usize, h as usize, map_size, r, sample_size)
                        .and_then(|map| {
                            let ptr = map.as_ptr();
                            let bytelen = map.len();
                            idx += 1;
                            let idx_js = JsValue::from(idx);
                            let ptr_js = JsValue::from(ptr as u32);
                            let bytelen_js = JsValue::from(bytelen);
                            callback
                                .call3(&JsValue::null(), &idx_js, &ptr_js, &bytelen_js)
                                .map(|_| ())
                                .map_err(map_err_to_image_error)
                        })
                })
                .collect()
        })
        .map_err(map_err_to_jsvalue)
}

#[wasm_bindgen]
pub fn specular(
    sample_size: usize,
    map_size: usize,
    env_map_buffer: &[u8],
    callback: &js_sys::Function,
    mip_levels: u32,
) -> Result<(), JsValue> {
    console_error_panic_hook::set_once();
    let mut idx = -1;

    read_hdr(env_map_buffer)
        .and_then(|(pxls, w, h)| {
            (0..mip_levels)
                .map(|mip| {
                    let mip_map_size = (0..mip).fold(map_size, |x, _| x / 2);
                    let mip_roughness = (mip as f32) / ((mip_levels as f32) + 1f32);
                    math::make_6_rotations()
                        .iter()
                        .map(|r| {
                            math::gen_specular_map_side(
                                &pxls,
                                w as usize,
                                h as usize,
                                mip_map_size,
                                r,
                                mip_roughness,
                                sample_size,
                            )
                            .and_then(|map| {
                                idx += 1;
                                let ptr = map.as_ptr();
                                let bytelen = map.len();
                                let idx_js = JsValue::from(idx);
                                let ptr_js = JsValue::from(ptr as u32);
                                let bytelen_js = JsValue::from(bytelen);
                                callback
                                    .call3(&JsValue::null(), &idx_js, &ptr_js, &bytelen_js)
                                    .map(|_| ())
                                    .map_err(map_err_to_image_error)
                            })
                        })
                        .collect()
                })
                .collect()
        })
        .map_err(map_err_to_jsvalue)
}

#[wasm_bindgen]
pub async fn wasmtest(shader_code: String) -> Result<(), JsValue> {
    let instance = wgpu::Instance::new(wgpu::Backends::all());
    let adapter = instance
        .request_adapter(&wgpu::RequestAdapterOptions::default())
        .map(|x| x.ok_or(JsValue::from("failed to create adapter")))
        .await?;
    let (device, queue) = adapter
        .request_device(
            &wgpu::DeviceDescriptor {
                label: None,
                features: wgpu::Features::empty(),
                limits: wgpu::Limits::downlevel_defaults(),
            },
            None,
        )
        .await
        .unwrap();

    let cs_module = device.create_shader_module(&wgpu::ShaderModuleDescriptor {
        label: None,
        source: wgpu::ShaderSource::Wgsl(Cow::Borrowed(shader_code.as_str())),
    });

    let numbers: [u32; 4] = [1, 2, 3, 4];

    // Gets the size in bytes of the buffer.
    let slice_size = numbers.len() * std::mem::size_of::<u32>();
    let size = slice_size as wgpu::BufferAddress;

    // Instantiates buffer without data.
    // `usage` of buffer specifies how it can be used:
    //   `BufferUsages::MAP_READ` allows it to be read (outside the shader).
    //   `BufferUsages::COPY_DST` allows it to be the destination of the copy.
    let staging_buffer = device.create_buffer(&wgpu::BufferDescriptor {
        label: None,
        size,
        usage: wgpu::BufferUsages::MAP_READ | wgpu::BufferUsages::COPY_DST,
        mapped_at_creation: false,
    });

    // Instantiates buffer with data (`numbers`).
    // Usage allowing the buffer to be:
    //   A storage buffer (can be bound within a bind group and thus available to a shader).
    //   The destination of a copy.
    //   The source of a copy.
    let storage_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("Storage Buffer"),
        contents: bytemuck::cast_slice(&numbers),
        usage: wgpu::BufferUsages::STORAGE
            | wgpu::BufferUsages::COPY_DST
            | wgpu::BufferUsages::COPY_SRC,
    });

    // A bind group defines how buffers are accessed by shaders.
    // It is to WebGPU what a descriptor set is to Vulkan.
    // `binding` here refers to the `binding` of a buffer in the shader (`layout(set = 0, binding = 0) buffer`).

    // A pipeline specifies the operation of a shader

    // Instantiates the pipeline.
    let compute_pipeline = device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
        label: None,
        layout: None,
        module: &cs_module,
        entry_point: "main",
    });

    // Instantiates the bind group, once again specifying the binding of buffers.
    let bind_group_layout = compute_pipeline.get_bind_group_layout(0);
    let bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
        label: None,
        layout: &bind_group_layout,
        entries: &[wgpu::BindGroupEntry {
            binding: 0,
            resource: storage_buffer.as_entire_binding(),
        }],
    });

    // A command encoder executes one or many pipelines.
    // It is to WebGPU what a command buffer is to Vulkan.
    let mut encoder =
        device.create_command_encoder(&wgpu::CommandEncoderDescriptor { label: None });
    {
        let mut cpass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor { label: None });
        cpass.set_pipeline(&compute_pipeline);
        cpass.set_bind_group(0, &bind_group, &[]);
        cpass.insert_debug_marker("compute collatz iterations");
        cpass.dispatch(numbers.len() as u32, 1, 1); // Number of cells to run, the (x,y,z) size of item being processed
    }
    // Sets adds copy operation to command encoder.
    // Will copy data from storage buffer on GPU to staging buffer on CPU.
    encoder.copy_buffer_to_buffer(&storage_buffer, 0, &staging_buffer, 0, size);

    // Submits command encoder for processing
    queue.submit(Some(encoder.finish()));

    // Note that we're not calling `.await` here.
    let buffer_slice = staging_buffer.slice(..);
    // Gets the future representing when `staging_buffer` can be read from
    let buffer_future = buffer_slice.map_async(wgpu::MapMode::Read);

    // Poll the device in a blocking manner so that our future resolves.
    // In an actual application, `device.poll(...)` should
    // be called in an event loop or on another thread.
    device.poll(wgpu::Maintain::Wait);

    let _ = buffer_future.map_err(map_err_to_jsvalue_).await?;
    // Gets contents of buffer
    let data = buffer_slice.get_mapped_range();
    // Since contents are got in bytes, this converts these bytes back to u32
    let result = bytemuck::cast_slice::<_, u32>(&data).to_vec();

    // With the current interface, we have to make sure all mapped views are
    // dropped before we unmap the buffer.
    drop(data);
    staging_buffer.unmap(); // Unmaps buffer from memory
                            // If you are familiar with C++ these 2 lines can be thought of similarly to:
                            //   delete myPointer;
                            //   myPointer = NULL;
                            // It effectively frees the memory

    let disp_steps: Vec<String> = result
        .iter()
        .map(|&n| match n {
            OVERFLOW => "OVERFLOW".to_string(),
            _ => n.to_string(),
        })
        .collect();

    console_log!("Steps: [{}]", disp_steps.join(", "));

    Ok(())
    // todo!()
}

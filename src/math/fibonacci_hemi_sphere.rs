use nalgebra::Vector3;

// const PHI:f32 = PI * ((3f32) - (5f32).sqrt());
// golden angle
const PHI: f32 = 2.399963229728653;

pub fn nth(sample_size: u32, i: u32) -> (Vector3<f32>, f32) {
    let sample_size_f = sample_size as f32;
    let f = i as f32;
    let y = 1f32 - (f / (sample_size_f - 1f32)); // y goes from 1 to 0 (hemisphere)
    let radius = (1f32 - y * y).sqrt(); //  # radius at y
    let theta = PHI * f; //  # golden angle increment
    let x = theta.cos() * radius;
    let z = theta.sin() * radius;
    (Vector3::new(x, y, z), y.asin())
}

use std::f32::consts::PI;

pub fn fibonacci_hemi_sphere(sample_size:u32) -> Vec<f32> {
    let phi = PI * ((3f32) - (5f32).sqrt());
    let mut points: Vec<f32> = Vec::with_capacity((sample_size as usize) * 3);
    let sample_size_f = sample_size as f32;
    for i in 0..sample_size {
        let i_f = i as f32;
        let y = 1f32 - (i_f / (sample_size_f - 1f32)) * 2f32;  // y goes from 1 to -1
        let radius = (1f32 - y * y).sqrt(); //  # radius at y
        let theta = phi * i_f;//  # golden angle increment
        let x = theta.cos() * radius;
        let z = theta.sin() * radius;
        points.push(x);
        points.push(y);
        points.push(z);
    }
    return points;
}
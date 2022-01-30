use std::f32::consts::PI;
use nalgebra::{Vector3, Quaternion};

pub fn fibonacci_hemi_sphere(sample_size: u32) -> Vec<f32> {
    let phi = PI * ((3f32) - (5f32).sqrt());
    let mut points: Vec<f32> = Vec::with_capacity((sample_size as usize) * 4);
    let sample_size_f = sample_size as f32;
    for i in 0..sample_size {
        let i_f = i as f32;
        let y = 1f32 - (i_f / (sample_size_f - 1f32)); // y goes from 1 to 0 (hemisphere)
        let radius = (1f32 - y * y).sqrt(); //  # radius at y
        let theta = phi * i_f; //  # golden angle increment
        let x = theta.cos() * radius;
        let z = theta.sin() * radius;
        points.push(x);
        points.push(y);
        points.push(z);
        points.push(y.asin());
    }
    return points;
}

fn makeRotation(normalized_to: Vector3<f32>) -> Quaternion<f32> {
    let anchor = Vector3::new(0f32,1f32,0f32);
    let c = anchor.cross(&normalized_to);
    let w = anchor.dot(&normalized_to) + 1f32;
    let q = Quaternion::new(w, c.x, c.y, c.z);
    return q;
}
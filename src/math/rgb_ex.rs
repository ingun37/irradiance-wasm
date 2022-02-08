use image::Rgb;

pub type Rgbw = (Rgb<f32>, f32);
pub const zero:Rgbw = (Rgb([0f32,0f32,0f32]), 0f32);
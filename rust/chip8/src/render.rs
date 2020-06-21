pub struct Pixel {
  r: u8,
  g: u8,
  b: u8,
  a: u8,
}

pub trait Renderer {
  fn render(&self);
}

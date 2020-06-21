use super::render;
use std::ops::Add;
use std::string::String;
use term_size;

pub struct Terminal_Renderer {
  width: u16,
  height: u16,
}

impl render::Renderer for Terminal_Renderer {
  fn render(&self) {}
}

pub fn new(width: u16, height: u16) -> Terminal_Renderer {
  return Terminal_Renderer { width, height };
}
impl Terminal_Renderer {
  fn clear(&self) {
    print!("{}[2J", 27 as char);
  }
  pub fn render(&self, pixels: Vec<bool>) {
    if let Some((w, h)) = term_size::dimensions() {
      println!("Width: {}\nHeight: {}", w, h);
    } else {
      println!("Unable to get term size :(")
    }

    let mut out = String::new();
    for pixel in pixels {
      if pixel {
        out = out.add("\u{2588}");
      }
    }

    println!("{}", out);
    self.clear();
  }
}

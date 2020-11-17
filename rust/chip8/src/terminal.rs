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

  pub fn term_width_height(&self) -> (usize, usize) {
    let (w, h) = term_size::dimensions().expect("Error getting terminal dimensions");
    return (w, h);
  }

  pub fn render(&self, pixels: &Vec<bool>) {
    self.clear();
    let (w, h) = self.term_width_height();
    let mut out = String::new();
    for (i, pixel) in pixels.iter().enumerate() {
      if *pixel {
        out = out.add("\u{2588}");
      }

      if i != 0 && w / h % i == 0 {
        out = out.add("\n");
      }
    }

    println!("{}", out);
  }
}

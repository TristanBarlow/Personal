mod chip8;
mod render;
mod terminal;
use std::{thread, time};

fn main() {
  let mut chip = chip8::make();
  chip.init();
  chip.load();

  let gfx = terminal::new(100, 100);
  loop {
    let strt = time::SystemTime::now();
    chip.emulate();
    if chip.draw() {}
    gfx.render(vec![true, true, true]);

    chip.set_keys();

    let dif = strt.elapsed().expect("Error getting elapsed time");
    let wait_time = 16 - dif.as_millis();
    if wait_time > 0 {
      thread::sleep(time::Duration::from_millis(wait_time as u64));
    }
  }
}

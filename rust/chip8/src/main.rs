mod chip8;
use std::{thread, time};

fn main() {
    let mut chip = chip8::make();
    chip.init();
    chip.load();
    let sleep_time = time::Duration::from_millis(1000);
    loop {
        chip.emulate();
        if chip.draw() {
            println!("Drawing");
        }

        chip.set_keys();
        thread::sleep(sleep_time);
    }
}

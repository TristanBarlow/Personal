use wasm_bindgen::prelude::*;

fn main() {
    println!("Hello, world!");
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
    
}


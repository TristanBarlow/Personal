pub struct Chip8 {
  memory: [u8; 4096],
  V: [char; 16],
  gfx: [bool; 64 * 32],
  delay_timer: u16,
  sound_timer: u16,
  I: u16,
  program_counter: u16,
  stack: [u16; 16],
  stack_pointer: u16,
  key: [char; 16],
}

pub fn make() -> Chip8 {
  return Chip8 {
    memory: [0; 4096],
    V: ['0'; 16],
    gfx: [false; 64 * 32],
    delay_timer: 0,
    sound_timer: 0,
    I: 0,
    program_counter: 0,
    stack: [0; 16],
    stack_pointer: 0,
    key: ['0'; 16],
  };
}

const chip8_fontset: [u8; 80] = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

impl Chip8 {
  pub fn init(&mut self) {
    self.program_counter = 0x200;
    self.I = 0;
    self.stack_pointer = 0;
    for i in 0..80 {
      self.memory[i] = chip8_fontset[i];
    }
    println!("initialised chip8!");
  }

  pub fn emulate(&self) {
    let pc = self.program_counter as usize;
    //opcodes take up two bytes
    let opcode: u16 = (self.memory[pc] as u16) << 8 | (self.memory[pc + 1] as u16);
    println!("emulating");
  }

  pub fn load(&self) {
    println!("loading");
  }

  pub fn draw(&self) -> bool {
    return false;
  }

  pub fn set_keys(&self) {
    println!("setting keys");
  }
}

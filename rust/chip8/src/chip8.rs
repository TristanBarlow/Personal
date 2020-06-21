use std::fs::File;
use std::io::Read;

pub struct Chip8 {
  memory: [u8; 4096],
  V: [i8; 16],
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
    V: [0; 16],
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
    self.V = [0; 16];
    self.stack = [0; 16];
    self.gfx = [false; 64 * 32];
    self.memory = [0; 4096];
    for i in 0..80 {
      self.memory[i] = chip8_fontset[i];
    }
    println!("initialised chip8!");
  }

  pub fn load_game(&mut self, path: &str) {
    let mut file = File::open(path).expect("Could load game from file");
    let mut buff: Vec<u8> = vec![];
    let size = file
      .read_to_end(&mut buff)
      .expect("Failed to game file into buffer");

    println!("Read {} bytes into buffer", size);

    for i in 0..buff.len() {
      self.memory[i + 0x200] = buff[i];
    }
  }

  fn math_op(&mut self, opcode:u16){
     match opcode & 0x000F{
      0x0=>self.V[0]
     }
  }

  pub fn emulate(&mut self) {
    let pc = self.program_counter as usize;
    //opcodes take up two bytes
    let opcode: u16 = (self.memory[pc] as u16) << 8 | (self.memory[pc + 1] as u16);
    //get first 4 bits
    match opcode & 0xF000 {
      0x0000 => match opcode & 0x000F {
        // Clear screen
        0 => self.gfx = [false; 64 * 32],
        //return from subroutine
        0xE => println!("Return from subroutine"),
        _ => println!("Opcode starting with 0 not found opcode: 0x{}", opcode),
      },
      0xA000 => {
        self.I = opcode & 0x0FFF;
        self.program_counter += 2;
      }
      //Jump to subroutine
      0x2000 => {
        self.stack[self.stack_pointer as usize] = self.program_counter;
        self.stack_pointer += 1;
        self.program_counter = opcode & 0x0FFF;
      }
      //Maths
      0x8000 => self.math_op(opcode)
      _ => println!("Opcode not found: 0x{}", opcode),
    }

    if self.delay_timer > 0 {
      self.delay_timer -= 1;
    }

    if self.sound_timer > 0 {
      if self.sound_timer == 1 {
        println!("beeep");
      }
      self.sound_timer -= 1;
    }
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

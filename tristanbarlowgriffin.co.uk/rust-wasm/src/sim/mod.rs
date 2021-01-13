pub struct World {
  
}

pub fn make_world() -> i32 {
  return 10;
}

#[cfg(test)]
mod test {
  use super::*;
  #[test]
  fn it_works() {
    print!("fooo");
    assert_eq!(make_world(), 10);
  }
}

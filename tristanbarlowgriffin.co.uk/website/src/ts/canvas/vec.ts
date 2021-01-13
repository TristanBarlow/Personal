export class Vec {
  constructor(public x: number, public y: number) {
    
  }

  static n (x: number, y: number){
    return new Vec(x, y)
  }
}

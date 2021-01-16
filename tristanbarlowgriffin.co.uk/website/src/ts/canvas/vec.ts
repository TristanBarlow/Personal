export class Vec {
  constructor(public x: number, public y: number) {
    
  }

  static rotAnti(v: Vec){
    return Vec.n(v.y, -v.x)
  }

  static reflectY(v:Vec){
    return Vec.n(v.x * - 1, v.y)
  }

  eq(b: Vec){
    return this.x === b.x && this.y === b.y
  }

  toString(){
    return `(${this.x}, ${this.y})`
  }

  static n (x = 0, y = 0){
    return new Vec(x, y)
  }

  static add (a:Vec, b:Vec) {
    return Vec.n(a.x + b.x, a.y + b.y)
  }

  static eq(a: Vec, b: Vec) {
    return a.x === b.x && a.y === b.y
  }
}

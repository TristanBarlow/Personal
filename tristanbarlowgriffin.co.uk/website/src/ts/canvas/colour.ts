export class Colour {
  constructor (private r: number, private g: number, private b: number, private a: number){

  }

  add(c:Colour){
    this.r += c.r
    this.g += c.g
    this.b += c.b
    this.a += c.a
    return this
  }

  scale(v:number){
    this.r *= v
    this.g *= v
    this.b *= v
    this.a *= v
    return this
  }

  toString(){
    return `rgba(${this.r * 255},${this.g * 255},${this.b * 255},${this.a})`
  }
  
  static n(r = 1, g = 1, b = 1, a=1){
    return new Colour(r, g, b, a)
  }
}
export class Colour {
  constructor (private r: number, private g: number, private b: number, private a: number){

  }

  toString(){
    return `rgba(${this.r * 255},${this.g * 255},${this.b * 255},${this.a})`
  }
  
  static n(r = 1, g = 1, b = 1, a=1){
    return new Colour(r, g, b, a)
  }
}
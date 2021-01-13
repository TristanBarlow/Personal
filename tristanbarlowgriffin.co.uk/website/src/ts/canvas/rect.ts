export class Rect {
  constructor(public x:number, public y:number, public w:number, public h:number){

  }

  static n(x = 1, y = 1, w = 1, h = 1){
    return new Rect(x, y, w, h)
  }
}
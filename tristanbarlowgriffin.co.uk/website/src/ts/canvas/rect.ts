export class Rect {
  constructor(public x:number, public y:number, public w:number, public h:number){

  }

  static n(x:number, y:number, w:number, h:number){
    return new Rect(x, y, w, h)
  }
}
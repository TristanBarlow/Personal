import { Colour } from "./colour"
import { Rect } from "./rect"
export * from './colour'
export * from './rect'
export * from './vec'

export class MyCanvas {
  private readonly canvas: CanvasRenderingContext2D

  constructor(private readonly canvasEle: HTMLCanvasElement){
    const canvas = this.canvasEle.getContext('2d')
    if(!canvas) {
      throw Error(`Could not get 2d context`)
    }
    
    this.canvas = canvas
  }

  public clear () {
    this.canvas.clearRect(0, 0, 10000, 10000)
  }

  public drawRect (rect: Rect, col: Colour) {
    this.canvas.fillStyle = col.toString()
    this.canvas.fillRect(rect.x, rect.y, rect.w, rect.h)
  }

}
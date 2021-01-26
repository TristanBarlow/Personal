import { Colour, ColourMap, MyCanvas, Rect, Vec } from "../canvas"
import './rule'
import { makeRules } from "./rule"
import { WaveFunctionSettings, WaveFunction } from './waveFunction'
import { getPixelData } from '../canvas/getImageData'

type TerrainType = 'L' | 'M' | 'S' | 'C' | 'H' | 'None'

export const terrains: ColourMap = {
  'L': Colour.n(0, 125, 0),
  'M': Colour.n(255, 0, 0),
  'C': Colour.n(100, 100, 50),
  'H': Colour.n(125, 125, 125),
  'S': Colour.n(0, 0, 255),
}

export class Model {
  private waveFunction: WaveFunction
  constructor(public readonly settings: WaveFunctionSettings){
    this.waveFunction = new WaveFunction(settings)
  }

  get colourMap(){
    return this.settings.inputModel.colourMap
  }

  get isDone(){
    return this.waveFunction.isFullyCollapsed()
  }

  run() {
    while(!this.waveFunction.isFullyCollapsed()){
      this.iterate()
    }
  }

  iterate(): boolean {
    const pos = this.waveFunction.minEntropyPos
    if(!pos){
      return false
    }
    this.waveFunction.collapse(pos.x, pos.y)
    this.propagate(pos)
    return true
  }

  propagate(pos: Vec){
    const stack = [pos]
    while (stack.length) {
      const cPos = stack.pop()
      if(!cPos) return
      const curTiles = this.waveFunction.get(cPos.x, cPos.y)
      const adjecent = this.waveFunction.getAdjacent(cPos)
      adjecent.forEach(({ aPos ,dir }) =>{
        const aOps = this.waveFunction.get(aPos.x, aPos.y)
        if(aOps.length === 1){
          return
        }

        aOps.forEach(tile =>{
          if (!curTiles.some(curTile => this.settings.inputModel.check(curTile, tile, dir))){
            this.waveFunction.constrain(aPos, tile)
            stack.push(aPos)
          }
        })
      })      
    }
  }

  draw(canvas: MyCanvas){
    canvas.clear()
    this.waveFunction.iterateTiles((x, y, o)=>{      
      let i = 0
      const options = o.map(x=> x.split('.'))
      const { patternSize } = this.settings
      for(let y2= y; y2 < y + patternSize; y2++){
        for(let x2 = x; x2 < x + patternSize; x2++){
          const c = Colour.n(0,0,0,0)
          let validOps = 0
          options.forEach(pattern => {
            const p = pattern[i]
            if(!this.colourMap[pattern[i]]){
              return
            }
            validOps++
            c.add(this.colourMap[pattern[i]])
          })   

          canvas.drawRect(Rect.n(x2 * 10, y2 * 10, 10, 10), c.scale(1/validOps))
          i++
        }
      }
    })
  }
}

export async function makeModel(){
  const colours =  [
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'M', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','M', 'S', 'M', 'L', 'L', 'L', 'L'],
    ['L','L','L','M', 'M', 'M', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'M', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['L','L','L','L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['C','C','C','C', 'C', 'C', 'C', 'C', 'C', 'C'],
    ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ].map(row=> row.map(colour => terrains[colour]))
  const inputModel = makeRules(2, colours)

  return new Model({ h: 100, w: 100, inputModel, patternSize: 2 })
}

export async function makeModelImage(src: string){
  const colours = await getPixelData(src)
  if(!colours) return
  const inputModel = makeRules(2, colours)
  return new Model({ h: 50, w: 50, inputModel, patternSize: 2 })
}

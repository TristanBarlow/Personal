import { Colour, MyCanvas, Rect, Vec } from "../canvas"
import './rule'
import { makeRules } from "./rule"
import { WaveFunctionSettings, WaveFunction } from './waveFunction'

type TerrainType = 'L' | 'M' | 'S' | 'C' | 'H' | 'None'

interface Terrain {
  type: TerrainType
  colour: Colour
}

export const terrains: Terrain[] = [
  { colour: Colour.n(0, .5, 0), type: 'L' },
  { colour: Colour.n(1, 0, 0), type: 'M' },
  { colour: Colour.n(.4, .4, .2), type: 'C' },
  { colour: Colour.n(.5, .5, .5), type: 'H' },
  { colour: Colour.n(0, 0, 1), type: 'S' },
]

type TerrainMap = {[id:string]: Terrain}
export const terrainMap: TerrainMap = terrains.reduce<TerrainMap>((current, next)=> {
  current[next.type] = next
  return current
}, {} as any)

export class Model {
  private waveFunction: WaveFunction
  constructor(public readonly settings: WaveFunctionSettings){
    this.waveFunction = new WaveFunction(settings)
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
      const options = o.map(x=> x.split(','))
      const { patternSize } = this.settings
      for(let y2= y; y2 < y + patternSize; y2++){
        for(let x2 = x; x2 < x + patternSize; x2++){
          const c = Colour.n(0,0,0,0)
          let validOps = 0
          options.forEach(pattern => {
            const p = pattern[i]
            if(!terrainMap[pattern[i]]){
              return
            }
            validOps++
            c.add(terrainMap[pattern[i]].colour)
          })   

          canvas.drawRect(Rect.n(x2 * 10, y2 * 10, 10, 10), c.scale(1/validOps))
          i++
        }
      }
    })
  }
}


export function makeModel(){
  const inputModel = makeRules(2, 
  // [
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','C', 'C', 'C', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','C', 'M', 'C', 'C', 'S', 'S', 'S'],
  //   ['S','S','S','C', 'M', 'M', 'C', 'C', 'S', 'S'],
  //   ['S','S','S','C', 'M', 'M', 'M', 'C', 'S', 'S'],
  //   ['S','S','S','C', 'C', 'M', 'M', 'C', 'C', 'S'],
  //   ['S','S','S','S', 'C', 'M', 'C', 'C', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'C', 'C', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'C', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  // ],
  // [
  //   ['S','S','C','L', 'M', 'M', 'L', 'C', 'S', 'S'],
  //   ['S','S','C','L', 'L', 'L', 'L', 'C', 'S', 'S'],
  //   ['S','S','C','L', 'L', 'L', 'L', 'C', 'S', 'S'],
  //   ['S','S','S','C', 'C', 'C', 'C', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  //   ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  // ],
    [
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
    ]
  )

  return new Model({ h: 200, w: 200, inputModel, patternSize: 3 })
}
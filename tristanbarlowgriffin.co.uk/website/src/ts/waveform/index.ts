import { Colour, MyCanvas, Rect, Vec } from "../canvas"
import './rule'
import { makeRules } from "./rule"
import { WaveFunctionSettings, WaveFunction, OutTile } from './waveFunction'

type TerrainType = 'L' | 'M' | 'S' | 'C' | 'H' | 'None'

interface Terrain {
  type: TerrainType
  colour: Colour
}

export const terrains: Terrain[] = [
  { colour: Colour.n(0, 1, 0), type: 'L' },
  { colour: Colour.n(1, 0, 0), type: 'M' },
  { colour: Colour.n(1, 1, 0), type: 'C' },
  { colour: Colour.n(.5, .5, .5), type: 'H' },
  { colour: Colour.n(0, 0, 1), type: 'S' },
]

const white = Colour.n()

type TerrainMap = {[id:string]: Terrain}
export const terrainMap: TerrainMap = terrains.reduce<TerrainMap>((current, next)=> {
  current[next.type] = next
  return current
}, {} as any)

export class Model {
  private tiles: OutTile[] = []
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

  iterate() {
    const pos = this.waveFunction.minEntropyPos
    this.waveFunction.collapse(pos.x, pos.y)
    this.propagate(pos)
    this.tiles = this.waveFunction.getAsTiles()
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
        aOps.forEach(tile =>{
          if (!curTiles.some(curTile => this.settings.rules.check(curTile, tile, dir))){
            this.waveFunction.constrain(aPos, tile)
            stack.push(aPos)
          }
        })
      })      
    }
  }

  draw(canvas: MyCanvas){
    canvas.clear()
    this.tiles.forEach(({ pos, tile })=> {
      canvas.drawRect(Rect.n(pos.x * 10, pos.y * 10, 10, 10), terrainMap[tile]?.colour || white)
    })
  }
}


export function makeModel(){
  const [weights, rules] = makeRules([
    ['L','L','L','L'],
    ['L','L','L','L'],
    ['L','L','L','L'],
    ['L','C','C','L'],
    ['C','S','S','C'],
    ['S','S','S','S'],
    ['S','S','S','S'],
  ],
  [
    ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['S','S','S','S', 'S', 'C', 'S', 'S', 'S', 'S'],
    ['S','S','S','C', 'C', 'M', 'C', 'C', 'S', 'S'],
    ['S','S','S','C', 'M', 'M', 'M', 'C', 'S', 'S'],
    ['S','S','S','C', 'M', 'M', 'M', 'C', 'S', 'S'],
    ['S','S','S','C', 'M', 'M', 'M', 'C', 'S', 'S'],
    ['S','S','S','C', 'M', 'M', 'M', 'C', 'S', 'S'],
    ['S','S','S','C', 'C', 'M', 'C', 'C', 'S', 'S'],
    ['S','S','S','S', 'S', 'C', 'S', 'S', 'S', 'S'],
    ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['S','S','S','S', 'S', 'S', 'S', 'S', 'S', 'S'],
  ])

  return new Model({ h: 50, w: 50, rules, weights, tileset: terrains.map(x=> x.type) })
}
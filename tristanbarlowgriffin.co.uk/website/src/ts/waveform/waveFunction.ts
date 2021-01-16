import { InputModel, dirs } from "./rule"
import { cloneDeep } from 'lodash'
import { Vec } from "../canvas"

export type Option = string[]
export type Options = Option[][]
type Iter = (x: number, y: number, o:Option)=> (void | true)
export interface WaveFunctionSettings{
  w: number
  h: number
  patternSize: number
  inputModel: InputModel
}
type Adj = {aPos:Vec, dir: Vec}
export type OutTile = {pos:Vec, tile: string}
export class WaveFunction {
  tiles: Options

  get hPatterns() {
    return this.settings.h / this.pSize
  }

  get wPatterns() {
    return this.settings.w / this.pSize
  }

  constructor(public readonly settings: WaveFunctionSettings){
    this.tiles = []
    const tileset = Object.keys(this.weights)
    const { w, h, patternSize } = settings
    for(let x = 0; x < w / patternSize; x++) {
      const row: string[][] = []
      for(let y = 0 ; y < h / patternSize; y++) {
        row.push(cloneDeep(tileset))
      }
      this.tiles.push(row)
    }
  }

  get pSize() {
    return this.settings.patternSize
  }

  getPattern (x: number, y: number) {
    const out = new Array(this.pSize * this.pSize)
    for(let x = 0; x < this.pSize; x++){
      for(let y = 0; y < this.pSize; y++){
        out.push()
      }
    }
    return out
  }

  isValidPos(x: number, y: number){
    return x >= 0 && y >= 0
          && y < this.tiles.length 
          && x < this.tiles[y].length
  }

  getAdjacent (pos: Vec): Adj[] {
    const out: Adj[] = []
    dirs.forEach(dir => {
      const aPos = Vec.add(pos, dir)
      if(this.isValidPos(aPos.x, aPos.y)){
        out.push({ aPos, dir })
      }
    })

    return out
  }

  iterateTiles(iter: Iter){
    const w = this.wPatterns
    const h = this.hPatterns
    for(let x = 0; x < w; x++) {
      for(let y = 0 ; y < h; y++) {
        const stop = iter(x, y, this.tiles[y][x])
        if(stop) return
      }
    }
  }

  get rules () {
    return this.settings.inputModel.rules
  }

  get weights () {
    return this.settings.inputModel.weights
  }

  get(x:number, y:number){
    return this.tiles[y][x]
  }

  set(x:number, y:number, v: string[]){
    return this.tiles[y][x] = v
  }

  getWeight(id: string){
    return this.weights[id] || 0
  }

  collapse(x: number, y:number){
    const options = this.get(x,y)
    let totalWeights = 0
    const items = options.map((o)=> {
      const w = this.getWeight(o)
      totalWeights += w
      return { w, o }
    }, 0)

    let rnd = Math.random() * totalWeights
    let opt = ''
    for(const item of items){
      if((rnd -= item.w) < 0){
        opt = item.o
        break 
      }
    }

    this.set(x,y, [opt])
  }

  constrain(pos: Vec, tile: string) {
    const ops = this.get(pos.x, pos.y)
    this.set(pos.x, pos.y, ops.filter(x => x !== tile))
  }

  get minEntropyPos (): Vec | null {
    let min = 0
    let pos: Vec | null = null

    this.iterateTiles((x, y, o)=>{
      if(o.length <= 1) return
      const e = this.entropy(x, y)
      if(e > min){
        min = e
        pos = Vec.n(x, y)
      }
    })

    if(!pos){
      console.log('NOUT')
      return null
    }

    return pos 
  }

  isFullyCollapsed () {
    let isFinished = true
    this.iterateTiles((x, y, o)=>{
      if(o.length > 1) {
        isFinished = false
        return true
      }
    })

    return isFinished
  }

  entropy(x: number, y: number, addNoise = true){
    let sumOfWeights = 0
    let sumOfWeightsLog = 0
    this.get(x,y).forEach(tile =>{
      const weight = this.weights[tile] || 0
      sumOfWeights += weight
      sumOfWeightsLog += weight * Math.log(weight)
    })

    const entropy = Math.log(sumOfWeights) - (sumOfWeightsLog / sumOfWeights)
    return addNoise ? entropy + (Math.random() / 10000) : entropy 
  }
}
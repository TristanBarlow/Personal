import { clone } from 'lodash'
import { Vec } from '../canvas/vec'

function join(out:string, add:string){
  return `${out ? ',' : ''}${add}`
}

function rotatePattern(pattern: string, patternSize: number){
  const parts = pattern.split(',')
  let out = ''
  for(let y = 0; y < patternSize; y++){
    for(let x = 0; x < patternSize; x++){
      out += join(out, parts[patternSize - 1 - y + x * patternSize])
    }
  }
  return out
}

function reflectPattern (pattern: string, patternSize: number){
  const parts = pattern.split(',')
  let out = ''
  for(let y = 0; y < patternSize; y++){
    for(let x = 0; x < patternSize; x++){
      out += join(out, parts[patternSize - 1 - x + y * patternSize])
    }
  }
  return out
}

function arrToPatter(input: string[][]){
  let out = ''
  for(let y = 0; y < input.length; y++){
    const row = input[y]
    for(let x = 0; x < row.length; x++){
      out += join(out, input[y][x])
    }
  }
  return out
}

function rotateClockWise(matrix: string[][]) {
  const size = matrix.length
  const out = clone(matrix)

  for (let i = 0; i < size; ++i) 
    for (let j = 0; j < size; ++j) 
      out[i][j] = matrix[size - j - 1][i] //***

  return out
}

export class Rule {
  constructor(public one: string, public two: string, public dir: Vec, private patternSize: number){
  } 

  madeAdditionalRules (): Rule[] {
    const rotateOne = rotatePattern(this.one,  this.patternSize)
    const rotateTwo = rotatePattern(this.two,  this.patternSize)
    const rotateVec = Vec.rotAnti(this.dir)

    const reflectOne = reflectPattern(this.one,  this.patternSize)
    const reflectTwo = reflectPattern(this.two,  this.patternSize)
    const reflectDir = Vec.reflectY(this.dir)

    const reflectRotateOne = reflectPattern(rotateOne, this.patternSize)
    const reflectRotateTwo = reflectPattern(rotateTwo, this.patternSize)
    const reflectRotateDir = Vec.reflectY(rotateVec)

    return [
      new Rule(rotateOne, rotateTwo, rotateVec, this.patternSize),
      new Rule(reflectOne, reflectTwo, reflectDir, this.patternSize),
      new Rule(reflectRotateOne, reflectRotateTwo, reflectRotateDir, this.patternSize),
    ]
  }

  toString(){
    return Rule.toString(this.one, this.two, this.dir)
  }

  static toString(one: string, two: string, dir: Vec){
    return `${one}->${two} ${dir.toString()}`
  }
}

export class InputModel {
  constructor(private patternSize: number) {}
  public rules: {[id:string]: Rule} = {}
  public weights:{[id:string]:number} = {}

  addRule(r: Rule){
    if(this.rules[r.toString()]){
      return
    }
    return this.rules[r.toString()] = r
  }

  addWeight(pattern: string){
    this.weights[pattern] ? this.weights[pattern]++ : this.weights[pattern] = 1
  }

  addAdditionalRules(){
    for(const rule in this.rules){
      this.rules[rule].madeAdditionalRules().forEach(r=>{
        this.addRule(r)
        this.addWeight(r.one)
      })
    }
  }

  check(one: string, two: string, dir: Vec){
    return !!this.rules[Rule.toString(one, two, dir)]
  }
}

const dirMap = {
  up: Vec.n(0, 1),
  down: Vec.n(0, -1),
  left: Vec.n(1, 0),
  right: Vec.n(-1, 0),
}

export type Weights ={[id: string]: number}

export const dirs = Object.values(dirMap)
export function validLoc(x: number, y: number, arr: any[][]): boolean {
  return x >= 0 && y >= 0
   && y < arr.length 
   && x < arr[y].length
}

export function makeRules(patternSize: number, ...inputs: (string[][])[]): InputModel {
  const inputModel = new InputModel(patternSize)

  const patternMap:{[id:string]:string} = {}
  const getPattern = (x: number, y: number, input: string[][]) => {
    const key = `${x}${y}`
    if(patternMap[key]){
      return patternMap[key]
    } 

    let out = ''
    for(let y2 = y; y2 < y + patternSize; y2++){
      for(let x2 = x; x2 < x + patternSize; x2++){
        if(validLoc(x2, y2, input)){
          out += `${out ? ',' : ''}${input[y2][x2]}`
        } else {
          return ''
        }
      }
    }

    return patternMap[key] = out
  }

  inputs.forEach(input=>{
    for(let y = 0; y < input.length; y++){
      const row = input[y]
      for(let x = 0; x < row.length; x++){
        const pattern = getPattern(x, y, input)
        if(!pattern) continue
        inputModel.addWeight(pattern)
        dirs.forEach(d => {
          const ox = x + d.x
          const oy = y + d.y
          const otherPattern = getPattern(ox, oy, input)
          if(!otherPattern) return
          inputModel.addRule(new Rule(pattern, otherPattern, d, patternSize))
        })
      }
    }
  })

  inputModel.addAdditionalRules()
  console.log(inputModel)
  return inputModel
}


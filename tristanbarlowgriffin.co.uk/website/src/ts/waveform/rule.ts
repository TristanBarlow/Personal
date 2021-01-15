import { isValid } from 'date-fns'
import { Vec } from '../canvas/vec'

export class Rule {
  constructor(public one: string, public two: string, public dir: Vec){
    
  }
  toString(){
    return Rule.toString(this.one, this.two, this.dir)
  }

  static toString(one: string, two: string, dir: Vec){
    return `${one}->${two} ${dir.toString()}`
  }
}

export class Rules {
  constructor(private patternSize: number) {}
  private rules: {[id:string]: Rule} = {}
  addRule(r: Rule){
    return this.rules[r.toString()] = r
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

export function makeRules(patternSize: number, ...inputs: (string[][])[]): [Weights, Rules] {
  const rules = new Rules(patternSize)
  const weights: Weights = {}

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
        weights[pattern] ? weights[pattern]++ : weights[pattern] = 1
        dirs.forEach(d => {
          const ox = x + d.x
          const oy = y + d.y
          const otherPattern = getPattern(ox, oy, input)
          if(!otherPattern) return
          rules.addRule(new Rule(pattern, otherPattern, d))
        })
      }
    }
  })

  console.log(weights)
  return [weights, rules]
}

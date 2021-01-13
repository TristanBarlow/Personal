import { Vec } from '../canvas/vec'

export class Rule {
  constructor(public one: string, public two: string, public dir: Vec){}
  toString(){
    return Rule.toString(this.one, this.two, this.dir)
  }

  static toString(one: string, two: string, dir: Vec){
    return `${one}->${two} ${dir.toString()}`
  }
}

export class Rules {
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

export function makeRules(...inputs: (string[][])[]): [Weights, Rules] {
  const rules = new Rules()
  const weights: Weights = {}
  inputs.forEach(input=>{
    for(let y = 0; y < input.length; y++){
      const row = input[y]
      for(let x = 0; x < row.length; x++){
        const tile = row[x]
        weights[tile] ? weights[tile]++ : weights[tile] = 1
        dirs.forEach(d => {
          const ox = x + d.x
          const oy = y + d.y
          if(validLoc(ox, oy, input)){
            const other = input[oy][ox]
            rules.addRule(new Rule(tile, other, d))
          }
        })
      }
    }
  })

  return [weights, rules]
}

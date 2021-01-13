import { Colour, MyCanvas, Rect, Vec } from "../canvas"

type TerrainType = 'Land' | 'Mountains' | 'Sea' | 'Coast' | 'None'

interface Terrain {
  type: TerrainType
  colour: Colour
}

interface Tile {
  pos: Vec
  terrainType: TerrainType
}

export const terrains: Terrain[] = [
  { colour: Colour.n(0, 1, 0), type: 'Land' },
  { colour: Colour.n(1, 0, 0), type: 'Mountains' },
  { colour: Colour.n(1, 1, 0), type: 'Coast' },
  { colour: Colour.n(0, 0, 1), type: 'Sea' },
  { colour: Colour.n(), type: 'None' },
]

type TerrainMap = {[P in TerrainType]: Terrain}
export const terrainMap: TerrainMap = terrains.reduce<TerrainMap>((current, next)=> {
  current[next.type] = next
  return current
}, {} as any)

export class Waveform {
  private tiles: Tile[][]
  constructor(w: number, h: number){
    const tiles: Tile[][] = []
    for(let y = 0; y < h; y++) {
      const row:Tile[] = []
      for(let x = 0; x < w; x++) {
        row.push({ pos: Vec.n(x, y), terrainType: terrains[Math.floor(Math.random() * 5)].type })
      }
      tiles.push(row)
    }
    this.tiles = tiles
  }
  

  draw(canvas: MyCanvas){
    canvas.clear()
    for(let y = 0; y < this.tiles.length; y++){
      const row = this.tiles[y]
      for(let x = 0; x < row.length; x++){
        const tile = row[x]
        canvas.drawRect(Rect.n(x * 10, y * 10, 10, 10), terrainMap[tile.terrainType].colour)
      }

    }
  }
}
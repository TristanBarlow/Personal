import { Colour } from "./colour"

export async function getPixelData(src: string){
  const image =  new Image()
  const prom = new Promise<void>((resolve) =>{
    image.addEventListener('load', () => {
      console.log('Loaded', image)
      resolve()
    }, false)
  })
  image.src = src

  await prom
  const c = document.createElement('canvas') 
  const canvas = c.getContext("2d")
  if(!canvas) return
  c.width = image.width
  c.height = image.height
  canvas.drawImage(image, 0, 0)
  const { data } = canvas.getImageData(0, 0, image.width, image.height)
  const arr: Colour[] = new Array(Math.ceil(data.length/4))
  for(let i = 0; i < data.length/4; i++){
    const startI = i * 4
    arr[i] = new Colour(data[startI], data[startI+1], data[startI+2], data[startI+3])
  }

  let i = 0
  const out: Colour[][] = new Array(image.height)
  for(let y = 0; y< image.height; y++){
    const row = new Array(image.width)
    out[y] = row
    for(let x =0; x < image.width; x++){
      row[x] = arr[i]
      i++   
    }
  }
  return out
}

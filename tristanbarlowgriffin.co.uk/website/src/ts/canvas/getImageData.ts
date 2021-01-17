export async function getPixelData(src: string){
  const image = document.createElement('img')
  image.src = src
  await new Promise<void>((resolve) =>{
    image.onload = () => {
      console.log('Loaded')
      resolve()
    }
  })

  const c = document.createElement('canvas') 
  const canvas = c.getContext("2d")
  if(!canvas) return

  canvas.drawImage(image, image.width, image.height)
  const { data } = canvas.getImageData(0, 0, image.width, image.height)
  data.forEach(console.log)
  document.removeChild(c) 
}
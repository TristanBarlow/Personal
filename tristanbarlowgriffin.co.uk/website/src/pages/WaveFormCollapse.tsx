import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import Button from '../components/Button'
import { makeModel } from '../ts/waveform'
import { MyCanvas } from '../ts/canvas'

export default function WaveFormCollapse ()   {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>()
  const [refresh, setRefresh] = useState(false)
  useEffect(()=>{
    if(canvas) {
      
      let timeout:any
      const m = makeModel()
      const c = new MyCanvas(canvas)
      const run = () => setTimeout(()=> {
        console.log('Iter')
        m.iterate()
        m.draw(c)
        if(m.isDone){
          console.log('Finsihed')
        }
        timeout = run()
      }, 100)
      run()
      return () =>  clearTimeout(timeout)
    }
  },[canvas, refresh])
  return (
    <Flex flexDir="column">
      <Button w="fit-content" mb={2} label="refresh" click={()=> setRefresh(!refresh)}/>
      <canvas style={{ width: '1000px', height: '1000px' }} ref={setCanvas}/>
    </Flex>
  )
}
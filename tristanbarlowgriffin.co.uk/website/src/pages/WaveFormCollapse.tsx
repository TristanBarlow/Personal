import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { MyCanvas } from '../ts/canvas'
import { Waveform } from '../ts/waveform/'
import Button from '../components/Button'

export default function WaveFormCollapse ()   {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>()
  const [refresh, setRefresh] = useState(false)
  useEffect(()=>{
    if(canvas) {
      new Waveform(50, 50).draw(new MyCanvas(canvas))
    }
  },[canvas, refresh])
  return (
    <Flex>
      <Button click={()=> setRefresh(!refresh)}/>
      <canvas ref={setCanvas}/>
    </Flex>
  )
}
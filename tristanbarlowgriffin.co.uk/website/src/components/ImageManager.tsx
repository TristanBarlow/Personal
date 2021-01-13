import React, { useState } from 'react'
import ImageUpload from './ImageUpload'
import { ImageMeta } from '../../../packages/types/src/project'
import { apiRequest } from '../ts/request'
import ImageEle from './Image'
import { useImages } from '../ts/projects'
import { Flex, Text } from '@chakra-ui/react'
import Button from './Button'

export default function ImageManager () {
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [activeImage, setActiveImage] = useState<ImageMeta | null>(null)
  const [images] = useImages(refresh)

  async function deleteImage (id: string) {
    await apiRequest('/api/image/' + id, 'DELETE')
    setRefresh(!refresh)
  }

  function showUpload (img: ImageMeta | null) {
    setShowImageUpload(true)
    setActiveImage(img)
    setRefresh(!refresh)
  }

  function closeUpload () {
    setShowImageUpload(false)
    setActiveImage(null)
    setRefresh(!refresh)
  }

  return (
    <Flex flexDir="column" w="100%">
      <Button
        click={ () => setShowImageUpload(true) }
        style={ { width: 'fit-content' } }
        className="button is-primary">
        Upload New Image
      </Button>

      <Flex w="100%" flexWrap="wrap" py={ 2 }>
        {
          images.map(x => (
            <Flex mb={ 2 } mr={ 2 } p={ 2 } bg="white" className="shadow-1" borderRadius="4px" flexDirection="column" w="300px" key={ x.name } >
              <Text fontSize="lg">Name: { x.name }</Text>
              <Text fontSize="lg">Views: { x.viewed }</Text>
              <ImageEle height='200px' meta={ x } />
              <Flex w="100%" className="center" mt={ 1 } justifyContent="space-around">
                <button onClick={ () => showUpload(x) } className="button is-link"> Update</button>
                <button onClick={ () => deleteImage(x.name) } className="button is-danger"> Delete</button>
              </Flex>
            </Flex>
          ))
        }
      </Flex>
      { showImageUpload && <ImageUpload meta={ activeImage } close={ closeUpload } /> }
    </Flex>
  )
}
import { FC, useEffect } from 'react'
import MediaCardItemUI from './MediaCardItemUI'
import { useDrag } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { getEmptyImage } from 'react-dnd-html5-backend'

const MediaCardItem: FC<{
  title: string
  thumbnail: string
}> = ({ title, thumbnail }) => {
  const [collect, dragger, preview] = useDrag(() => ({
    type: EDragType.MEDIA_CARD,
    item: { title, thumbnail }
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <div ref={dragger}>
      <MediaCardItemUI title={title} thumbnail={thumbnail} />
    </div>
  )
}

export default MediaCardItem

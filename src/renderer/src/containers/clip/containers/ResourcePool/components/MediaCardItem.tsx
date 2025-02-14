import { FC, useEffect, useRef } from 'react'
import MediaCardItemUI from './MediaCardItemUI'
import { useDrag } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { getEmptyImage } from 'react-dnd-html5-backend'

const MediaCardItem: FC<{
  title: string
  thumbnail: string
}> = ({ title, thumbnail }) => {
  const ref = useRef<HTMLDivElement>(null)

  const [collect, dragger, preview] = useDrag(() => ({
    type: EDragType.MEDIA_CARD,
    item: { title, thumbnail, domRef: ref }
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  dragger(ref)

  return (
    <div ref={ref}>
      <MediaCardItemUI title={title} thumbnail={thumbnail} />
    </div>
  )
}

export default MediaCardItem

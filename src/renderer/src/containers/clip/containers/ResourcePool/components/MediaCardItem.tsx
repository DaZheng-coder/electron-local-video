import { FC, useEffect, useRef } from 'react'
import MediaCardItemUI from './MediaCardItemUI'
import { useDrag } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/dragUtils'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { IDragMediaItem } from '@renderer/src/types'
import { IVideoData } from '@typings/index'

const MediaCardItem: FC<{
  data: IVideoData
}> = ({ data }) => {
  const { title, thumbnail } = data
  const ref = useRef<HTMLDivElement>(null)

  const [collect, dragger, preview] = useDrag<IDragMediaItem, unknown, unknown>(() => {
    return {
      type: EDragType.MEDIA_CARD,
      item: {
        mediaData: data,
        domRef: ref
      }
    }
  })

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

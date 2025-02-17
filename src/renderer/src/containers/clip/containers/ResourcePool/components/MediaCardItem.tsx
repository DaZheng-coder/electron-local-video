import { FC, useEffect, useRef } from 'react'
import MediaCardItemUI from './MediaCardItemUI'
import { useDrag } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/dragUtils'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { IVideoData } from '@typings/index'
import { IDragItem } from '@renderer/src/types'

const MediaCardItem: FC<{
  data: IVideoData
}> = ({ data }) => {
  const { title, thumbnail } = data
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragger, preview] = useDrag<IDragItem, unknown, { isDragging: boolean }>(
    () => {
      return {
        type: EDragType.MEDIA_CARD,
        item: {
          data,
          domRef: ref
        }
      }
    }
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  dragger(ref)

  return (
    <div ref={ref}>
      <MediaCardItemUI
        title={title}
        thumbnail={thumbnail}
        style={{ opacity: isDragging ? '0.8' : '1' }}
      />
    </div>
  )
}

export default MediaCardItem

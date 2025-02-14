import BaseCustomDragLayer, {
  getDragLayerItemStyles,
  TRenderDragLayer
} from '@renderer/src/components/BaseCustomDragLayer'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { memo, useCallback } from 'react'
import MediaCardItemUI from '../containers/ResourcePool/components/MediaCardItemUI'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragMediaItem } from '@renderer/src/types'

const GlobalCustomDragLayer = () => {
  const tracksDomRef = dragStore((state) => state.tracksDomRef)
  const renderDragLayer: TRenderDragLayer<IDragMediaItem> = useCallback(
    ({ itemType, item, clientOffset, initialOffset, sourceClientOffset }) => {
      if (itemType && ![EDragType.MEDIA_CARD].includes(itemType)) return null

      const style = getDragLayerItemStyles({
        initialOffset,
        sourceClientOffset
      })

      switch (itemType) {
        case EDragType.MEDIA_CARD: {
          const trackDomRect = tracksDomRef?.current?.getBoundingClientRect()
          const hidden = trackDomRect && clientOffset && clientOffset?.y > trackDomRect.top
          return (
            <MediaCardItemUI
              style={style}
              className={hidden ? 'opacity-0' : ''}
              title={item.title}
              thumbnail={item.thumbnail}
            />
          )
        }
        default:
          return null
      }
    },
    [tracksDomRef]
  )

  return <BaseCustomDragLayer<IDragMediaItem> renderDragLayer={renderDragLayer} />
}

export default memo(GlobalCustomDragLayer)

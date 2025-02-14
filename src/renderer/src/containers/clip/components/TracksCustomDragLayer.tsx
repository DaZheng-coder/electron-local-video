import React, { useCallback } from 'react'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import BaseCustomDragLayer, {
  getDragLayerItemStyles
} from '@renderer/src/components/BaseCustomDragLayer'
import { IDragCellItem } from '@renderer/src/utils/trackUtils'
import CellItemUI from '../containers/TracksDomain/components/Tracks/components/CellItem/CellItemUI'
import dragStore from '@renderer/src/stores/dragStore'

/**
 * 轨道拖拽层
 * @param param0
 * @returns
 */
const TracksCustomDragLayer: React.FC = () => {
  const tracksDomRef = dragStore((state) => state.tracksDomRef)

  const renderDragLayer = useCallback(
    ({ itemType, item, initialOffset, sourceClientOffset, clientOffset }) => {
      if (itemType && ![EDragType.MEDIA_CARD, EDragType.MEDIA_CARD].includes(itemType)) return null

      const style = getDragLayerItemStyles({
        initialOffset,
        sourceClientOffset,
        containerRef: tracksDomRef
      })

      switch (itemType) {
        case EDragType.CELL_ITEM: {
          const computedStyle = window.getComputedStyle(item.domRef.current)
          return (
            <CellItemUI
              style={{
                ...style,
                width: item.cellData.width,
                fontSize: computedStyle.fontSize,
                opacity: 1,
                color: computedStyle.color
              }}
              title={item.cellId}
            />
          )
        }
        case EDragType.MEDIA_CARD: {
          const trackDomRect = tracksDomRef?.current?.getBoundingClientRect()
          const visible = trackDomRect && clientOffset && clientOffset?.y > trackDomRect.top
          style.WebkitTransform = `translate(${clientOffset.x}px, ${clientOffset.y - TRACK_HEIGHT / 2}px)`
          return (
            <CellItemUI
              style={{
                // *** Test
                ...style,
                width: 200,
                // fontSize: computedStyle.fontSize,
                opacity: visible ? 1 : 0
                // color: computedStyle.color
              }}
              title={item.cellId}
            />
          )
        }
        default:
          return null
      }
    },
    [tracksDomRef]
  )

  return <BaseCustomDragLayer<IDragCellItem> renderDragLayer={renderDragLayer} />
}

export default React.memo(TracksCustomDragLayer)

import BaseCustomDragLayer, {
  getDragLayerItemStyles,
  TRenderDragLayer
} from '@renderer/src/components/BaseCustomDragLayer'
import { EDragType, IDragCellItem, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { CSSProperties, memo, useCallback } from 'react'
import MediaCardItemUI from '../containers/ResourcePool/components/MediaCardItemUI'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragMediaItem } from '@renderer/src/types'
import CellItemUI from '../containers/TracksDomain/components/Tracks/components/CellItem/CellItemUI'

type TGlobalDragType = IDragCellItem | IDragMediaItem

const getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
  if (elt) {
    return window.getComputedStyle(elt, pseudoElt)
  } else {
    return {} as CSSProperties
  }
}

const GlobalCustomDragLayer = () => {
  const tracksDomRef = dragStore((state) => state.tracksDomRef)
  const renderDragLayer: TRenderDragLayer<TGlobalDragType> = useCallback(
    ({ itemType, item, clientOffset, initialOffset, sourceClientOffset }) => {
      if (itemType && ![EDragType.MEDIA_CARD, EDragType.CELL_ITEM].includes(itemType)) return null

      const style = getDragLayerItemStyles({
        initialOffset,
        sourceClientOffset,
        containerRef: itemType === EDragType.CELL_ITEM ? tracksDomRef : null
      })

      switch (itemType) {
        case EDragType.CELL_ITEM: {
          const dragData = item as IDragCellItem
          const computedStyle = getComputedStyle(dragData.domRef!.current!)
          return (
            <CellItemUI
              style={{
                ...style,
                width: dragData.cellData.width,
                fontSize: computedStyle.fontSize,
                opacity: 1,
                color: computedStyle.color
              }}
              title={dragData.cellId}
            />
          )
        }
        case EDragType.MEDIA_CARD: {
          const dragData = item as IDragMediaItem
          const trackDomRect = tracksDomRef?.current?.getBoundingClientRect()
          const overInTracks = trackDomRect && clientOffset && clientOffset?.y > trackDomRect.top
          const cptType = overInTracks ? 'CellItemUI' : 'MediaCardItemUI'

          if (overInTracks) {
            style.WebkitTransform = `translate(${clientOffset.x}px, ${clientOffset.y - TRACK_HEIGHT / 2}px)`
          }

          if (cptType === 'CellItemUI') {
            return (
              <CellItemUI
                style={{
                  // *** Test
                  ...style,
                  width: 200,
                  // fontSize: computedStyle.fontSize,
                  opacity: 1
                  // color: computedStyle.color
                }}
                title={dragData.cellId}
              />
            )
          } else if (cptType === 'MediaCardItemUI') {
            return (
              <MediaCardItemUI
                style={style}
                title={dragData.title}
                thumbnail={dragData.thumbnail}
              />
            )
          } else {
            return null
          }
        }
        default:
          return null
      }
    },
    [tracksDomRef]
  )

  return <BaseCustomDragLayer<TGlobalDragType> renderDragLayer={renderDragLayer} />
}

export default memo(GlobalCustomDragLayer)

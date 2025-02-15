import BaseCustomDragLayer, {
  getDragLayerItemStyles,
  TRenderDragLayer
} from '@renderer/src/components/BaseCustomDragLayer'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
import { CSSProperties, memo, useCallback } from 'react'
import MediaCardItemUI from '../containers/ResourcePool/components/MediaCardItemUI'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragCellItem, IDragMediaItem, TGlobalDragItem } from '@renderer/src/types'
import CellItemUI from '../containers/TracksDomain/components/Tracks/components/CellItem/CellItemUI'
import { LAYOUT_TOP_Z_INDEX } from '@renderer/src/constants'

const getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
  if (elt) {
    return window.getComputedStyle(elt, pseudoElt) as CSSProperties
  } else {
    return {} as CSSProperties
  }
}

const GlobalCustomDragLayer = () => {
  const tracksDomRef = dragStore((state) => state.tracksDomRef)

  const renderCellItemUI = useCallback(
    (dragData: IDragCellItem, computedStyle: CSSProperties, style: CSSProperties) => {
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
    },
    []
  )

  const renderMediaCardItemUI = useCallback(
    (dragData: IDragMediaItem, style: CSSProperties) => (
      <MediaCardItemUI
        style={style}
        title={dragData.mediaData.title}
        thumbnail={dragData.mediaData.thumbnail}
      />
    ),
    []
  )

  const renderDragLayer: TRenderDragLayer<TGlobalDragItem> = useCallback(
    ({ itemType, item, clientOffset, initialOffset, sourceClientOffset }) => {
      if (!initialOffset || !sourceClientOffset) return null
      // 0. 判断拖拽类型，减少不必要的计算
      if (itemType && ![EDragType.MEDIA_CARD, EDragType.CELL_ITEM].includes(itemType)) return null

      // 1. 获取偏移样式
      const style = getDragLayerItemStyles({
        initialOffset,
        sourceClientOffset
        // containerRef: itemType === EDragType.CELL_ITEM ? tracksDomRef : null
      })

      switch (itemType) {
        case EDragType.CELL_ITEM: {
          const dragData = item as IDragCellItem
          const trackDomRect = tracksDomRef?.current?.getBoundingClientRect()
          const computedStyle = getComputedStyle(dragData.domRef!.current!)

          const transform = `translate(${Math.max(sourceClientOffset.x, trackDomRect?.left || 0)}px, ${sourceClientOffset.y}px)`
          style.transform = transform
          style.WebkitTransform = transform

          return {
            renderResult: renderCellItemUI(dragData, computedStyle, style)
          }
        }

        case EDragType.MEDIA_CARD: {
          const dragData = item as IDragMediaItem
          const trackDomRect = tracksDomRef?.current?.getBoundingClientRect()
          const overInTracks = trackDomRect && clientOffset && clientOffset.y > trackDomRect.top

          // 如果拖拽到轨道上，需要将拖拽元素改为视频单元格，同时偏移到鼠标右边
          if (overInTracks) {
            const limitX = trackDomRect.left
            const x = Math.max(clientOffset.x, limitX)
            const y = clientOffset.y - TRACK_HEIGHT / 2
            const transform = `translate(${x}px, ${y}px)`
            style.transform = transform
            style.WebkitTransform = transform
          }

          if (overInTracks) {
            // *** test 转换mediaData为cellData
            const testData: IDragCellItem = {
              cellId: 'test',
              cellData: { width: 200, cellId: 'test', left: 0, trackId: '' }
            }
            return {
              renderResult: renderCellItemUI(
                testData,
                getComputedStyle(dragData.domRef!.current!),
                style
              )
            }
          } else {
            return {
              wrapStyle: { zIndex: LAYOUT_TOP_Z_INDEX },
              renderResult: renderMediaCardItemUI(dragData, style)
            }
          }
        }
        default:
          return null
      }
    },
    [tracksDomRef, renderCellItemUI, renderMediaCardItemUI]
  )

  return <BaseCustomDragLayer<TGlobalDragItem> renderDragLayer={renderDragLayer} />
}

export default memo(GlobalCustomDragLayer)

import BaseCustomDragLayer, {
  getDragLayerItemStyles,
  TRenderDragLayer
} from '@renderer/src/components/BaseCustomDragLayer'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
import { CSSProperties, memo, useCallback } from 'react'
import MediaCardItemUI from '../containers/ResourcePool/components/MediaCardItemUI'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragItem } from '@renderer/src/types'
import CellItemUI from '../containers/TracksDomain/components/Tracks/components/CellItem/CellItemUI'
import { LAYOUT_TOP_Z_INDEX } from '@renderer/src/constants'
import { getGridPixel } from '@renderer/src/utils/timelineUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { ICellData } from '@typings/track'
import { IVideoData } from '@typings/index'
import { getCellDataByVideoData } from '@renderer/src/utils/clipUtils'

const getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
  if (elt) {
    return window.getComputedStyle(elt, pseudoElt) as CSSProperties
  } else {
    return {} as CSSProperties
  }
}

const GlobalCustomDragLayer = () => {
  const tracksContainerDomRef = dragStore((state) => state.tracksContainerDomRef)
  const timelineScale = clipStore((state) => state.timelineScale)

  const renderCellItemUI = useCallback(
    (cellData: ICellData, computedStyle: CSSProperties, style: CSSProperties) => {
      const width = getGridPixel(timelineScale, cellData.frameCount)
      return (
        <CellItemUI
          style={{
            ...style,
            width,
            fontSize: computedStyle.fontSize,
            opacity: 1,
            color: computedStyle.color
          }}
          title={cellData.cellId}
        />
      )
    },
    [timelineScale]
  )

  const renderMediaCardItemUI = useCallback(
    (videoData: IVideoData, style: CSSProperties) => (
      <MediaCardItemUI style={style} title={videoData.title} thumbnail={videoData.thumbnail} />
    ),
    []
  )

  const renderDragLayer: TRenderDragLayer<IDragItem> = useCallback(
    ({ itemType, item, clientOffset, initialOffset, sourceClientOffset }) => {
      if (!initialOffset || !sourceClientOffset) return null
      // 0. 判断拖拽类型，减少不必要的计算
      if (itemType && ![EDragType.MEDIA_CARD, EDragType.CELL_ITEM].includes(itemType)) return null

      // 1. 获取偏移样式
      const style = getDragLayerItemStyles({
        initialOffset,
        sourceClientOffset
        // containerRef: itemType === EDragType.CELL_ITEM ? tracksContainerDomRef : null
      })

      switch (itemType) {
        case EDragType.CELL_ITEM: {
          const trackDomRect = tracksContainerDomRef?.current?.getBoundingClientRect()
          const computedStyle = getComputedStyle(item.domRef!.current!)

          const transform = `translate(${Math.max(sourceClientOffset.x, trackDomRect?.left || 0)}px, ${sourceClientOffset.y}px)`
          style.transform = transform
          style.WebkitTransform = transform

          return {
            renderResult: renderCellItemUI(item.data as ICellData, computedStyle, style)
          }
        }

        case EDragType.MEDIA_CARD: {
          const trackDomRect = tracksContainerDomRef?.current?.getBoundingClientRect()
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
            const cellData = getCellDataByVideoData(item.data as IVideoData)
            return {
              renderResult: renderCellItemUI(
                cellData,
                getComputedStyle(item.domRef!.current!),
                style
              )
            }
          } else {
            return {
              wrapStyle: { zIndex: LAYOUT_TOP_Z_INDEX },
              renderResult: renderMediaCardItemUI(item.data as IVideoData, style)
            }
          }
        }
        default:
          return null
      }
    },
    [tracksContainerDomRef, renderCellItemUI, renderMediaCardItemUI]
  )

  return <BaseCustomDragLayer<IDragItem> renderDragLayer={renderDragLayer} />
}

export default memo(GlobalCustomDragLayer)

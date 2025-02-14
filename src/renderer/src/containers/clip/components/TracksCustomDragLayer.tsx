import React, { useCallback } from 'react'
import { EDragType } from '@renderer/src/utils/trackUtils'
import BaseCustomDragLayer from '@renderer/src/components/BaseCustomDragLayer'
import { IDragCellItem } from '@renderer/src/utils/trackUtils'
import CellItemUI from '../containers/TracksDomain/components/Tracks/components/CellItem/CellItemUI'

/**
 * 轨道拖拽层
 * @param param0
 * @returns
 */
const TracksCustomDragLayer: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>
}> = ({ containerRef }) => {
  const renderDragLayer = useCallback(({ itemType, item, draggedElementStyle }) => {
    switch (itemType) {
      case EDragType.CELL_ITEM:
        return <CellItemUI style={draggedElementStyle} title={item.cellId} />
      default:
        return null
    }
  }, [])

  const getDraggedElementStyle = useCallback(({ itemType, item, computedStyle }) => {
    switch (itemType) {
      case EDragType.CELL_ITEM:
        return {
          width: item.cellData.width,
          fontSize: computedStyle.fontSize,
          opacity: 1,
          color: computedStyle.color
        }
      default:
        return null
    }
  }, [])

  return (
    <BaseCustomDragLayer<IDragCellItem>
      containerRef={containerRef}
      renderDragLayer={renderDragLayer}
      getDraggedElementStyle={getDraggedElementStyle}
    />
  )
}

export default React.memo(TracksCustomDragLayer)

// filepath: /Users/zhengjunqin/electron-local-video/src/renderer/src/components/CustomDragLayer.tsx
import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { useDragLayer } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import CellItemUI from '../TracksDomain/components/Tracks/components/CellItem/CellItemUI'

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

/**
 * 计算拖拽元素的位置
 * @param initialOffset 初始位置
 * @param currentOffset 当前位置
 * @returns 偏移样式
 */
function getItemStyles(initialOffset, currentOffset): CSSProperties {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

/**
 * 自定义拖拽层
 * @returns
 */
const CustomDragLayer: React.FC = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  const [draggedElementStyle, setDraggedElementStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (item && item.domRef) {
      const computedStyle = window.getComputedStyle(item.domRef.current)
      const style = {
        fontSize: computedStyle.fontSize,
        opacity: 1,
        color: computedStyle.color
      }
      setDraggedElementStyle(style)
    }
  }, [item])

  const renderDragLayer = useCallback(() => {
    switch (itemType) {
      case EDragType.CELL_ITEM:
        return <CellItemUI style={draggedElementStyle} title={item.cellId} />
      default:
        return null
    }
  }, [itemType, item, draggedElementStyle])

  if (!isDragging || !currentOffset) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>{renderDragLayer()}</div>
    </div>
  )
}

export default React.memo(CustomDragLayer)

import React, { CSSProperties, useEffect, useState } from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { IBaseDragItem } from '@renderer/src/types'

/**
 * 计算拖拽元素的位置
 * @param initialOffset 初始位置
 * @param currentOffset 当前位置
 * @returns 偏移样式
 */
export function getItemStyles(initialOffset, currentOffset): CSSProperties {
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

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

export interface ICustomDragLayerCollect<T extends IBaseDragItem> {
  item: T
  itemType: EDragType | null
  initialOffset: XYCoord | null
  currentOffset: XYCoord | null
  isDragging: boolean
}

export interface ICustomDragLayerProps<T extends IBaseDragItem> {
  renderDragLayer: (
    params: ICustomDragLayerCollect<T> & { draggedElementStyle: CSSProperties }
  ) => React.ReactNode
  getDraggedElementStyle: (params: {
    item: T
    itemType: EDragType
    computedStyle: CSSStyleDeclaration
  }) => CSSProperties | null
}

/**
 * 自定义拖拽层
 * @returns
 */
const BaseCustomDragLayer = <T extends IBaseDragItem>({
  renderDragLayer,
  getDraggedElementStyle
}: ICustomDragLayerProps<T>) => {
  const collect = useDragLayer<ICustomDragLayerCollect<T>, T>((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType() as EDragType,
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  const { itemType, isDragging, item, initialOffset, currentOffset } = collect

  const [draggedElementStyle, setDraggedElementStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (item && item.domRef.current && itemType) {
      const computedStyle = window.getComputedStyle(item.domRef.current)
      const style = getDraggedElementStyle({
        item,
        itemType,
        computedStyle
      })
      !!style && setDraggedElementStyle(style)
    }
  }, [item, itemType, getDraggedElementStyle])

  if (!isDragging || !currentOffset) {
    return null
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderDragLayer({
          ...collect,
          draggedElementStyle
        })}
      </div>
    </div>
  )
}

export default BaseCustomDragLayer

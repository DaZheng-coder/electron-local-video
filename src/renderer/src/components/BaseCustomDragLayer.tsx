import React, { CSSProperties, useEffect, useState } from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { IBaseDragItem } from '@renderer/src/types'

/**
 * 计算拖拽元素的位置
 * @param initialOffset 初始位置
 * @param currentOffset 当前位置
 * @param sourceClientOffset 源位置
 * @param containerRef 容器ref
 * @returns 偏移样式
 */
export function getItemStyles(
  initialOffset,
  currentOffset,
  sourceClientOffset,
  containerRef?: React.RefObject<HTMLDivElement>
): CSSProperties {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }

  let { x, y } = currentOffset

  // 获取容器坐标，计算拖拽边界，限制拖拽范围
  if (containerRef && containerRef.current) {
    const containerRect = containerRef.current.getBoundingClientRect()

    if (sourceClientOffset.x < containerRect.left) {
      x = containerRect.left
    }
    if (sourceClientOffset.x > containerRect.right) {
      x = containerRect.right
    }
    if (sourceClientOffset.y < containerRect.top) {
      y = containerRect.top
    }
    if (sourceClientOffset.y > containerRect.bottom) {
      y = containerRect.bottom
    }
  }

  const transform = `translate(${x}px, ${y}px)`

  return {
    transform,
    WebkitTransform: transform,
    userSelect: 'none'
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

/**
 * 自定义拖拽层收集
 * @param item 拖拽项
 * @param itemType 拖拽类型
 * @param initialOffset 初始位置
 * @param currentOffset 当前位置
 * @param sourceClientOffset 源位置
 * @param isDragging 是否拖拽中
 */
export interface ICustomDragLayerCollect<T extends IBaseDragItem> {
  item: T
  itemType: EDragType | null
  initialOffset: XYCoord | null
  currentOffset: XYCoord | null
  sourceClientOffset: XYCoord | null
  isDragging: boolean
}

/**
 * 自定义拖拽层属性
 */
export interface ICustomDragLayerProps<T extends IBaseDragItem> {
  // 拖拽容器
  containerRef?: React.RefObject<HTMLDivElement>
  // 渲染拖拽层元素
  renderDragLayer: (
    params: ICustomDragLayerCollect<T> & { draggedElementStyle: CSSProperties }
  ) => React.ReactNode
  // 获取拖拽元素样式
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
  getDraggedElementStyle,
  containerRef
}: ICustomDragLayerProps<T>) => {
  const collect = useDragLayer<ICustomDragLayerCollect<T>, T>((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType() as EDragType,
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  const { itemType, isDragging, item, initialOffset, currentOffset, sourceClientOffset } = collect

  const [draggedElementStyle, setDraggedElementStyle] = useState<React.CSSProperties>({})

  /**
   * 为拖拽层元素设置额外样式
   * 解决拖拽图层元素与被拖拽元素样式不一致问题
   */
  useEffect(() => {
    // 特殊处理，阻止响应原生drag事件
    // @ts-ignore TS2339
    const isNativeDragging = !!item?.dataTransfer
    if (!isNativeDragging && item && item.domRef.current && itemType) {
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
      <div style={getItemStyles(initialOffset, currentOffset, sourceClientOffset, containerRef)}>
        {renderDragLayer({
          ...collect,
          draggedElementStyle
        })}
      </div>
    </div>
  )
}

export default BaseCustomDragLayer

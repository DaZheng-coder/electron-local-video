import React, { CSSProperties } from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { IBaseDragItem } from '@renderer/src/types'

/**
 * 计算拖拽元素的位置
 * @param initialOffset 初始位置
 * @param sourceClientOffset 当前位置
 * @param containerRef 容器ref
 * @returns 偏移样式
 */
export function getDragLayerItemStyles(args: {
  initialOffset
  sourceClientOffset
  containerRef?: React.RefObject<HTMLDivElement> | null
}): CSSProperties {
  const { initialOffset, sourceClientOffset, containerRef } = args
  if (!initialOffset || !sourceClientOffset) {
    return {
      display: 'none'
    }
  }

  let { x, y } = sourceClientOffset

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
 * @param sourceClientOffset 当前位置
 * @param sourceClientOffset 源位置
 * @param isDragging 是否拖拽中
 */
export interface ICustomDragLayerCollect<T extends IBaseDragItem> {
  item: T
  itemType: EDragType | null
  initialOffset: XYCoord | null
  sourceClientOffset: XYCoord | null
  clientOffset: XYCoord | null
  isDragging: boolean
}

export type TRenderDragLayer<T extends IBaseDragItem> = (
  args: ICustomDragLayerCollect<T>
) => React.ReactNode

/**
 * 自定义拖拽层属性
 */
export interface ICustomDragLayerProps<T extends IBaseDragItem> {
  // 渲染拖拽层元素
  renderDragLayer: TRenderDragLayer<T>
}

/**
 * 自定义拖拽层
 * @returns
 */
const BaseCustomDragLayer = <T extends IBaseDragItem>({
  renderDragLayer
}: ICustomDragLayerProps<T>) => {
  const collect = useDragLayer<ICustomDragLayerCollect<T>, T>((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType() as EDragType,
    initialOffset: monitor.getInitialSourceClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  }))

  const { isDragging, sourceClientOffset } = collect

  if (!isDragging || !sourceClientOffset) {
    return null
  }

  return <div style={layerStyles}>{renderDragLayer(collect)}</div>
}

export default BaseCustomDragLayer

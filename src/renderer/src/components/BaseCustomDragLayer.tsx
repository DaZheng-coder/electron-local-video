import React, { CSSProperties } from 'react'
import { useDragLayer, XYCoord } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/dragUtils'
import { IDragItem } from '../types'

/**
 * 计算拖拽元素的位置
 * @param initialOffset 初始位置
 * @param sourceClientOffset 当前位置
 * @param containerRef 容器ref
 * @returns 偏移样式
 */
export function getDragLayerItemStyles(args: { initialOffset; sourceClientOffset }): CSSProperties {
  const { initialOffset, sourceClientOffset } = args
  if (!initialOffset || !sourceClientOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = sourceClientOffset

  const transform = `translate(${x}px, ${y}px)`

  return {
    transform,
    WebkitTransform: transform,
    userSelect: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
}

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
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
export interface ICustomDragLayerCollect<T extends IDragItem> {
  item: T
  itemType: EDragType | null
  initialOffset: XYCoord | null
  sourceClientOffset: XYCoord | null
  clientOffset: XYCoord | null
  isDragging: boolean
}

export type TRenderDragLayer<T extends IDragItem> = (args: ICustomDragLayerCollect<T>) => {
  wrapStyle?: React.CSSProperties
  renderResult: React.ReactNode
} | null

/**
 * 自定义拖拽层属性
 */
export interface ICustomDragLayerProps<T extends IDragItem> {
  // 渲染拖拽层元素
  renderDragLayer: TRenderDragLayer<T>
  zIndex?: number | string
}

/**
 * 自定义拖拽层
 * @returns
 */
const BaseCustomDragLayer = <T extends IDragItem>({
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
  const { wrapStyle = {}, renderResult = null } = renderDragLayer(collect) || {}

  return <div style={{ ...layerStyles, ...wrapStyle }}>{renderResult}</div>
}

export default BaseCustomDragLayer

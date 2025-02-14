import { ICellData, ITrackData } from '@typings/track'
import { DropTargetMonitor } from 'react-dnd'
import clipStore from '../stores/clipStore'
import { IDragCellItem } from '../types'

export const TRACK_HEIGHT = 80

export enum EDragType {
  MEDIA_CARD = 'MEDIA_CARD',
  CELL_ITEM = 'CELL_ITEM',
  TRACK_ITEM = 'TRACK_ITEM'
}

export enum EDragResultType {
  NEW_TRACK = 'NEW_TRACK',
  INSERT_CELL = 'INSERT_CELL'
}

/**
 * 获取在整个轨道容器里的拖拽结果
 * @param monitor
 * @param parentRef
 * @returns
 */
export const getDomainDragCellResult = (
  monitor: DropTargetMonitor,
  parentRef: React.RefObject<HTMLDivElement>
): { type: EDragResultType; insertIndex: number } | null => {
  // 0. 参数容错处理
  const clientOffset = monitor.getClientOffset()
  if (!parentRef.current || !clientOffset) return null

  // 1. 获取所有轨道元素，主轨道的等级为0
  const trackItems = Array.from(parentRef.current.children)
    .filter((child) => {
      return child.getAttribute('data-type') === EDragType.TRACK_ITEM
    })
    .sort(
      (a, b) =>
        parseInt(a.getAttribute('data-level') || '0') -
        parseInt(b.getAttribute('data-level') || '0')
    )

  // 2. 获取每个轨道的位置信息
  const trackRects: DOMRect[] = []
  for (let i = 0; i < trackItems.length; i++) {
    const child = trackItems[i]
    const childRect = child.getBoundingClientRect()
    trackRects.push(childRect)
  }

  // 3. 判断是否位于主轨下方空白区域
  if (clientOffset.y > trackRects[0].bottom) {
    return {
      type: EDragResultType.NEW_TRACK,
      insertIndex: 1
    }
  }

  // 4. 判断是否位于最后一个轨道的后面
  if (clientOffset.y < trackRects[trackRects.length - 1].top) {
    return {
      type: EDragResultType.NEW_TRACK,
      insertIndex: trackRects.length
    }
  }

  // 5. 判断是否位于轨道中或者轨道之间
  for (let i = 0; i < trackRects.length - 1; i++) {
    // // 判断是否位于轨道中
    // if (clientOffset.y >= trackRects[i].top && clientOffset.y <= trackRects[i].bottom) {
    //   // TODO 判断是否足够放下该元素
    //   return null
    // }
    // 判断是否位于轨道之间
    if (clientOffset.y < trackRects[i].top && clientOffset.y > trackRects[i + 1].bottom) {
      return {
        type: EDragResultType.NEW_TRACK,
        insertIndex: i + 1
      }
    }
  }

  return null
}

/**
 * 获取在轨道间拖拽cell的结果
 * @param monitor
 * @param trackRef
 * @param item
 * @param trackData
 * @returns
 */
export const getTrackDragCellResult = (
  monitor: DropTargetMonitor,
  trackRef: React.RefObject<HTMLDivElement>,
  item: IDragCellItem,
  trackData: ITrackData
): { left: number } | undefined => {
  // 0. 参数容错处理
  const sourceClientOffset = monitor.getSourceClientOffset()
  const clientOffset = monitor.getClientOffset()
  const trackRect = trackRef.current?.getBoundingClientRect()
  if (!trackRef.current || !clientOffset || !sourceClientOffset || !trackRect) return

  // 1. 计算拖拽cell的起始位置
  const startX = sourceClientOffset.x
  const endX = sourceClientOffset.x + item.cellData.width

  // 2. 获取除自身外,当前轨道的所有cell数据
  const allCells = clipStore.getState().cells
  const cells: ICellData[] = []
  for (const cellId of trackData.cellIds) {
    if (cellId === item.cellId) continue
    cells.push(allCells[cellId])
  }

  // 3. 特判当前轨道除自身外，没有其他cell的情况
  if (cells.length === 0) {
    return { left: startX }
  }

  // 4. 计算拖拽cell的位置
  let left: number | undefined = undefined

  // 5. 特判位于最后面的情况，直接放在最后
  if (startX > cells[cells.length - 1].left + cells[cells.length - 1].width) {
    left = startX
  }

  let pre = trackRect.left
  for (let i = 0; i < cells.length; i++) {
    if (startX > pre && endX < cells[i].left) {
      left = startX
      break
    }
    pre = cells[i].left + cells[i].width
  }

  if (left !== undefined) {
    return { left }
  }

  return
}

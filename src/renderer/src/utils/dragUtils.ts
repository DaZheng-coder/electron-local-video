import { DropTargetMonitor, XYCoord } from 'react-dnd'
import clipStore from '../stores/clipStore'
import dragStore from '../stores/dragStore'
import { IDragCellItem, IDragMediaItem, TGlobalDragItem } from '../types'

export const TRACK_HEIGHT = 80
export const TRACK_BORDER_TOP_WIDTH = 2

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
 * 获取拖拽单元的偏移量
 * - 拖拽源是视频单元格，此时起始相对鼠标位置有偏移，取视频块源点
 * - 拖拽源是视频资源时，此时起始位置是鼠标位置，取鼠标位置
 * @param monitor
 * @returns
 */
export const getDragCellOffset = (monitor: DropTargetMonitor): XYCoord | null => {
  const sourceClientOffset = monitor.getSourceClientOffset()
  const clientOffset = monitor.getClientOffset()
  switch (monitor.getItemType()) {
    case EDragType.CELL_ITEM:
      return {
        x: sourceClientOffset?.x || 0,
        y: clientOffset?.y || 0
      }
    case EDragType.MEDIA_CARD:
      return clientOffset
    default:
      return null
  }
}

/**
 * 通过媒体数据获取拖拽单元数据
 * @param mediaData
 * @returns
 */
export const getDragCellDataByMediaData = (mediaData: IDragMediaItem): IDragCellItem => {
  const data: IDragCellItem = {
    cellId: 'test',
    cellData: { width: 200, cellId: 'test', left: 0, trackId: '' }
  }
  return data
}

/**
 * 获取拖拽单元数据
 * @param monitor
 * @returns
 */
export const getDragCellData = (monitor: DropTargetMonitor): IDragCellItem | null => {
  const dragData: TGlobalDragItem = monitor.getItem()
  switch (monitor.getItemType()) {
    case EDragType.CELL_ITEM:
      return dragData as IDragCellItem
    case EDragType.MEDIA_CARD:
      return getDragCellDataByMediaData(dragData as IDragMediaItem)
    default:
      return null
  }
}

/**
 * 是否能插入到当前轨道中
 * @param cellId
 * @param draggingCellStart
 * @param draggingCellEnd
 * @param trackIndex
 * @param leftLimit
 * @returns
 */
export const canInsertToTrack = (
  cellId: string,
  draggingCellStart: number,
  draggingCellEnd: number,
  trackIndex: number,
  leftLimit: number
) => {
  const cells = clipStore.getState().cells
  const tracks = clipStore.getState().tracks
  const curTrackCells = tracks[trackIndex].cellIds
    .filter((id) => id !== cellId)
    .map((cellId) => cells[cellId])
    .sort((a, b) => a.left - b.left)
  let pre = leftLimit
  for (let j = 0; j < curTrackCells.length; j++) {
    if (draggingCellStart > pre && draggingCellEnd < curTrackCells[j].left) {
      // 可以成功插入到当前轨道中
      return true
    }
    pre = curTrackCells[j].left + curTrackCells[j].width
  }
  return draggingCellStart > pre
}

/**
 * 组装新建轨道的结果
 * @param index
 * @param left
 * @returns
 */
const createNewTrackResult = (index: number, left: number) => ({
  type: EDragResultType.NEW_TRACK,
  insertTrackIndex: index,
  left,
  top: -1
})

/**
 * 组装插入视频单元的结果
 * @param index
 * @param left
 * @param top
 * @returns
 */
const createInsertCellResult = (index: number, left: number, top: number) => ({
  type: EDragResultType.INSERT_CELL,
  insertTrackIndex: index,
  left,
  top
})

/**
 * 获取拖拽在轨道中的结果
 * @param monitor
 * @returns
 */
export const getDraggingInTracksResult = (
  monitor: DropTargetMonitor
): {
  type: EDragResultType
  left: number
  top: number
  insertTrackIndex: number
} | null => {
  const tracksWrapDomRef = dragStore.getState().tracksWrapDomRef
  const tracksWrapRect = tracksWrapDomRef?.current?.getBoundingClientRect()
  const clientOffset = monitor.getClientOffset() // 鼠标位置
  const sourceClientOffset = monitor.getSourceClientOffset() // 拖拽源位置
  const dragOffset = getDragCellOffset(monitor) // 最终拖拽位置

  const cellData = getDragCellData(monitor) // 拖拽的cell数据
  const tracks = clipStore.getState().tracks // 所有轨道数据

  if (
    !clientOffset ||
    !sourceClientOffset ||
    !dragOffset ||
    !cellData ||
    !tracksWrapDomRef ||
    !tracksWrapRect
  )
    return null

  // 1. 获取所有轨道元素及位置信息
  const trackItems = Array.from(tracksWrapDomRef.current?.children || [])
    .filter((child) => {
      return child.getAttribute('data-type') === EDragType.TRACK_ITEM
    })
    .sort(
      (a, b) =>
        parseInt(a.getAttribute('data-index') || '0') -
        parseInt(b.getAttribute('data-index') || '0')
    )

  const trackRects = trackItems.map((track) => track.getBoundingClientRect())

  const tracksLen = tracks.length
  const topLimit = tracksWrapRect.top
  const bottomLimit = tracksWrapRect.bottom

  const isWithinTrackBounds = (y: number) => y > topLimit && y < bottomLimit

  // 2. 根据鼠标位置是否在所有轨道内，判断是否需要新增轨道
  if (isWithinTrackBounds(dragOffset.y)) {
    // 2.1 找到当前位于哪个轨道、位于哪个轨道分割线
    for (let curTrackIndex = 0; curTrackIndex < trackRects.length; curTrackIndex++) {
      const curTrackRect = trackRects[curTrackIndex]
      if (dragOffset.y > curTrackRect.top && dragOffset.y < curTrackRect.bottom) {
        if (curTrackIndex === 0) {
          // 特判：归于主轨，直接插入
          return createInsertCellResult(
            curTrackIndex,
            dragOffset.x,
            curTrackRect.top - tracksWrapRect.top
          )
        }

        const draggingCellStart = dragOffset.x // 拖拽cell的起始位置
        const draggingCellEnd = dragOffset.x + cellData.cellData.width // 拖拽cell的结束位置

        // 2.1.1 当前轨道有空位置插入
        if (
          canInsertToTrack(
            cellData.cellId,
            draggingCellStart,
            draggingCellEnd,
            curTrackIndex,
            curTrackRect.left
          )
        ) {
          return createInsertCellResult(
            curTrackIndex,
            dragOffset.x,
            curTrackRect.top - tracksWrapRect.top
          )
        }

        // 2.1.2 当前轨道无空位置插入， 从第二个轨道到最后一个轨道找空位置插入
        for (let j = 1; j < tracksLen; j++) {
          if (j === curTrackIndex) continue
          if (
            canInsertToTrack(
              cellData.cellId,
              draggingCellStart,
              draggingCellEnd,
              j,
              trackRects[j].left
            )
          ) {
            return createInsertCellResult(j, dragOffset.x, trackRects[j].top - tracksWrapRect.top)
          }
        }

        // 2.1.3 所有轨道都没有空位置插入，新建轨道
        return createNewTrackResult(curTrackIndex, dragOffset.x)
      }

      // 2.1.4 位于轨道之间，直接新建轨道
      if (
        curTrackIndex + 1 < tracksLen &&
        dragOffset.y < curTrackRect.top &&
        dragOffset.y > trackRects[curTrackIndex + 1].bottom
      ) {
        return createNewTrackResult(curTrackIndex, dragOffset.x)
      }
    }
  } else {
    // 2.2 位于轨道边界，新建轨道： 位于轨道上边界，插入当前轨道后，位于轨道下边界，插入主轨后
    if (dragOffset.y < topLimit) {
      return createNewTrackResult(tracksLen - 1, dragOffset.x)
    } else if (dragOffset.y > bottomLimit) {
      return createNewTrackResult(0, dragOffset.x)
    }
  }

  return null
}

import { DropTargetMonitor, XYCoord } from 'react-dnd'
import clipStore from '../stores/clipStore'
import dragStore from '../stores/dragStore'
import { getGridFrame } from './timelineUtils'
import { IDragItem } from '../types'
import { getCellDataByVideoData } from './clipUtils'
import { IVideoData } from '@typings/index'
import { ICellData } from '@typings/track'

export const TRACK_HEIGHT = 80
export const TRACK_BORDER_TOP_WIDTH = 2
export const DRAGGING_PREVIEW_CELL_ID = 'DRAGGING_PREVIEW_CELL_ID'

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
export const getDragCellOffset = (
  monitor: DropTargetMonitor,
  wrapRect: DOMRect
): XYCoord | null => {
  const sourceClientOffset = monitor.getSourceClientOffset()
  const clientOffset = monitor.getClientOffset()
  switch (monitor.getItemType()) {
    case EDragType.CELL_ITEM:
      return {
        x: (sourceClientOffset?.x || 0) - wrapRect.left,
        y: clientOffset?.y || 0
      }
    case EDragType.MEDIA_CARD:
      return {
        x: (clientOffset?.x || 0) - wrapRect.left,
        y: clientOffset?.y || 0
      }
    default:
      return null
  }
}

// /**
//  * 通过媒体数据获取拖拽单元数据
//  * @param mediaData
//  * @returns
//  */
// export const getDragCellDataByMediaData = (mediaData: IDragMediaItem): IDragCellItem => {
//   const data: IDragCellItem = {
//     cellId: DRAGGING_PREVIEW_CELL_ID,
//     cellData: { width: 200, cellId: DRAGGING_PREVIEW_CELL_ID, left: 0, trackId: '' }
//   }
//   return data
// }

/**
 * 获取拖拽单元数据
 * @param monitor
 * @returns
 */
export const getDragCellData = (monitor: DropTargetMonitor<IDragItem>): IDragItem | null => {
  const item = monitor.getItem()
  switch (monitor.getItemType()) {
    case EDragType.CELL_ITEM:
      return item
    case EDragType.MEDIA_CARD:
      return {
        ...item,
        data: getCellDataByVideoData(item.data as IVideoData)
      }
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
  startFrame: number,
  frameCount: number,
  trackIndex: number
) => {
  const endFrame = startFrame + frameCount
  const cells = clipStore.getState().cells
  const tracks = clipStore.getState().tracks
  const curTrackCells = tracks[trackIndex].cellIds
    .filter((id) => id !== cellId)
    .map((cellId) => cells[cellId])
    .sort((a, b) => a.startFrame - b.startFrame)
  let pre = 0
  for (let j = 0; j < curTrackCells.length; j++) {
    if (startFrame > pre && endFrame < curTrackCells[j].startFrame) {
      // 可以成功插入到当前轨道中
      return true
    }
    pre = curTrackCells[j].startFrame + curTrackCells[j].frameCount
  }
  return startFrame > pre
}

/**
 * 组装新建轨道的结果
 * @param index
 * @param left
 * @returns
 */
const createNewTrackResult = (index: number, startFrame: number, frameCount: number) => ({
  type: EDragResultType.NEW_TRACK,
  insertTrackIndex: index,
  startFrame,
  frameCount,
  top: -1
})

/**
 * 组装插入视频单元的结果
 * @param index
 * @param left
 * @param top
 * @returns
 */
const createInsertCellResult = (
  index: number,
  startFrame: number,
  frameCount: number,
  top: number
) => {
  return {
    type: EDragResultType.INSERT_CELL,
    insertTrackIndex: index,
    startFrame,
    frameCount,
    top
  }
}

/**
 * 获取拖拽在轨道中的结果
 * @param monitor
 * @returns
 */
export const getDraggingInTracksResult = (
  monitor: DropTargetMonitor
): {
  type: EDragResultType
  startFrame: number
  frameCount: number
  top: number
  insertTrackIndex: number
} | null => {
  const tracksWrapDomRef = dragStore.getState().tracksWrapDomRef
  const timelineScale = clipStore.getState().timelineScale
  const tracksWrapRect = tracksWrapDomRef?.current?.getBoundingClientRect()
  if (!tracksWrapRect) return null
  const dragOffset = getDragCellOffset(monitor, tracksWrapRect) // 最终拖拽位置

  const cellData = getDragCellData(monitor)?.data as ICellData // 拖拽的cell数据
  const tracks = clipStore.getState().tracks // 所有轨道数据

  if (!dragOffset || !cellData || !tracksWrapDomRef || !tracksWrapRect) return null

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

  const startFrame = getGridFrame(timelineScale, dragOffset.x) // 拖拽cell的起始位置
  const cellId = cellData.cellId
  const frameCount = cellData.frameCount

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
            startFrame,
            frameCount,
            curTrackRect.top - tracksWrapRect.top
          )
        }

        // 2.1.1 当前轨道有空位置插入
        if (canInsertToTrack(cellId, startFrame, frameCount, curTrackIndex)) {
          return createInsertCellResult(
            curTrackIndex,
            startFrame,
            frameCount,
            curTrackRect.top - tracksWrapRect.top
          )
        }

        // 2.1.2 当前轨道无空位置插入， 从第二个轨道到最后一个轨道找空位置插入
        for (let j = 1; j < tracksLen; j++) {
          if (j === curTrackIndex) continue
          if (canInsertToTrack(cellId, startFrame, frameCount, j)) {
            return createInsertCellResult(
              j,
              startFrame,
              frameCount,
              trackRects[j].top - tracksWrapRect.top
            )
          }
        }

        // 2.1.3 所有轨道都没有空位置插入，新建轨道
        return createNewTrackResult(curTrackIndex, startFrame, frameCount)
      }

      // 2.1.4 位于轨道之间，直接新建轨道
      if (
        curTrackIndex + 1 < tracksLen &&
        dragOffset.y < curTrackRect.top &&
        dragOffset.y > trackRects[curTrackIndex + 1].bottom
      ) {
        return createNewTrackResult(curTrackIndex, startFrame, frameCount)
      }
    }
  } else {
    // 2.2 位于轨道边界，新建轨道： 位于轨道上边界，插入当前轨道后，位于轨道下边界，插入主轨后
    if (dragOffset.y < topLimit) {
      return createNewTrackResult(tracksLen - 1, startFrame, frameCount)
    } else if (dragOffset.y > bottomLimit) {
      return createNewTrackResult(0, startFrame, frameCount)
    }
  }

  return null
}

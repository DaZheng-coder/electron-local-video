import { ICellData, IPlayItem, ITrackData } from '@typings/track'
import clipStore from '../stores/clipStore'
import { IVideoData } from '@typings/index'
import resourceStore from '../stores/resourceStore'

export const sortMainTrackCells = (
  track: ITrackData,
  originCells?: Record<string, ICellData>
): {
  track: ITrackData
  cells: Record<string, ICellData>
} => {
  const cells = originCells || { ...clipStore.getState().cells }
  track.cellIds.sort((a, b) => cells[a].startFrame - cells[b].startFrame)
  let pre = 0
  for (let i = 0; i < track.cellIds.length; i++) {
    const cell = cells[track.cellIds[i]]
    cell.startFrame = pre
    pre = cell.startFrame + cell.frameCount
  }
  return { track, cells }
}

export const getCellDataByVideoData = (videoData: IVideoData) => {
  return {
    cellId: '',
    trackId: '',
    startFrame: 0,
    frameCount: videoData.frameCount,
    resourceId: videoData.id,
    selfStartFrame: 0
  }
}

export const getNearByCell = (cellId: string, trackIndex: number) => {
  const tracks = clipStore.getState().tracks
  const cells = clipStore.getState().cells
  const track = tracks[trackIndex]
  const trackCells = track.cellIds.sort((a, b) => cells[a].startFrame - cells[b].startFrame)
  const index = trackCells.findIndex((id) => id === cellId)
  const len = trackCells.length
  return {
    prevCell: index - 1 < 0 ? null : cells[trackCells[index - 1]],
    nextCell: index + 1 >= len ? null : cells[trackCells[index + 1]]
  }
}

/**
 * 通过当前帧获取当前帧所在的cell
 * @param frame
 * @param tracks
 */
export const getCellByCurrentFrame = (currentFrame: number) => {
  const tracks = clipStore.getState().tracks
  const cells = clipStore.getState().cells
  for (let i = tracks.length - 1; i >= 0; i--) {
    const track = tracks[i]
    for (let j = 0; j < track.cellIds.length; j++) {
      const cell = cells[track.cellIds[j]]
      if (cell.startFrame <= currentFrame && cell.startFrame + cell.frameCount > currentFrame) {
        return cell
      }
    }
  }
  return null
}

export const getTimeByFrame = (frame: number, fps: number = 30) => {
  return frame / fps
}

// export const getPlayCellQueue = (tracks: string[][], cells: IPlayItem[]) => {
//   // 创建cellId到track优先级的映射（track索引越高优先级越高）
//   const cellPriorityMap = new Map<string, number>()
//   tracks.forEach((trackCells, trackIndex) => {
//     trackCells.forEach((cellId) => {
//       cellPriorityMap.set(cellId, trackIndex)
//     })
//   })

//   // 过滤无效cell并按优先级排序
//   const sortedCells = cells
//     .filter((cell) => cellPriorityMap.has(cell.cellId))
//     .sort((a, b) => {
//       const priorityA = cellPriorityMap.get(a.cellId)!
//       const priorityB = cellPriorityMap.get(b.cellId)!
//       return priorityB - priorityA || a.startTime - b.startTime
//     })

//   const timeline: IPlayItem[] = []

//   sortedCells.forEach((currentCell) => {
//     const overlaps: { index: number; cell: IPlayItem }[] = []

//     // 查找所有重叠的现有cell
//     timeline.forEach((existingCell, index) => {
//       if (
//         currentCell.startTime < existingCell.endTime &&
//         currentCell.endTime > existingCell.startTime
//       ) {
//         overlaps.push({ index, cell: existingCell })
//       }
//     })

//     // 从后往前处理重叠
//     overlaps
//       .sort((a, b) => b.index - a.index)
//       .forEach(({ index, cell }) => {
//         const existing = timeline[index]

//         // 处理四种重叠情况
//         if (
//           currentCell.startTime <= existing.startTime &&
//           currentCell.endTime >= existing.endTime
//         ) {
//           timeline.splice(index, 1) // 完全覆盖
//         } else if (
//           currentCell.startTime > existing.startTime &&
//           currentCell.endTime < existing.endTime
//         ) {
//           // 分割为前后两部分
//           const before = { ...existing, endTime: currentCell.startTime }
//           const after = { ...existing, startTime: currentCell.endTime }
//           timeline.splice(index, 1)
//           if (before.startTime < before.endTime) timeline.splice(index, 0, before)
//           if (after.startTime < after.endTime) timeline.splice(index + 1, 0, after)
//         } else if (currentCell.startTime < existing.endTime) {
//           // 调整右侧边界
//           existing.endTime = currentCell.startTime
//           if (existing.startTime >= existing.endTime) timeline.splice(index, 1)
//         } else {
//           // 调整左侧边界
//           existing.startTime = currentCell.endTime
//           if (existing.startTime >= existing.endTime) timeline.splice(index, 1)
//         }
//       })

//     // 插入当前cell到正确位置
//     const insertIndex = timeline.findIndex((c) => c.startTime >= currentCell.startTime)
//     timeline.splice(insertIndex === -1 ? timeline.length : insertIndex, 0, {
//       ...currentCell,
//       duration: currentCell.endTime - currentCell.startTime
//     })
//   })

//   // 合并相邻cell（可选）
//   return timeline.sort((a, b) => a.startTime - b.startTime)
// }

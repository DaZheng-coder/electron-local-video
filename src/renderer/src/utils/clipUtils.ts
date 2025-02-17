import { ICellData, ITrackData } from '@typings/track'
import clipStore from '../stores/clipStore'
import { IVideoData } from '@typings/index'

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
    resourceId: videoData.id
  }
}

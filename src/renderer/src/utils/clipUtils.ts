import { ICellData, ITrackData } from '@typings/track'
import clipStore from '../stores/clipStore'

export const sortMainTrackCells = (
  track: ITrackData,
  originCells?: Record<string, ICellData>
): {
  track: ITrackData
  cells: Record<string, ICellData>
} => {
  const cells = originCells || { ...clipStore.getState().cells }
  track.cellIds.sort((a, b) => cells[a].left - cells[b].left)
  let pre = 0
  for (let i = 0; i < track.cellIds.length; i++) {
    const cell = cells[track.cellIds[i]]
    cell.left = pre
    pre = cell.left + cell.width
  }
  return { track, cells }
}

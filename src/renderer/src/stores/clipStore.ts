import { ICellData, ITrackData } from '@typings/track'
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { sortMainTrackCells } from '../utils/clipUtils'

interface IClipStore {
  timelineScale: number
  setTimelineScale: (scale: number) => void

  tracks: ITrackData[]
  setTracks: (tracks: ITrackData[]) => ITrackData[]
  addNewTrack: (index: number, cellIds?: string[]) => ITrackData
  removeTrack: (trackId: string) => void

  cells: Record<string, ICellData>
  createCell: (left: number, width: number, trackId: string) => ICellData
  removeCellInTrack: (cellId: string) => void
  addCellInTrack: (cellId: string, trackId: string) => void
  moveCellToTrack: (cellId: string, targetTrackId: string) => void
  updateCell: (cellId: string, data: Partial<ICellData>) => void
}

const cellId = uuid()

const trackId1 = uuid()

// *** test
const initCells: Record<string, ICellData> = {
  [cellId]: { cellId, left: 0, width: 200, trackId: trackId1 }
}
const initTracks: ITrackData[] = [{ trackId: trackId1, cellIds: [cellId] }]

const clipStore = create<IClipStore>((set, get) => ({
  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  },

  /**
   * 关于轨道的操作
   */
  tracks: initTracks.slice(),
  setTracks: (tracks: ITrackData[]) => {
    // 主轨需要贴近处理
    // const { track, cells } = sortMainTrackCells(tracks[0])
    // tracks[0] = track
    // set({ tracks, cells })
    set({ tracks })
    return tracks
  },
  addNewTrack: (index: number, cellIds: string[] = []) => {
    const tracks = get().tracks.slice()
    const trackId = uuid()
    const track = { trackId, cellIds }
    tracks.splice(index, 0, track)

    if (cellIds.length) {
      const cells = { ...get().cells }
      for (const cellId of cellIds) {
        cells[cellId].trackId = trackId
      }
      set({ cells })
    }

    get().setTracks(tracks)

    return track
  },
  removeTrack: (trackId: string) => {
    const oldTracks = get().tracks
    const newTracks: ITrackData[] = []
    for (let i = 0; i < oldTracks.length; i++) {
      const track = oldTracks[i]
      if (track.trackId !== trackId || i === 0) {
        newTracks.push(track)
      }
    }

    get().setTracks(newTracks)
  },

  /**
   * 关于cell的操作
   */
  cells: { ...initCells },
  createCell: (left: number, width: number, trackId: string) => {
    const id = uuid()
    const cells = { ...get().cells }
    const cell = { cellId: id, left, width, trackId }
    cells[id] = cell
    set({ cells })
    if (trackId) {
      get().addCellInTrack(cell.cellId, trackId)
    }
    return cell
  },
  removeCellInTrack: (cellId: string) => {
    const cells = { ...get().cells }
    const trackId = cells[cellId].trackId
    cells[cellId].trackId = ''

    const tracks = get().tracks.slice()
    const track = tracks.find((track) => track.trackId === trackId)
    if (!track) return
    track.cellIds = track.cellIds.filter((id) => id !== cellId)

    set({ cells })
    get().setTracks(tracks)

    // 当前轨道为空时，删掉该轨道
    if (!track.cellIds.length) {
      get().removeTrack(trackId)
    }
  },
  addCellInTrack: (cellId: string, trackId: string) => {
    const cells = { ...get().cells }
    cells[cellId].trackId = trackId

    const tracks = get().tracks.slice()
    const track = tracks.find((track) => track.trackId === trackId)
    if (!track) return
    if (track.cellIds.includes(cellId)) return
    track.cellIds.push(cellId)

    set({ cells })
    get().setTracks(tracks)
  },
  moveCellToTrack: (cellId: string, targetTrackId: string) => {
    const cells = { ...get().cells }
    const fromTrackId = cells[cellId].trackId
    if (fromTrackId === targetTrackId && fromTrackId !== get().tracks[0].trackId) {
      return
    } else {
      get().removeCellInTrack(cellId)
      get().addCellInTrack(cellId, targetTrackId)
    }
  },
  updateCell: (cellId: string, data: Partial<ICellData>) => {
    const cells = { ...get().cells }
    const oldCell = cells[cellId]
    const newCell = { ...oldCell, ...data }
    cells[cellId] = newCell
    set({ cells })
  }
}))

export default clipStore

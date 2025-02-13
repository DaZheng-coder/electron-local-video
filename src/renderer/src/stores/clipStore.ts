import { ICellData, ITrackData } from '@typings/track'
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

interface IClipStore {
  timelineScale: number
  setTimelineScale: (scale: number) => void

  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void

  tracks: ITrackData[]
  addNewTrack: (index: number, cellIds?: string[]) => void
  removeTrack: (trackId: string) => void

  cells: Record<string, ICellData>
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
const initTracks: ITrackData[] = [{ trackId: trackId1, trackLevel: 0, cellIds: [cellId] }]

const clipStore = create<IClipStore>((set, get) => ({
  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  },

  isDragging: false,
  setIsDragging: (isDragging: boolean) => {
    set({ isDragging })
  },

  /**
   * 关于轨道的操作
   */
  tracks: initTracks.slice(),
  addNewTrack: (index: number, cellIds: string[] = []) => {
    const tracks = get().tracks.slice()
    const trackId = uuid()
    tracks.splice(index, 0, { trackId, trackLevel: index, cellIds })

    if (cellIds.length) {
      const cells = { ...get().cells }
      for (const cellId of cellIds) {
        cells[cellId].trackId = trackId
      }
      set({ cells })
    }

    set({ tracks })
  },
  removeTrack: (trackId: string) => {
    const oldTracks = get().tracks
    const newTracks: ITrackData[] = []
    for (const track of oldTracks) {
      if (track.trackId !== trackId || track.trackLevel === 0) {
        newTracks.push(track)
      }
    }

    set({ tracks: newTracks })
  },

  /**
   * 关于cell的操作
   */
  cells: { ...initCells },
  removeCellInTrack: (cellId: string) => {
    const cells = { ...get().cells }
    const trackId = cells[cellId].trackId
    cells[cellId].trackId = ''

    const tracks = get().tracks.slice()
    const track = tracks.find((track) => track.trackId === trackId)
    if (!track) return
    track.cellIds = track.cellIds.filter((id) => id !== cellId)

    set({ cells, tracks })

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
    track.cellIds.push(cellId)

    set({ cells, tracks })
  },
  moveCellToTrack: (cellId: string, targetTrackId: string) => {
    const cells = get().cells
    const fromTrackId = cells[cellId].trackId
    if (fromTrackId === targetTrackId) {
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

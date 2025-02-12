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
  cells: ICellData[]
}

// *** test
const initCells: ICellData[] = [{ cellId: uuid(), left: 0, width: 100 }]
const initTracks: ITrackData[] = [
  { trackId: uuid(), trackLevel: 0, cellIds: initCells.map((cell) => cell.cellId) },
  { trackId: uuid(), trackLevel: 1, cellIds: initCells.map((cell) => cell.cellId) },
  { trackId: uuid(), trackLevel: 2, cellIds: initCells.map((cell) => cell.cellId) }
]

const clipStore = create<IClipStore>((set, get) => ({
  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  },
  isDragging: false,
  setIsDragging: (isDragging: boolean) => {
    set({ isDragging })
  },
  tracks: initTracks,
  addNewTrack: (index: number, cellIds: string[] = []) => {
    const tracks = get().tracks.slice()
    const trackId = uuid()
    tracks.splice(index, 0, { trackId, cellIds })
    set({ tracks })
  },
  cells: initCells
}))

export default clipStore

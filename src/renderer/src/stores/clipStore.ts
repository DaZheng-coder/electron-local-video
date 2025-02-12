import { ICellData, ITrackData } from '@typings/track'
import { create } from 'zustand'

interface IClipStore {
  timelineScale: number
  setTimelineScale: (scale: number) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  tracks: ITrackData[]
  addNewTrack: (index: number, cellIds?: string[]) => void
  cells: ICellData[]
}

const clipStore = create<IClipStore>((set, get) => ({
  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  },
  isDragging: false,
  setIsDragging: (isDragging: boolean) => {
    set({ isDragging })
  },
  tracks: [{ trackId: '00', cellIds: ['cell0'] }],
  addNewTrack: (index: number, cellIds: string[] = []) => {
    const tracks = get().tracks.slice()
    const trackId = '0' + tracks.length.toString()
    tracks.splice(index, 0, { trackId, cellIds })
    console.log('*** tracks', tracks)
    set({ tracks })
  },
  cells: [{ cellId: 'cell0' }]
}))

export default clipStore

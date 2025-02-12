import { ICellData, ITrackData } from '@typings/track'
import { create } from 'zustand'

interface IClipStore {
  timelineScale: number
  setTimelineScale: (scale: number) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  tracks: ITrackData[]
  pushNewTrack: () => void
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
  // *** test
  tracks: [{ trackId: '0', cellIds: ['cell0'] }],
  pushNewTrack: (cellIds: string[] = []) => {
    const tracks = get().tracks
    const trackId = tracks.length.toString()
    set({ tracks: [...tracks, { trackId, cellIds }] })
  },
  cells: [{ cellId: 'cell0' }]
}))

export default clipStore

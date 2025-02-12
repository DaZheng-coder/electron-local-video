import { create } from 'zustand'

interface IClipStore {
  timelineScale: number
  setTimelineScale: (scale: number) => void
}

const clipStore = create<IClipStore>((set, get) => ({
  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  }
}))

export default clipStore

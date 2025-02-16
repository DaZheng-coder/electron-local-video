import { create } from 'zustand'

interface IConfigStore {
  mainTrackMagnet: boolean
  setMainTrackMagnet: (mainTrackMagnet: boolean) => void
}

const configStore = create<IConfigStore>((set) => ({
  mainTrackMagnet: true,
  setMainTrackMagnet: (mainTrackMagnet) => set({ mainTrackMagnet })
}))

export default configStore

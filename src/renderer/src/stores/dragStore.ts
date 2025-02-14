import { create } from 'zustand'

interface IDragStore {
  tracksDomRef: React.RefObject<HTMLDivElement> | null
  setTracksDomRef: (tracksDomRef: React.RefObject<HTMLDivElement>) => void
}

const dragStore = create<IDragStore>((set) => ({
  tracksDomRef: null,
  setTracksDomRef: (tracksDomRef: React.RefObject<HTMLDivElement>) => set({ tracksDomRef })
}))

export default dragStore

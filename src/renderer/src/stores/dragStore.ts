import { create } from 'zustand'
import { EDragType } from '../utils/dragUtils'

export interface IDragSelectItem {
  id: string
  type: EDragType
}

interface IDragStore {
  selects: IDragSelectItem[]
  setSelects: (selects: IDragSelectItem[]) => void
  tracksDomRef: React.RefObject<HTMLDivElement> | null
  setTracksDomRef: (tracksDomRef: React.RefObject<HTMLDivElement>) => void
}

const dragStore = create<IDragStore>((set) => ({
  selects: [],
  setSelects: (selects: IDragSelectItem[]) => set({ selects }),
  tracksDomRef: null,
  setTracksDomRef: (tracksDomRef: React.RefObject<HTMLDivElement>) => set({ tracksDomRef })
}))

export default dragStore

import { create } from 'zustand'
import { EDragType } from '../utils/dragUtils'

export interface IDragSelectItem {
  id: string
  type: EDragType
}

interface IDragStore {
  selects: IDragSelectItem[]
  setSelects: (selects: IDragSelectItem[]) => void

  tracksContainerDomRef: React.RefObject<HTMLDivElement> | null
  setTracksContainerDomRef: (tracksContainerDomRef: React.RefObject<HTMLDivElement>) => void

  tracksWrapDomRef: React.RefObject<HTMLDivElement> | null
  setTracksWrapDomRef: (tracksWrapDomRef: React.RefObject<HTMLDivElement>) => void
}

const dragStore = create<IDragStore>((set) => ({
  selects: [],
  setSelects: (selects: IDragSelectItem[]) => set({ selects }),

  tracksContainerDomRef: null,
  setTracksContainerDomRef: (tracksContainerDomRef: React.RefObject<HTMLDivElement>) =>
    set({ tracksContainerDomRef }),

  tracksWrapDomRef: null,
  setTracksWrapDomRef: (tracksWrapDomRef: React.RefObject<HTMLDivElement>) =>
    set({ tracksWrapDomRef })
}))

export default dragStore

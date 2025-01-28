import { FileItem } from 'src/main/types/file'
import { create } from 'zustand'

export interface RenderStore {
  curFolder: FileItem | null
  selectFolder: (folder: FileItem) => void
}

const useRenderStore = create<RenderStore>((set, get) => ({
  curFolder: null,
  selectFolder: (folder: FileItem) => set({ curFolder: folder })
}))

export default useRenderStore

import { FileItem } from 'src/main/types/file'
import { create } from 'zustand'

export interface VideoStore {
  curVideo: FileItem | null
  setCurVideo: (video: FileItem) => void
}

const useVideoStore = create<VideoStore>((set) => ({
  curVideo: null,
  setCurVideo: (video) => {
    set({ curVideo: video })
  }
}))

export default useVideoStore

import { FileItem } from 'src/main/types/file'
import { create } from 'zustand'

export interface RenderStore {
  init: () => void
  curFolder: FileItem | null
  setCurFolder: (folder: FileItem) => void
  folderList: FileItem[]
  setFolderList: (newFolderList: FileItem[]) => void
}

const useRenderStore = create<RenderStore>((set, get) => ({
  init: async () => {
    const folderList = await window.store.get('folderList')
    if (folderList) set({ folderList })

    const curFolder = await window.store.get('curFolder')
    if (curFolder) set({ curFolder })
  },
  curFolder: null,
  setCurFolder: (folder: FileItem) => {
    set({ curFolder: folder })
    window.store.set('curFolder', folder)
  },
  folderList: [],
  setFolderList: async (newFolderList: FileItem[] = []) => {
    set({ folderList: newFolderList })
    window.store.set('folderList', newFolderList)
    if (!get().curFolder && newFolderList.length) {
      get().setCurFolder(newFolderList[0])
    }
  }
}))

useRenderStore.getState().init()

export default useRenderStore

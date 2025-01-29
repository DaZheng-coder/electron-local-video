import { CUR_FOLDER_KEY, FOLDER_LIST_KEY } from '@renderer/constants'
import { FileItem } from 'src/main/types/file'
import { create } from 'zustand'

export interface RenderStore {
  init: () => void
  curFolder: FileItem | null
  setCurFolder: (folder: FileItem) => void
  folderList: FileItem[]
  setFolderList: (newFolderList: FileItem[]) => void
}

const useFolderStore = create<RenderStore>((set) => ({
  init: async () => {
    const folderList = await window.store.get(FOLDER_LIST_KEY)
    if (folderList) set({ folderList })

    const curFolder = await window.store.get(CUR_FOLDER_KEY)
    if (curFolder) set({ curFolder })
  },

  curFolder: null,
  setCurFolder: (folder: FileItem) => {
    set({ curFolder: folder })
    window.store.set(CUR_FOLDER_KEY, folder)
  },

  folderList: [],
  setFolderList: async (newFolderList: FileItem[] = []) => {
    set({ folderList: newFolderList })
    window.store.set(FOLDER_LIST_KEY, newFolderList)
  }
}))

useFolderStore.getState().init()

export default useFolderStore

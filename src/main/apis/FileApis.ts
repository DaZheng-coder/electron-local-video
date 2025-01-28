import { FileItem } from '../types/file'

const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

const fileApis = {
  openFolderDialog: async (): Promise<FileItem | ''> => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (res.canceled) return ''
    return {
      name: path.basename(res.filePaths[0]),
      path: res.filePaths[0],
      isDirectory: true
    }
  },
  getFolderFiles: async (folderPath: string): Promise<FileItem[]> => {
    try {
      const files = await fs.promises.readdir(folderPath)
      return files.map((file) => ({
        name: file,
        path: path.join(folderPath, file),
        isDirectory: fs.statSync(path.join(folderPath, file)).isDirectory()
      }))
    } catch (error) {
      console.error('Error reading folder:', error)
      return []
    }
  }
}

export type FileApisType = typeof fileApis

export default fileApis

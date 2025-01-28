import { FileItem } from '../types/file'
import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'

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
  getFolderFiles: async (folderPath: string, ext?: string[]): Promise<FileItem[]> => {
    try {
      const files = await fs.promises.readdir(folderPath)
      const extFiles = ext ? files.filter((file) => ext.includes(path.extname(file))) : files
      return extFiles.map((file) => ({
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

const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

export interface FileItem {
  name: string
  path: string
  isDirectory: boolean
}

const fileApis = {
  openFolderDialog: async (): Promise<string> => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return res.filePaths[0]
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

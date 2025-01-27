import BaseMainService from '../core/BaseMainService'
const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

class FileService extends BaseMainService {
  constructor() {
    super()
  }

  async openFolderDialog() {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    return res.filePaths[0]
  }

  async getFolderFiles(folderPath) {
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

export default FileService

export type FileServiceType = InstanceType<typeof FileService>

import { videoExtensions } from '../constants'
import { FileItem } from '../types/file'
import { dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import ffmpegApis from './ffmpegApis'

const fileApis = {
  openFolderDialog: async (): Promise<FileItem | ''> => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (res.canceled) return ''
    return {
      name: path.basename(res.filePaths[0]),
      path: res.filePaths[0],
      isDirectory: true,
      thumbnail: ''
    }
  },
  checkFileExist: async (filePath: string): Promise<boolean> => {
    return fs.existsSync(filePath)
  },
  getFolderFiles: async (
    folderPath: string,
    ext: string[] = videoExtensions
  ): Promise<FileItem[]> => {
    try {
      const files = await fs.promises.readdir(folderPath)
      const extFiles = ext ? files.filter((file) => ext.includes(path.extname(file))) : files
      const fileList: FileItem[] = []
      for (const file of extFiles) {
        const fileData = {
          name: file,
          path: path.join(folderPath, file),
          isDirectory: fs.statSync(path.join(folderPath, file)).isDirectory(),
          thumbnail: ''
        }
        fileData.thumbnail = await fileApis.getThumbnail(fileData)
        fileList.push(fileData)
      }
      return fileList
    } catch (error) {
      console.error('Error reading folder:', error)
      return []
    }
  },
  getThumbnail: async (file: FileItem, outputDir: string = ''): Promise<string> => {
    if (file.isDirectory) return file.thumbnail
    if (!file.thumbnail || !fs.existsSync(file.thumbnail)) {
      if (videoExtensions.includes(path.extname(file.path))) {
        try {
          file.thumbnail = (await ffmpegApis.getVideoThumbnail(file.path, outputDir)) || ''
        } catch (error) {
          console.error('Error getting thumbnail:', error)
          file.thumbnail = ''
        }
      } else {
        file.thumbnail = ''
      }
    }
    return file.thumbnail
  },
  loadLocalImage: (imagePath: string) => {
    try {
      const data = fs.readFileSync(imagePath)
      const base64 = `data:image/jpeg;base64,${data.toString('base64')}` // 注意修改 MIME 类型（如 image/png）
      return base64
    } catch (error) {
      console.error('读取图片失败:', error)
      return null
    }
  }
}

export type FileApisType = typeof fileApis

export default fileApis

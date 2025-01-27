import { ElectronAPI } from '@electron-toolkit/preload'
import FileServiceType from '../main/FileService'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fileService: FileServiceType
    }
  }
}

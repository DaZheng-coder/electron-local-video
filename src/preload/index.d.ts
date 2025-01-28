import { FileApisType } from '../main/apis/fileApis'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fileApis: FileApisType
    }
  }
}

import { FileApisType } from '../main/apis/FileApis'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fileApis: FileApisType
    }
  }
}

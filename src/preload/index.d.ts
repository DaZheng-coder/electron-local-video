import { FileApisType } from './../main/FileApis'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fileApis: FileApisType
    }
  }
}

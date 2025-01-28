import { StoreHandler } from './../main/store/index'
import { FfmpegApisType } from './../main/apis/ffmpegApis'
import { FileApisType } from '../main/apis/fileApis'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fileApis: FileApisType
      ffmpegApis: FfmpegApisType
    }
    store: StoreHandler
  }
}

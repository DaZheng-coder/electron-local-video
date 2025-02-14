import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from './clip'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

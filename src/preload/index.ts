import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fileApis, { FileApisType } from '../main/apis/FileApis'

const getInvokeFromMain = <T extends object>(apiObjects: object): T => {
  const res = {}
  if (Object.prototype.toString.call(apiObjects) === '[object Object]') {
    Object.keys(apiObjects).forEach((key) => {
      res[key] = async (...args: unknown[]) => {
        return await ipcRenderer.invoke(key, ...args)
      }
    })
  }
  return res as T
}

const api = {
  fileApis: getInvokeFromMain<FileApisType>(fileApis)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

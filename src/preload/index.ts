import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fileApis, { FileApisType } from '../main/apis/fileApis'
import ffmpegApis, { FfmpegApisType } from '../main/apis/ffmpegApis'

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
  fileApis: getInvokeFromMain<FileApisType>(fileApis),
  ffmpegApis: getInvokeFromMain<FfmpegApisType>(ffmpegApis)
}

const store = {
  get: async (key: string) => {
    return await ipcRenderer.invoke('mainStore.get', key)
  },
  set: async (key: string, value: unknown) => {
    return await ipcRenderer.invoke('mainStore.set', key, value)
  },
  clear: async () => {
    return await ipcRenderer.invoke('mainStore.clear')
  }
}

export type StoreHandler = typeof store

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('store', store)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.store = store
}

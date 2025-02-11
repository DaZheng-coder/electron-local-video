import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { EResourceStoreChannels } from '../typings/store'

const api = {
  store: {
    storeGetAll: (storeName: string) => ipcRenderer.invoke(`${storeName}-get-all`),
    storeGet: (storeName: string, key: string) => ipcRenderer.invoke(`${storeName}-get`, key),
    storeSet: (storeName: string, key: string, value: unknown) => {
      ipcRenderer.send(`${storeName}-set`, { key, value })
    },
    storeDelete: (storeName: string, key: string) => ipcRenderer.send(`${storeName}-delete`, key),
    onStoreDelete: (
      callback: (event: IpcRendererEvent, data: { storeName: string; key: string }) => void
    ) => {
      ipcRenderer.on('store-updated', (event, data) => callback(event, data))
    },
    onStoreUpdate: (
      callback: (
        event: IpcRendererEvent,
        data: { storeName: string; key: string; value: unknown }
      ) => void
    ) => ipcRenderer.on('store-updated', (event, data) => callback(event, data))
  },
  resourceStore: {
    addResourceByPath: (filepath: string, type: string) =>
      ipcRenderer.invoke(EResourceStoreChannels.AddResourceByPath, { filepath, type })
  }
}

export type API = typeof api

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

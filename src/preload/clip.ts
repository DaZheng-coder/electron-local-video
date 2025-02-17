import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { EMediaToolChannels, EResourceStoreChannels } from '../typings/store'

const api = {
  store: {
    // 1. 以 storeName 组装ipc channel，向 window.api 注入某个 store 的增删改查更新方法
    // 单独事件，每个 store 都会注册一个
    storeGetAll: (storeName: string) => ipcRenderer.invoke(`${storeName}-get-all`),
    storeGet: (storeName: string, key: string) => ipcRenderer.invoke(`${storeName}-get`, key),
    storeSet: (storeName: string, key: string, value: unknown) => {
      ipcRenderer.send(`${storeName}-set`, { key, value })
    },
    storeDelete: (storeName: string, key: string) => ipcRenderer.send(`${storeName}-delete`, key),

    // 2. 监听 store 更新事件，当 store 更新时，向渲染进程广播 store 更新事件
    // 公共事件，全局只会注册一个
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
      ipcRenderer.invoke(EResourceStoreChannels.AddResourceByPath, { filepath, type }),
    getBase64Image: (relativePath: string) => {
      return ipcRenderer.invoke(EResourceStoreChannels.getBase64Image, relativePath)
    }
  },
  mediaTool: {
    getThumbnail: (mediaData: { inputPath: string }) => {
      return ipcRenderer.invoke(EMediaToolChannels.GenerateThumbnail, mediaData)
    }
  }
}

export type API = typeof api

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

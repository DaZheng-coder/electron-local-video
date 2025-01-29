import path from 'path'
import { app } from 'electron'
import { registerHandler } from '../utils'
import { MainStore } from '../types/store'

const USER_DATA = 'userData'

export let mainStore: MainStore

import('electron-store')
  .then((module) => {
    const Store = module.default
    const store = new Store({
      name: USER_DATA,
      cwd: path.join(app.getPath('userData'), 'electron')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

    mainStore = {
      get: async (key: string) => await store.get(key),
      set: async (key: string, value: unknown, syncRenderStore: boolean = false) => {
        await store.set(key, value)
        if (syncRenderStore) {
          global.mainWindow?.webContents.send('syncRenderStore', { key, value })
        }
      },
      clear: async () => await store.clear()
    }

    const storeHandler = Object.keys(mainStore).reduce((acc, methodName) => {
      const key = ['mainStore', methodName].join('.')
      acc[key] = mainStore[methodName]
      return acc
    }, {})
    registerHandler(storeHandler)
  })
  .catch((err) => {
    console.error('Failed to load electron-store:', err)
  })

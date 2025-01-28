import path from 'path'
import { app } from 'electron'
import { registerHandler } from '../utils'

const USER_DATA = 'userData'

import('electron-store')
  .then((module) => {
    const Store = module.default
    const store = new Store({
      name: USER_DATA,
      cwd: path.join(app.getPath('userData'), 'electron')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
    const storeHandler = {
      ['store-get']: (key: string) => store.get(key),
      ['store-set']: (key: string, value: unknown) => store.set(key, value),
      ['store-clear']: () => store.clear()
    }
    registerHandler(storeHandler)
  })
  .catch((err) => {
    console.error('Failed to load electron-store:', err)
  })

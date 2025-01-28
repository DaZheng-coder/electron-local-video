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
    })
    const storeHandler = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['store-get']: (key: string) => (store as any).get(key),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['store-set']: (key: string, value: unknown) => (store as any).set(key, value)
    }
    registerHandler(storeHandler)
  })
  .catch((err) => {
    console.error('Failed to load electron-store:', err)
  })

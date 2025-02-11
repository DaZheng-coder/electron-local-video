import Store from 'electron-store'
import { BrowserWindow, ipcMain } from 'electron'

export default class BaseStore {
  private store: Store
  protected storeName: string

  constructor(storeName: string, cwd: string) {
    this.storeName = storeName
    this.store = new Store({ name: storeName, cwd })
    ipcMain.handle(`${storeName}-get-all`, () => {
      return this.getAll()
    })
    ipcMain.handle(`${storeName}-get`, (_, key) => {
      return this.get(key)
    })
    ipcMain.on(`${storeName}-set`, (e, { key, value }) => {
      const sender = BrowserWindow.fromWebContents(e.sender)
      this.set(key, value, sender)
    })
    ipcMain.on(`${storeName}-delete`, (e, key) => {
      const sender = BrowserWindow.fromWebContents(e.sender)
      this.delete(key, sender)
    })
  }

  getAll() {
    return this.store.store
  }

  get(key: string) {
    return this.store.get(key)
  }

  set(key: string, value: unknown, sender?: BrowserWindow | null) {
    const res = this.store.set(key, value)
    // 广播给除更新方之外的所有窗口
    BrowserWindow.getAllWindows().forEach((win) => {
      if (sender && win.id === sender.id) return
      win.webContents.send('store-updated', { storeName: this.storeName, key, value })
    })
    return res
  }

  delete(key: string, sender?: BrowserWindow | null) {
    const res = this.store.delete(key)
    // 广播给除更新方之外的所有窗口
    BrowserWindow.getAllWindows().forEach((win) => {
      if (sender && win.id === sender.id) return
      win.webContents.send('store-delete', { storeName: this.storeName, key })
    })
    return res
  }
}

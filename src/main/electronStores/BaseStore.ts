import Store from 'electron-store'
import { BrowserWindow, ipcMain } from 'electron'

/**
 * 本地存储基类，包装一层 Store，提供基本的增删改查方法
 * 通过 ipc 通信，同步渲染进程的 store
 */
export default class BaseStore {
  /**
   * store 实例
   */
  private store: Store
  /**
   * 当前 store 名称
   */
  protected storeName: string

  constructor(storeName: string, cwd: string) {
    // 1. 初始化 store 实例
    this.storeName = storeName
    this.store = new Store({ name: storeName, cwd })

    // 2. 初始化 ipc 通信
    // 获取所有 store
    ipcMain.handle(`${storeName}-get-all`, () => {
      return this.getAll()
    })
    // 获取指定 key 的 store
    ipcMain.handle(`${storeName}-get`, (_, key) => {
      return this.get(key)
    })
    // 设置 store 某 key 的值
    ipcMain.on(`${storeName}-set`, (e, { key, value }) => {
      const sender = BrowserWindow.fromWebContents(e.sender)
      this.set(key, value, sender)
    })
    // 删除 store 某key
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
    // 广播给除更新方之外的所有窗口，同步渲染进程数据
    BrowserWindow.getAllWindows().forEach((win) => {
      if (sender && win.id === sender.id) return
      win.webContents.send('store-updated', { storeName: this.storeName, key, value })
    })
    return res
  }

  delete(key: string, sender?: BrowserWindow | null) {
    const res = this.store.delete(key)
    // 广播给除更新方之外的所有窗口，同步渲染进程数据
    BrowserWindow.getAllWindows().forEach((win) => {
      if (sender && win.id === sender.id) return
      win.webContents.send('store-delete', { storeName: this.storeName, key })
    })
    return res
  }
}

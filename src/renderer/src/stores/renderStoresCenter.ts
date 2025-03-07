import { StoreApi, UseBoundStore } from 'zustand'
import resourceStore, { IResourceStore } from './resourceStore'

/**
 * @description 渲染进程 store 中心，用于管理所有的 store
 */
class RenderStores {
  private static instance: RenderStores
  public stores: Record<string, UseBoundStore<StoreApi<IResourceStore>>>
  static getInstance() {
    if (!RenderStores.instance) {
      RenderStores.instance = new RenderStores()
    }
    return RenderStores.instance
  }
  constructor() {
    // 1. 初始化所有 store
    this.stores = {
      resourceStore
    }
    Object.values(this.stores).forEach((store) => {
      store.getState().init()
    })

    // 2. 监听 store 更新事件，当 主进程store 更新时，更新 渲染进程store 数据
    window.api.store.onStoreUpdate((_, data) => {
      const { storeName, key, value } = data
      if (key in this.stores[storeName].getState()) {
        this.stores[storeName].setState((state) => ({
          ...state,
          [key]: value
        }))
      }
    })
    window.api.store.onStoreDelete((_, data) => {
      const { storeName, key } = data
      if (key in this.stores[storeName].getState()) {
        this.stores[storeName].setState((state) => {
          const newState = { ...state }
          delete newState[key]
          return newState
        })
      }
    })
  }
}

export default RenderStores

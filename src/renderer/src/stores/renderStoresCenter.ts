import { StoreApi, UseBoundStore } from 'zustand'
import resourceStore, { IResourceStore } from './resourceStore'

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
    this.stores = {
      resourceStore
    }
    Object.values(this.stores).forEach((store) => {
      store.getState().init()
    })
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

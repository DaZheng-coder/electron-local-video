import { create } from 'zustand'
import { EMediaType, IVideoData } from '@typings/index'
import { EStoreNamespaces } from '@typings/store'

export interface IResourceStore {
  resourceMap: Record<string, IVideoData>
  init: () => void
  addResourceByPath: (filePath: string, type: EMediaType) => Promise<IVideoData>
  clearResources: () => void
  getResource: (resourceId: string) => IVideoData | undefined
}

const resourceStore = create<IResourceStore>((set, get) => ({
  resourceMap: {},
  init: async () => {
    const state = await window.api.store.storeGetAll(EStoreNamespaces.ResourceStore)
    if (state) {
      set(state)
    }
  },
  addResourceByPath: (filePath: string, type: EMediaType) => {
    return window.api.resourceStore.addResourceByPath(filePath, type)
  },
  clearResources: () => {
    set({ resourceMap: {} })
    window.api.store.storeSet(EStoreNamespaces.ResourceStore, 'resourceMap', {})
  },
  getResource: (resourceId: string) => {
    return get().resourceMap[resourceId]
  }
}))

export default resourceStore

import { create } from 'zustand'
import { EMediaType, IVideoData } from '@typings/index'
import { EStoreNamespaces } from '@typings/store'

export interface IResourceStore {
  resourceMap: Map<string, IVideoData>
  init: () => void
  addResourceByPath: (filePath: string, type: EMediaType) => void
  clearResources: () => void
}

const resourceStore = create<IResourceStore>((set) => ({
  resourceMap: new Map(),
  init: async () => {
    const state = await window.api.store.storeGetAll(EStoreNamespaces.ResourceStore)
    if (state) {
      set(state)
    }
  },
  addResourceByPath: (filePath: string, type: EMediaType) => {
    window.api.resourceStore.addResourceByPath(filePath, type)
  },
  clearResources: () => {
    set({ resourceMap: new Map() })
    window.api.store.storeSet(EStoreNamespaces.ResourceStore, 'resourceMap', new Map())
  }
}))

export default resourceStore

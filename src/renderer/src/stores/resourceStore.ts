import { create } from 'zustand'
import { IVideoData } from '@typings/index'

export interface IResourceStore {
  resourceMap: Map<string, IVideoData>
  addResources: (resources: IVideoData[]) => void
  deleteResources: (ids: string[]) => void
  clearResources: () => void
}

const resourceStore = create<IResourceStore>((set, get) => ({
  resourceMap: new Map(),
  addResources: (resources: IVideoData[]) => {
    const newResources = new Map(get().resourceMap)
    resources.forEach((resource) => {
      newResources.set(resource.id, resource)
    })
    set({ resourceMap: newResources })
  },
  deleteResources: (ids: string[]) => {
    const newResources = new Map(get().resourceMap)
    ids.forEach((id) => {
      newResources.delete(id)
    })
    set({ resourceMap: newResources })
  },
  clearResources: () => {
    set({ resourceMap: new Map() })
  }
}))

export default resourceStore

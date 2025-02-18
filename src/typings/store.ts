import { TMediaData } from '.'

export enum EStoreNamespaces {
  ResourceStore = 'resourceStore'
}

export interface IResourceStoreSchema {
  resourceMap: Record<string, TMediaData>
}

export enum EResourceStoreChannels {
  AddResourceByPath = 'resourceStore-addResourceByPath',
  getBase64Image = 'resourceStore-getBase64Image'
}

export enum EMediaToolChannels {
  GenerateThumbnail = 'mediaTool-generateThumbnail',
  GenerateVideoThumbnails = 'mediaTool-generateVideoThumbnails'
}

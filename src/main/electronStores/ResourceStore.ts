import { app, ipcMain } from 'electron'
import BaseStore from './BaseStore'
import { EResourceStoreChannels, EStoreNamespaces } from '../../typings/store'
import { EMediaType, IBaseMediaData } from '../../typings'
import { v4 as uuidV4 } from 'uuid'
import fs from 'fs'
import path from 'path'

/**
 * 资源池 store，用于管理所有的资源
 */
class ResourceStore extends BaseStore {
  constructor() {
    super(EStoreNamespaces.ResourceStore, app.getPath('userData'))
    // 初始化 ipc 通信，暴露接口，供渲染进程调用
    ipcMain.handle(EResourceStoreChannels.AddResourceByPath, (_, { filepath, type }) => {
      return this.addResourceByPath({ filepath, type })
    })
  }

  /**
   * 通过路径添加资源
   * TODO：后面考虑添加网络资源
   * @param param0
   */
  public addResourceByPath({ filepath, type }: { filepath: string; type: EMediaType }) {
    if (!fs.existsSync(filepath)) {
      throw new Error('文件不存在')
    }

    // 1. 组装资源数据
    const id = uuidV4()
    const fileData = fs.statSync(filepath)
    // TODO: 获取文件的mimeType
    const mimeType = ''
    const title = path.basename(filepath)
    const baseResourceData: IBaseMediaData = {
      id,
      thumbnail: '',
      title,
      path: filepath,
      size: fileData.size,
      type: mimeType,
      mediaType: type
    }

    // 2. 添加资源
    const resourceMap = this.get('resourceMap') || {}
    resourceMap[id] = baseResourceData
    this.set('resourceMap', resourceMap)
  }

  // private _getThumbnail(mediaData: IBaseMediaData) {
  //   if (mediaData.mediaType === EMediaType.Video) {
  //     MediaTool.
  //   }
  // }
}

export default ResourceStore

import { app, ipcMain } from 'electron'
import BaseStore from './BaseStore'
import { EResourceStoreChannels, EStoreNamespaces } from '../../typings/store'
import { EMediaType, IBaseMediaData, IVideoData } from '../../typings'
import { v4 as uuidV4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import MediaTool from '../mediaTool'
import { merge } from 'lodash'

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
    ipcMain.handle(EResourceStoreChannels.getBase64Image, (_, relativePath: string) => {
      return this.getBase64Image(relativePath)
    })
  }

  /**
   * 通过路径添加资源
   * TODO：后面考虑添加网络资源
   * @param param0
   */
  public async addResourceByPath({ filepath, type }: { filepath: string; type: EMediaType }) {
    if (!fs.existsSync(filepath)) {
      throw new Error('文件不存在')
    }

    // 1. 组装资源数据
    const id = uuidV4()
    const fileData = fs.statSync(filepath)
    // TODO: 获取文件的mimeType
    const mimeType = ''
    const title = path.basename(filepath)
    let resourceData: IBaseMediaData = {
      id,
      thumbnail: {
        path: ''
        // base64: ''
      },
      title,
      path: filepath,
      size: fileData.size,
      type: mimeType,
      mediaType: type
    }

    // 1.1 如果是视频资源
    if (type === EMediaType.Video) {
      const metaData = await MediaTool.getVideoMetadata({ inputPath: filepath })
      const imagePath = await MediaTool.generateThumbnail({ inputPath: filepath })

      resourceData = merge(resourceData, metaData, {
        thumbnail: {
          path: imagePath
          // base64: this.getBase64Image(imagePath)
        }
      })
    }

    // 2. 添加资源
    const resourceMap = this.get('resourceMap') || {}
    resourceMap[id] = resourceData
    this.set('resourceMap', resourceMap)
  }

  public getBase64Image(imagePath: string) {
    const imageData = fs.readFileSync(imagePath).toString('base64')
    return `data:image/png;base64,${imageData}`
  }

  // private _getThumbnail(mediaData: IBaseMediaData) {
  //   if (mediaData.mediaType === EMediaType.Video) {
  //     MediaTool.
  //   }
  // }
}

export default ResourceStore

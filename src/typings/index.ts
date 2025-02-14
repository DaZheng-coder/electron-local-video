/**
 * 素材类型
 */
export enum EMediaType {
  Video = 'video'
}

/**
 * 基础素材数据
 */
export interface IBaseMediaData {
  /**
   * 素材id
   */
  id: string
  /**
   * 缩略图
   */
  thumbnail: string
  /**
   * 标题
   */
  title: string
  /**
   * 本地文件路径
   */
  path: string
  /**
   * 大小
   */
  size: number
  /**
   * 本地文件类型
   */
  type: string
  /**
   * 素材类型
   */
  mediaType: EMediaType
}

/**
 * 视频素材数据
 */
export interface IVideoData extends IBaseMediaData {}

export type TMediaData = IVideoData

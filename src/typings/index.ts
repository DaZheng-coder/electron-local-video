/**
 * 素材类型
 */
export enum EMediaType {
  Video = 'video'
}

export interface IThumbnail {
  path: string
  // base64: string
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
  thumbnail: IThumbnail
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
export interface IVideoData extends IBaseMediaData, IVideoMetadata {}

export type TMediaData = IVideoData

export interface IStream {
  codec_name: string
  codec_tag: string
  codec_tag_string: string
  codec_type: string // 编码格式，例如 h264、h265 等
  duration: number
  start_time: number
}

export interface IVideoStream extends IStream {
  width: number
  height: number
  pix_fmt: string
  time_base: string
  avg_frame_rate: string
}
export interface IAudioStream extends IStream {
  sample_fmt: string
  sample_rate: number
  channel_layout: string
  profile: number
}

export interface IVideoMetadata {
  videoInfo: IVideoStream
  audioInfo: IAudioStream
  duration: number
  fps: number
  frameCount: number
}

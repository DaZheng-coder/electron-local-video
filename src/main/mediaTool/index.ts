import path from 'path'
import { ensureDir, getHash } from './utils'
import { find } from 'lodash'
import { IVideoMetadata } from '../../typings'

const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path)
ffmpeg.setFfprobePath(require('@ffprobe-installer/ffprobe').path)

class MediaTool {
  static localStaticPath = ''
  static localResourcePath = ''

  static config(toolConfig: { localStaticPath: string }) {
    this.localStaticPath = toolConfig.localStaticPath
    ensureDir(this.localStaticPath)
    this.localResourcePath = toolConfig.localStaticPath
  }

  static parsePath(filepath: string) {
    return global.env.mode === 'development'
      ? path.resolve(filepath.replace('/@fs/', ''))
      : path.join(__dirname, '../../../dist/render', filepath)
  }

  static getVideoMetadata = async ({
    inputPath
  }: {
    inputPath: string
  }): Promise<IVideoMetadata> => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err)
        } else {
          console.log('metadata', metadata)
          const { streams } = metadata
          // 提取视频流、音频流信息
          const videoInfo = find(streams, { codec_type: 'video' })
          const audioInfo = find(streams, { codec_type: 'audio' })

          // 计算实际帧率
          const [numerator, denominator] = videoInfo.r_frame_rate.split('/')
          const fps = denominator ? numerator / denominator : Number(numerator)

          // 获取时长
          const duration = Number(metadata.format.duration) || videoInfo.duration

          // 计算总帧数
          let frameCount = videoInfo.nb_frames
          if (!frameCount && duration && fps) {
            frameCount = Math.round(duration * fps)
          }

          const videoMetadata: IVideoMetadata = {
            videoInfo,
            audioInfo,
            duration,
            fps,
            frameCount
          }
          resolve(videoMetadata)
        }
      })
    })
  }

  static async generateThumbnail({
    inputPath,
    size = '240x240'
  }: {
    inputPath: string
    size?: string
  }): Promise<string> {
    const fileId = getHash(JSON.stringify({ inputPath, size }))
    const folderThumbnail = path.join(this.localStaticPath, 'thumbnail')

    ensureDir(folderThumbnail)

    const filename = `thumbnail${fileId}.jpg`
    const outputPath = path.join(folderThumbnail, filename)

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['00:00:00.002'],
          filename,
          folder: folderThumbnail,
          size: '320x240'
        })
        .on('end', () => {
          console.log('create file path:', outputPath)
          resolve(outputPath)
        })
        .on('error', (error) => {
          console.log('*** error', error)
          reject(error)
        })
    })
  }
}

export default MediaTool

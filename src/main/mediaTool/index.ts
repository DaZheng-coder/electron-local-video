import path from 'path'
import { clearDir, ensureDir, getHash } from './utils'
import { find } from 'lodash'
import { IVideoMetadata } from '../../typings'
import { ipcMain } from 'electron'
import { EMediaToolChannels } from '../../typings/store'

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

    this.listen()
  }

  static listen() {
    ipcMain.handle(EMediaToolChannels.GenerateThumbnail, async (_, inputPath) => {
      console.log(' ipcMaininputPath:', inputPath)
      return await MediaTool.generateThumbnail(inputPath)
    })

    ipcMain.handle(EMediaToolChannels.GenerateVideoThumbnails, async (_, inputPath, options) => {
      return await MediaTool.generateVideoThumbnails(inputPath, options)
    })
  }

  static parsePath(filepath: string) {
    return global.env.mode === 'development'
      ? path.resolve(filepath.replace('/@fs/', ''))
      : path.join(__dirname, '../../../dist/render', filepath)
  }

  /**
   * 获取视频元信息
   * @param param0
   * @returns
   */
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
          // const [numerator, denominator] = videoInfo.r_frame_rate.split('/')
          // const fps = denominator ? numerator / denominator : Number(numerator)
          const fps = 30 // 目前默认采用30fps

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

  /**
   * 生成缩略图
   * @param param0
   * @returns
   */
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
          reject(error)
        })
    })
  }

  static async generateVideoThumbnails(inputPath: string, size = '240x240') {
    const fileId = getHash(JSON.stringify({ inputPath, size }))
    const folderThumbnail = path.join(this.localStaticPath, 'thumbnail')
    const outputPath = path.join(folderThumbnail, fileId)

    // 配置参数
    const config = {
      inputVideo: inputPath, // 输入视频路径
      outputDir: outputPath, // 输出目录 (需要以/结尾)
      filename: 'frame%04d.png', // 文件名格式
      frameRate: 1 // 提取帧率 (保持原速)
    }

    ensureDir(folderThumbnail)
    clearDir(outputPath)

    return new Promise((resolve, reject) => {
      ffmpeg(config.inputVideo)
        .output(path.join(config.outputDir, config.filename))
        .outputOptions([
          '-f image2', // 指定输出为图像序列
          '-r',
          config.frameRate, // 设置帧率
          '-vsync',
          'vfr', // 保持可变帧率
          '-qscale:v',
          '31' // 图像质量 (1-31, 越小越好),
          // '-ss 00:00:05', // 从第5秒开始提取,
          // '-t 10', // 只处理10秒
          // '-vf "select=eq(pict_type\,I)"', // 只提取关键帧
          // '-threads 4', // 使用多线程
          // '-preset fast' // 加速处理
        ])
        .on('start', (cmd) => console.log(`执行命令: ${cmd}`))
        .on('error', (err) => {
          console.error('错误:', err)
          reject(err)
        })
        .on('end', () => {
          console.log(`帧已保存至 ${path.resolve(config.outputDir)}`)
          resolve(config.outputDir)
        })
        .on('progress', (progress) => {
          console.log(`处理中: ${Math.floor(progress.percent)}% 完成`)
        })
        .run()
    })
  }
}

export default MediaTool

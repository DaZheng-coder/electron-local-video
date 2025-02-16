import path from 'path'
import { ensureDir, getHash } from './utils'

const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path)

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

  static generateThumbnail({ inputPath, size = '240x240' }: { inputPath: string; size?: string }) {
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

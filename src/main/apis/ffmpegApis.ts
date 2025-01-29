import path from 'path'
import { execFile } from 'child_process'
import ffmpegStatic from 'ffmpeg-static'
import fs from 'fs'

const ffmpegApis = {
  getVideoThumbnail: async (filePath: string, outputDir: string): Promise<string> => {
    if (!outputDir || outputDir.trim() === '') {
      outputDir = path.join(__dirname, 'thumbnails')
    }

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputFilePath = path.join(
      outputDir,
      `${path.basename(filePath, path.extname(filePath))}.png`
    )

    // *** todo 如果已经存在缩略图则直接返回，考虑要不要删除缩略图重新生成？
    if (fs.existsSync(outputFilePath)) {
      // fs.unlinkSync(outputFilePath)
      return outputFilePath
    }

    return new Promise((resolve, reject) => {
      const args = ['-i', filePath, '-ss', '00:00:01.000', '-vframes', '1', outputFilePath]
      if (ffmpegStatic) {
        execFile(ffmpegStatic, args, (err) => {
          if (err) {
            console.log('Error getting thumbnail:', err)
            reject(err)
          } else {
            resolve(outputFilePath)
          }
        })
      } else {
        resolve('')
      }
    })
  }
}

export type FfmpegApisType = typeof ffmpegApis

export default ffmpegApis

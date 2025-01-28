import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegPath)

const ffmpegApis = {
  getVideoMetaData: async (filePath: string) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err)
        } else {
          resolve(metadata)
        }
      })
    })
  },
  getVideoThumbnail: async (filePath: string, outputDir: string) => {
    return new Promise((resolve, reject) => {
      const fileName = `${path.basename(filePath, path.extname(filePath))}.png`
      const outputFilePath = path.join(outputDir)
      ffmpeg(filePath)
        .screenShots({
          count: 1,
          folder: outputDir,
          fileName,
          size: '320x240'
        })
        .on('end', () => {
          resolve(outputFilePath)
        })
        .on('error', reject)
    })
  }
}

export type FfmpegApisType = typeof ffmpegApis

export default ffmpegApis

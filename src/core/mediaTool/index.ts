import ff from 'fluent-ffmpeg'
import { ToolConfig } from './types'
import path from 'path'
import ffmpegPath from './ffmpeg.exe'
import ffprobePath from './ffprobe.exe'
import { ensureDir } from './utils'

const FFmpeg = (inputPath: string) => {
  return ff(inputPath).on('start', (cmd: string) => {
    console.log('run ffmpeg:', cmd)
  })
}

const FFprobe = ff.ffprobe

class MediaTool {
  static localStaticPath = ''
  static localResourcePath = ''

  static parsePath(filepath: string) {
    return global.env.mode === 'development'
      ? path.resolve(filepath.replace('/@fs/', ''))
      : path.join(__dirname, '../../../dist/render', filepath)
  }

  static config(toolConfig: ToolConfig) {
    ff.setFfmpegPath(this.parsePath(ffmpegPath))
    ff.setFfprobePath(this.parsePath(ffprobePath))
    // this.localStaticPath = toolConfig.localStaticPath
    // ensureDir(this.localStaticPath)
    // this.localResourcePath = toolConfig.localResourcePath ||
  }
}

export default MediaTool

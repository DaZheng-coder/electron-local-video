import { merge } from 'lodash'
import XGPlayer, { IPlayerOptions } from 'xgplayer'
import 'xgplayer/dist/index.min.css' // 添加核心样式

export interface IResourcePlayer extends XGPlayer {}
export interface IResourcePlayerOptions extends IPlayerOptions {
  name: string
}

class ResourcePlayer {
  name: string = ''
  instance: IResourcePlayer | null = null

  constructor(options: IPlayerOptions = {}) {
    this.init(options)
  }

  private init(options: IPlayerOptions = {}) {
    const defaultOptions: IResourcePlayerOptions = {
      name: 'ResourcePlayer',
      url: '',
      autoplay: false, // 自动播放
      controls: true, // 控制条
      loop: false, // 循环播放
      keyShortcut: false, // 关闭快捷键
      closeVideoClick: true, // 关闭视频点击
      closeVideoDblclick: true, // 关闭视频双击
      closePlayerBlur: true, // 关闭播放器失焦
      // width: '100%',
      // height: '100%',
      ignores: ['replay', 'play'] // 忽略的功能
    }
    const newOptions = merge(options, defaultOptions)
    this.instance = new XGPlayer(newOptions)
    this.prepareVideo()
  }

  private prepareVideo() {
    this.instance?.on('ready', () => this.instance?.start())
    this.instance?.once('canplay', () => this.instance?.pause())
    this.instance?.once('error', (e) => {
      console.log(`${this.name} error: `, e)
    })
  }
}

export default ResourcePlayer

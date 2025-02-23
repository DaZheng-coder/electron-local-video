import { debounce, merge } from 'lodash'
import Player, { Events, IPlayerOptions } from 'xgplayer'
import FlvPlugin from 'xgplayer-flv'
import 'xgplayer/dist/index.min.css'
import clipStore, { IClipStore } from '../../../stores/clipStore'
import { convertFileUriToWindowsPath } from '../../../utils/common'

class PreviewPlayer {
  instance: Player | null = null

  createPlayer(options: IPlayerOptions = {}) {
    const mergedOptions: IPlayerOptions = merge(
      {
        url: '',
        // controls: false,
        autoplay: false,
        loop: false, // 取消会导致资源播放结束之后，重新设置CT，自动播放
        keyShortcut: false,
        closeVideoClick: true,
        closeVideoDblclick: true,
        closePlayerBlur: true,
        width: '400px',
        height: '300px'
        // plugins: [FlvPlugin]
        // ignores: ['replay', 'play']
      },
      options
    )
    const player = new Player(mergedOptions)
    this.instance = player

    this.prepareVideo()
    return this
  }

  private prepareVideo() {
    const player = this.instance!
    if (!player) return
    player.on('ready', () => {
      player.start()
    })
    player.once('canplay', () => {
      setTimeout(() => {
        player?.pause()
      }, 0)
    })
    player.on('error', (e) => {
      if (e.errorCode === 4) {
        console.error('error', e.errorCode)
      }
    })
  }

  public playing(): boolean {
    return !this.instance?.paused && !this.instance?.ended && this.instance!.readyState > 1
  }

  public safeSeek(seekTime: number) {
    const player = this.instance!
    if (!player) return

    const currentPaused = player.paused

    // // 执行跳转前强制暂停
    // if (!currentPaused) {
    //   player.pause()
    // }

    // 设置播放进度
    player.currentTime = seekTime

    // 保持暂停状态
    requestAnimationFrame(() => {
      if (currentPaused) {
        player.pause()
      }
    })
  }

  public changePlayerVideo(url: string, seekTime: number = 0) {
    const player = this.instance!
    if (!player) return

    const src = convertFileUriToWindowsPath(player.currentSrc)
    if (src === url) {
      this.safeSeek(seekTime)
    } else {
      player.src = url
      player.once(Events.CANPLAY, () => {
        this.safeSeek(seekTime)
      })
    }
  }

  public previewCurrentCell = (_currentFrame?: number) => {
    const currentFrame =
      typeof _currentFrame === 'number' ? _currentFrame : clipStore.getState().currentFrame
    const cell = getCellByCurrentFrame(currentFrame)
    if (!cell) {
      // PreviewPlay.changePlayerVideo('')
      return
    }
    const resource = resourceStore.getState().getResource(cell.resourceId)
    const url = getResourcePath(resource?.path)
    const startTime = getTimeByFrame(currentFrame - cell.startFrame + cell.selfStartFrame)
  }
}

export default new PreviewPlayer()

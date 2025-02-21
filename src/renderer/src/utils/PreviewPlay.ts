// import { merge } from 'lodash'
// import Player, { Events, IPlayerOptions } from 'xgplayer'
// import 'xgplayer/dist/index.min.css'
// import { getCellByCurrentFrame } from './clipUtils'
// import clipStore from '../stores/clipStore'

// class PreviewPlayer {
//   instance: Player | null = null
//   playerSrcQueue: string[] = []

//   constructor(options: IPlayerOptions) {
//     this.instance = this.createPlayer(options)
//   }

//   createPlayer(options: IPlayerOptions = {}) {
//     const mergedOptions: IPlayerOptions = merge(
//       {
//         url: '',
//         // controls: false,
//         autoplay: false,
//         loop: true, // 取消会导致资源播放结束之后，重新设置CT，自动播放
//         keyShortcut: false,
//         closeVideoClick: true,
//         closeVideoDblclick: true,
//         closePlayerBlur: true,
//         width: '400px',
//         height: '300px'
//         // ignores: ['replay', 'play']
//       },
//       options
//     )
//     const player = new Player(mergedOptions)
//     player.on('ready', () => {
//       player.start()
//     })
//     player.once('canplay', () => {
//       setTimeout(() => {
//         player?.pause()
//       }, 0)
//     })
//     player.on('error', (e) => {
//       if (e.errorCode === 4) {
//         console.error('error', e.errorCode)
//       }
//     })
//     return player
//   }

//   destroy() {
//     this.instance?.destroy()
//   }

//   play(startFrame: number) {
//     // 按照track的从高到低的顺序查找所有cell序列
//   }

//   registerTimeupdate(callback: (currentTime: number) => void) {
//     this.instance?.on(Events.TIME_UPDATE, () => {
//       callback(this.instance?.currentTime || 0)
//     })
//   }

//   registerEnded(callback: () => void) {
//     this.instance?.on(Events.ENDED, () => {
//       callback()
//     })
//   }
// }

// export default PreviewPlayer

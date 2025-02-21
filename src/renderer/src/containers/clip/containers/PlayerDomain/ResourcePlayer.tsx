// import clipStore from '@renderer/src/stores/clipStore'
// import resourceStore from '@renderer/src/stores/resourceStore'
// import { getCellByCurrentFrame } from '@renderer/src/utils/clipUtils'
// import { getResourcePath } from '@renderer/src/utils/common'
// import PreviewPlayer from '@renderer/src/utils/PreviewPlay'
// import { useCallback, useEffect, useRef } from 'react'
// import Player from 'xgplayer'
// import 'xgplayer/dist/index.min.css'

// const test1 = getResourcePath('/Users/zhengjunqin/Downloads/飞书20250128-160020.mp4')
// const test2 = getResourcePath('/Users/zhengjunqin/Downloads/7691d7440d16836d310d5bd78a3d3583.mp4')

// const PLAYER_ID = 'player'

// interface IPlayerProps {
//   wrapCls?: string
//   wrapStyle?: React.CSSProperties
// }

// const ResourcePlayer = ({ wrapCls = '', wrapStyle = {} }: IPlayerProps) => {
//   const playerRef = useRef<PreviewPlayer | null>(null)
//   const playingCellId = useRef<string | null>(null)
//   const currentFrame = clipStore((state) => state.currentFrame)
//   const setCurrentFrame = clipStore((state) => state.setCurrentFrame)

//   useEffect(() => {
//     const player = new PreviewPlayer({ id: PLAYER_ID, url: test1 })
//     player.registerTimeupdate((currentTime) => {
//       requestAnimationFrame(() => {
//         setCurrentFrame(Math.floor(currentTime * 30))
//       })
//     })
//     playerRef.current = player
//     return () => {
//       player.instance?.destroy()
//     }
//   }, [setCurrentFrame])

//   useEffect(() => {
//     const cell = getCellByCurrentFrame(currentFrame)
//     if (cell && cell.cellId !== playingCellId.current) {
//       playingCellId.current = cell.cellId
//       playerRef.current?.play(cell.startFrame)
//     }
//   }, [currentFrame])

//   return (
//     <div className={wrapCls} style={wrapStyle}>
//       <div id={PLAYER_ID} />
//     </div>
//   )
// }

// export default ResourcePlayer

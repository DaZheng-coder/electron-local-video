import clipStore from '@renderer/src/stores/clipStore'
import resourceStore from '@renderer/src/stores/resourceStore'
import { getCellByCurrentFrame, getTimeByFrame } from '@renderer/src/utils/clipUtils'
import { getResourcePath } from '@renderer/src/utils/common'
import PreviewPlayer from '@renderer/src/containers/clip/service/PreviewPlay'
import { useCallback, useEffect, useRef } from 'react'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const test1 = getResourcePath('/Users/zhengjunqin/Downloads/飞书20250128-160020.mp4')
const test2 = getResourcePath('/Users/zhengjunqin/Downloads/7691d7440d16836d310d5bd78a3d3583.mp4')

const test3 = getResourcePath('C:\\Users\\PPmaka\\Desktop\\test.mp4')
const test4 = getResourcePath(
  '"C:\\Users\\PPmaka\\Desktop\\Delta Force 2025.01.18 - 15.04.24.02.DVR.mp4"'
)

const PLAYER_ID = 'player'

interface IPlayerProps {
  wrapCls?: string
  wrapStyle?: React.CSSProperties
}

const ResourcePlayer = ({ wrapCls = '', wrapStyle = {} }: IPlayerProps) => {
  const playerRef = useRef<PreviewPlayer | null>(null)
  const playingCellId = useRef<string | null>(null)
  const currentFrame = clipStore((state) => state.currentFrame)
  const setCurrentFrame = clipStore((state) => state.setCurrentFrame)
  const tracks = clipStore((state) => state.tracks)

  // const previewCurrentCell = useCallback(() => {
  //   const player = playerRef.current
  //   if (!player || player.playing()) return // 播放中直接返回
  //   const cell = getCellByCurrentFrame(currentFrame)
  //   if (!cell) {
  //     player.changePlayerVideo('')
  //     return
  //   }
  //   const resource = resourceStore.getState().getResource(cell.resourceId)
  //   const url = getResourcePath(resource?.path)
  //   const startTime = getTimeByFrame(currentFrame - cell.startFrame + cell.selfStartFrame)

  //   player.changePlayerVideo(url, startTime)
  // }, [currentFrame])

  useEffect(() => {
    const player = PreviewPlayer.createPlayer({ id: PLAYER_ID, url: '' })
    playerRef.current = player
    return () => {
      player.instance?.destroy()
    }
  }, [setCurrentFrame])

  // useEffect(() => {
  //   previewCurrentCell()
  // }, [previewCurrentCell, tracks])

  return (
    <div className={wrapCls} style={wrapStyle}>
      <div id={PLAYER_ID} />
    </div>
  )
}

export default ResourcePlayer

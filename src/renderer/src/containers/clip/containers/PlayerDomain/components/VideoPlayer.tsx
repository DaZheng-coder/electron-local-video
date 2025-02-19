import { useCallback, useEffect, useRef, useState } from 'react'
import ResourcePlayer from '../../../service/ResourcePlayer'
import { getResourcePath } from '@renderer/src/utils/common'

const test2 = getResourcePath('/Users/zhengjunqin/Downloads/7691d7440d16836d310d5bd78a3d3583.mp4')
const test1 = getResourcePath('/Users/zhengjunqin/Downloads/飞书20250128-160020.mp4')
const VideoPlayer = () => {
  // 16:9 0.5625
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const player0Dom = useRef<HTMLDivElement | null>(null)
  const player1Dom = useRef<HTMLDivElement | null>(null)
  const playerInstances = useRef<[ResourcePlayer | null, ResourcePlayer | null]>([null, null])

  const preloadNextVideo = () => {
    const nextIndex = (activeIndex + 1) % 2
    const nextPlayer = playerInstances.current[nextIndex]?.instance

    if (!nextPlayer) return

    nextPlayer.url = test2
    nextPlayer.preload = true
  }

  const handleVideoEnd = () => {
    switchPlayer()
  }

  const handleTimeUpdate = () => {
    const currentPlay = playerInstances.current[activeIndex]?.instance
    if (!currentPlay) return

    if (currentPlay.currentTime > currentPlay.duration - 3) {
      preloadNextVideo()
    }
  }

  const setupEventListeners = () => {
    const currentPlayer = playerInstances.current[activeIndex]?.instance
    if (!currentPlayer) return

    currentPlayer?.on('timeupdate', () => handleTimeUpdate)
    currentPlayer?.on('ended', handleVideoEnd)
  }

  const switchPlayer = () => {
    const nextIndex = (activeIndex + 1) % 2
    const curPlayer = playerInstances.current[activeIndex]?.instance
    const nextPlayer = playerInstances.current[nextIndex]?.instance

    if (!curPlayer || !nextPlayer) return

    nextPlayer.currentTime = 0 // 同步播放状态

    nextPlayer.play()

    setActiveIndex(nextIndex)

    curPlayer.off('timeupdate', handleTimeUpdate)
    curPlayer.off('ended', handleVideoEnd)
    setupEventListeners()
  }

  const initPlayers = () => {
    if (!player0Dom.current || !player1Dom.current) return
    playerInstances.current[0] = new ResourcePlayer({
      id: 'play0',
      name: 'player0',
      el: player0Dom.current,
      url: test1
    })
    playerInstances.current[1] = new ResourcePlayer({
      id: 'play1',
      name: 'player1',
      el: player1Dom.current,
      url: test2
    })
    // playerInstances.current[0].instance.url = test1
    setupEventListeners()
  }

  useEffect(() => {
    initPlayers()
    const temp = playerInstances.current // 卸载视频用
    return () => {
      temp.forEach((player) => {
        player?.instance?.destroy()
      })
    }
  }, [])

  return (
    <div style={{ paddingBottom: '56.25%' }} className="relative">
      <div
        id="player0"
        ref={player0Dom}
        style={{ opacity: activeIndex === 0 ? 1 : 0 }}
        className="w-full h-full absolute left-0 top-0 bg-black"
      />
      <div
        id="player1"
        ref={player1Dom}
        style={{ opacity: activeIndex === 1 ? 1 : 0 }}
        className="w-full h-full absolute left-0 top-0 bg-white"
      />
    </div>
  )
}

export default VideoPlayer

import { getResourcePath } from '@renderer/src/utils/common'
import { useEffect, useRef, useState } from 'react'
import XGPlayer from 'xgplayer'
import 'xgplayer/dist/index.min.css' // 添加核心样式

const DualPlayer = () => {
  const test2 = '/Users/zhengjunqin/Downloads/7691d7440d16836d310d5bd78a3d3583.mp4'
  const test1 = '/Users/zhengjunqin/Downloads/飞书20250128-160020.mp4'

  const containerRef = useRef<HTMLDivElement>(null)
  const players = useRef<[XGPlayer | null, XGPlayer | null]>([null, null])
  const activeIndex = useRef(0)
  const [videoList] = useState<string[]>([getResourcePath(test1), getResourcePath(test2)])

  // 初始化播放器
  useEffect(() => {
    const initPlayers = () => {
      players.current = [
        new XGPlayer({
          el: containerRef.current!.querySelector('#player0'),
          url: videoList[0],
          videoInit: true,
          autoplay: false,
          cssFullscreen: true,
          loop: false
        }),
        new XGPlayer({
          el: containerRef.current!.querySelector('#player1'),
          url: videoList[1],
          videoInit: true,
          autoplay: false,
          cssFullscreen: true,
          loop: false
        })
      ]

      setupEventListeners()
    }

    if (containerRef.current) {
      initPlayers()
    }

    return () => {
      players.current.forEach((player) => player?.destroy())
    }
  }, [])

  // 事件监听设置
  const setupEventListeners = () => {
    const currentPlayer = players.current[activeIndex.current]
    currentPlayer?.on('timeupdate', handleTimeUpdate)
    currentPlayer?.on('ended', handleVideoEnd)
  }

  // 时间更新监听
  const handleTimeUpdate = () => {
    const currentPlayer = players.current[activeIndex.current]
    if (!currentPlayer) return

    // 提前3秒预加载下一视频
    if (currentPlayer.currentTime > currentPlayer.duration - 3) {
      preloadNextVideo()
    }
  }

  // 预加载下一视频
  const preloadNextVideo = () => {
    const nextIndex = (activeIndex.current + 1) % 2
    const nextPlayer = players.current[nextIndex]

    if (!nextPlayer || nextPlayer.src) return

    nextPlayer.src = videoList[nextIndex]
    nextPlayer.preload = true
  }

  // 视频结束处理
  const handleVideoEnd = () => {
    switchPlayer()
  }

  // 执行播放器切换
  const switchPlayer = () => {
    const nextIndex = (activeIndex.current + 1) % 2
    const currentPlayer = players.current[activeIndex.current]
    const nextPlayer = players.current[nextIndex]

    if (!currentPlayer || !nextPlayer) return

    // 同步播放状态
    nextPlayer.currentTime = 0

    // 执行视觉过渡
    currentPlayer.root.style.opacity = '0'
    nextPlayer.root.style.opacity = '1'

    // 启动新播放器
    nextPlayer.play()

    // 切换激活索引
    activeIndex.current = nextIndex

    // 重置事件监听
    currentPlayer.off('timeupdate', handleTimeUpdate)
    currentPlayer.off('ended', handleVideoEnd)
    setupEventListeners()
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div
        id="player0"
        className="absolute top-0 left-0 transition-opacity duration-500"
        style={{ opacity: 1 }}
      />
      <div
        id="player1"
        className="absolute top-0 left-0 transition-opacity duration-500"
        style={{ opacity: 0 }}
      />
    </div>
  )
}

export default DualPlayer

import useVideoStore from '@renderer/store/useVideoStore'
import { Button } from 'antd'
import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const ID = 'electron-local-xg-player'

const VideoPlayer: FC = () => {
  const curVideo = useVideoStore((state) => state.curVideo)
  const nav = useNavigate()

  useEffect(() => {
    if (!curVideo) return
    console.log('*** `file://${curVideo.path}`', `file://${curVideo.path}`)
    const player = new Player({
      id: ID,
      url: `file://${curVideo.path}`,
      height: '100%',
      width: '100%'
      // presets: ['default']
    })

    return () => {
      player.destroy()
    }
  }, [curVideo])

  return (
    <div className="flex-1 flex flex-col">
      <Button onClick={() => nav(-1)}>返回</Button>
      <div className="flex-1">
        <div id={ID} />
      </div>
    </div>
  )
}

export default VideoPlayer

import { useEffect, useState } from 'react'
import Timeline from './components/Timeline'

const TracksDomain = () => {
  const [currentTime, setCurrentTime] = useState(0)

  // useEffect(() => {
  //   // 模拟播放进度
  //   const interval = setInterval(() => {
  //     setCurrentTime((prev) => (prev < 3600 ? prev + 1 : 0))
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, [])
  return (
    <div>
      <Timeline />
    </div>
  )
}

export default TracksDomain

import { useEffect, useState } from 'react'
import Timeline from './components/Timeline'

const TracksDomain = () => {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    // 模拟播放进度
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev < 3600 ? prev + 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div>
      <Timeline
        duration={3600} // 1小时时长
        currentTime={currentTime}
      />
    </div>
  )
}

export default TracksDomain

import clipStore from '@renderer/src/stores/clipStore'
import ClipTool from './components/ClipTool'
import Timeline from './components/Timeline'
import Tracks from './components/Tracks'

const TracksDomain = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  return (
    <div className="flex flex-col flex-1">
      <div className="bg-white">
        <ClipTool />
        <Timeline scale={timelineScale} />
      </div>
      <Tracks />
    </div>
  )
}

export default TracksDomain

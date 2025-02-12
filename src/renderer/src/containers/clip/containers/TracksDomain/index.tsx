import clipStore from '@renderer/src/stores/clipStore'
import ClipTool from './components/ClipTool'
import Timeline from './components/Timeline'
import Tracks from './components/Tracks'

const TracksDomain = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-0 left-0 right-0 bg-white">
        <ClipTool />
        <Timeline scale={timelineScale} />
      </div>
      <Tracks />
    </div>
  )
}

export default TracksDomain

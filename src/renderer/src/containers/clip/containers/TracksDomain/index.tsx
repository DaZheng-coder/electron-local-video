import clipStore from '@renderer/src/stores/clipStore'
import ClipTool from './components/ClipTool'
import Timeline from './components/Timeline'

const TracksDomain = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  return (
    <div>
      <ClipTool />
      <Timeline scale={timelineScale} />
    </div>
  )
}

export default TracksDomain

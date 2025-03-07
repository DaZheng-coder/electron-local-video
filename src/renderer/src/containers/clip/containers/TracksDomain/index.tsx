import clipStore from '@renderer/src/stores/clipStore'
import ClipTool from './components/ClipTool'
import Timeline from './components/Timeline'
import Tracks from './components/Tracks'
import { LAYOUT_TOOL_Z_INDEX } from '@renderer/src/constants'

const TracksDomain = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  return (
    <div className="flex-1 flex flex-col">
      <div
        style={{
          zIndex: LAYOUT_TOOL_Z_INDEX
        }}
        className="bg-white flex-shrink-0"
      >
        <ClipTool />
        <Timeline scale={timelineScale} />
      </div>
      <Tracks />
    </div>
  )
}

export default TracksDomain

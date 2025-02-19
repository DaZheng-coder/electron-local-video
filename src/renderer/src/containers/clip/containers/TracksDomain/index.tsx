import ClipTool from './components/ClipTool'
import Timeline from './components/Timeline'
import Tracks from './components/Tracks'
import { LAYOUT_TOOL_Z_INDEX } from '@renderer/src/constants'
import TimelineAnchor from './components/TimelineAnchor'

const TracksDomain = () => {
  return (
    <div className="relative h-full flex flex-col bg-[#303030] rounded-xl overflow-hidden text-white">
      <div
        style={{
          zIndex: LAYOUT_TOOL_Z_INDEX
        }}
        className="flex-shrink-0"
      >
        <ClipTool />
        <Timeline />
      </div>
      <Tracks />
      <TimelineAnchor />
    </div>
  )
}

export default TracksDomain

import { TIMELINE_ANCHOR_HEIGHT, TIMELINE_ANCHOR_WIDTH } from '@renderer/src/constants'
import useNativeDrag from '@renderer/src/hooks/useNativeDrag'
import clipStore from '@renderer/src/stores/clipStore'
import { getGridFrame, getGridPixel } from '@renderer/src/utils/timelineUtils'
import { useMemo, useRef } from 'react'

const TimelineAnchor = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  const currentFrame = clipStore((state) => state.currentFrame)
  const setCurrentFrame = clipStore((state) => state.setCurrentFrame)
  const anchorRef = useRef<HTMLDivElement>(null)

  const { style: draggingStyle } = useNativeDrag({
    ref: anchorRef,
    constraint: 'horizontal',
    initPosition: { x: getGridPixel(timelineScale, currentFrame), y: 0 },
    onDragEnd(position) {
      // setCurrentFrame(getGridFrame(timelineScale, position.x))
    }
  })

  const style = useMemo(() => {
    return {
      left: getGridPixel(timelineScale, currentFrame)
    }
  }, [currentFrame, timelineScale])

  return (
    <div
      ref={anchorRef}
      style={{
        ...style,
        ...draggingStyle
      }}
      className="absolute h-full z-[9999] flex flex-col items-center"
    >
      <div
        style={{
          width: TIMELINE_ANCHOR_WIDTH,
          height: TIMELINE_ANCHOR_HEIGHT
        }}
        className="border-2 rounded-br-md rounded-bl-md rounded-t-xs bg-black"
      ></div>
      <div className="h-full w-[1px] bg-white"></div>
    </div>
  )
}

export default TimelineAnchor

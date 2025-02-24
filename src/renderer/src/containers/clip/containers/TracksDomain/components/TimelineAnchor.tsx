import {
  TIMELINE_ANCHOR_HEIGHT,
  TIMELINE_ANCHOR_WIDTH,
  TOOLBAR_HEIGHT
} from '@renderer/src/constants'
import clipStore from '@renderer/src/stores/clipStore'
import { useRef } from 'react'

const TimelineAnchor = () => {
  // const timelineScale = clipStore((state) => state.timelineScale)
  const visible = clipStore((state) => state.frameCount > 0)
  // const setCurrentFrame = clipStore((state) => state.setCurrentFrame)
  const anchorRef = useRef<HTMLDivElement>(null)

  // const handleDrag = useCallback(
  //   (position) => {
  //     console.log('*** ')
  //     const newCurFrame = getGridFrame(timelineScale, position.x)
  //     setCurrentFrame(newCurFrame)
  //     requestAnimationFrame(() => {
  //       console.log('*** in')
  //       previewCurrentCell(newCurFrame)
  //     })
  //   },
  //   [setCurrentFrame, timelineScale]
  // )

  // const { style: draggingStyle } = useAnchorDrag({
  //   ref: anchorRef,
  //   onDragging: handleDrag,
  //   onDragEnd: handleDrag
  // })

  return (
    <div
      ref={anchorRef}
      style={{
        top: TOOLBAR_HEIGHT,
        left: -Math.floor(TIMELINE_ANCHOR_WIDTH / 2), // 以竖线为基准，所以需要向左偏移一半
        visibility: visible ? 'visible' : 'hidden'
        // ...draggingStyle
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

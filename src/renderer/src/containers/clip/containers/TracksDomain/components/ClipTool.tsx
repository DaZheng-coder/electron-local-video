import DZSlider from '@renderer/src/components/DZSlider'
import clipStore from '@renderer/src/stores/clipStore'
import { useCallback } from 'react'

const ClipTool = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  const setTimelineScale = clipStore((state) => state.setTimelineScale)

  const handleSliderChange = useCallback(
    (value: number) => {
      // console.log(value / 100)
      setTimelineScale(value)
    },
    [setTimelineScale]
  )

  return (
    <div className="h-10 flex py-1 px-4 justify-between">
      <div>tool area</div>
      <DZSlider
        className="w-40"
        min={0}
        max={100}
        step={10}
        value={timelineScale}
        onChange={handleSliderChange}
      />
    </div>
  )
}

export default ClipTool

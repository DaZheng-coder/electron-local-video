import { BoxPlotTwoTone } from '@ant-design/icons'
import DZSlider from '@renderer/src/components/DZSlider'
import { LAYOUT_TOOL_Z_INDEX } from '@renderer/src/constants'
import clipStore from '@renderer/src/stores/clipStore'
import configStore from '@renderer/src/stores/configStore'
import { Tooltip } from 'antd'
import { useCallback } from 'react'

const ClipTool = () => {
  const timelineScale = clipStore((state) => state.timelineScale)
  const setTimelineScale = clipStore((state) => state.setTimelineScale)
  const mainTrackMagnet = configStore((state) => state.mainTrackMagnet)
  const setMainTrackMagnet = configStore((state) => state.setMainTrackMagnet)

  const handleSliderChange = useCallback(
    (value: number) => {
      // console.log(value / 100)
      setTimelineScale(value)
    },
    [setTimelineScale]
  )

  const switchMagnet = useCallback(
    () => setMainTrackMagnet(!mainTrackMagnet),
    [mainTrackMagnet, setMainTrackMagnet]
  )

  return (
    <div className="h-10 flex py-1 px-4 justify-between">
      <div>tool area</div>
      <div className="flex gap-2">
        <Tooltip title={mainTrackMagnet ? '关闭主轨磁吸' : '开启主轨磁吸'}>
          <BoxPlotTwoTone
            onClick={switchMagnet}
            twoToneColor={mainTrackMagnet ? undefined : 'grey'}
          />
        </Tooltip>
        <DZSlider
          className="w-40"
          min={0}
          max={100}
          step={10}
          value={timelineScale}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  )
}

export default ClipTool

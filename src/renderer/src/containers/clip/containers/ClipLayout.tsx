import { FC, useCallback } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'
import TracksDomain from './TracksDomain'
// import { useDrop } from 'react-dnd'
// import { EDragType } from '@renderer/src/utils/dragUtils'
import GlobalCustomDragLayer from '../components/GlobalCustomDragLayer'
import {
  LAYOUT_BOTTOM_AREA_DEFAULT_SIZE,
  LAYOUT_RESOURCE_POOL_DEFAULT_SIZE,
  LAYOUT_TOP_AREA_DEFAULT_SIZE,
  LAYOUT_TOP_Z_INDEX,
  LAYOUT_VIDEO_PLAYER_DEFAULT_SIZE
} from '@renderer/src/constants'
import './index.css'
import clipStore from '@renderer/src/stores/clipStore'

const ClipLayout: FC = () => {
  const setSelectedCellIds = clipStore((state) => state.setSelectedCellIds)

  // const [collect, dropper] = useDrop({
  //   accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
  //   canDrop: (item, monitor) => {},
  //   drop: (item, monitor) => {}
  // })

  const clearSelected = useCallback(() => {
    setSelectedCellIds([])
  }, [setSelectedCellIds])

  return (
    <div onClick={clearSelected}>
      <Splitter
        layout="vertical"
        style={{ height: '100vh' }}
        className="layout-splitter h-screen !p-1 bg-[#141414]"
      >
        <Splitter.Panel
          className="bg-[#141414]"
          style={{
            zIndex: LAYOUT_TOP_Z_INDEX
          }}
          defaultSize={`${LAYOUT_TOP_AREA_DEFAULT_SIZE}%`}
        >
          <Splitter layout="horizontal">
            <Splitter.Panel defaultSize={`${LAYOUT_RESOURCE_POOL_DEFAULT_SIZE}%`}>
              <ResourcePool />
            </Splitter.Panel>
            <Splitter.Panel defaultSize={`${LAYOUT_VIDEO_PLAYER_DEFAULT_SIZE}%`}>
              <div className="rounded-xl bg-[#303030] w-full h-full text-white">VideoPlayer</div>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
        <Splitter.Panel className="flex" defaultSize={`${LAYOUT_BOTTOM_AREA_DEFAULT_SIZE}%`}>
          <TracksDomain />
        </Splitter.Panel>
      </Splitter>
      <GlobalCustomDragLayer />
    </div>
  )
}

export default ClipLayout

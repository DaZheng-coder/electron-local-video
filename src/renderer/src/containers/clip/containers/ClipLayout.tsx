import { FC, useCallback } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'
import TracksDomain from './TracksDomain'
// import { useDrop } from 'react-dnd'
// import { EDragType } from '@renderer/src/utils/dragUtils'
import GlobalCustomDragLayer from '../components/GlobalCustomDragLayer'
import { LAYOUT_TOP_Z_INDEX } from '@renderer/src/constants'
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
          defaultSize="40%"
        >
          <Splitter layout="horizontal">
            <Splitter.Panel defaultSize="40%">
              <ResourcePool />
            </Splitter.Panel>
            <Splitter.Panel defaultSize="60%">
              <div className="rounded-xl bg-[#303030] w-full h-full text-white">VideoPlayer</div>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
        <Splitter.Panel className="flex" defaultSize="60%">
          <TracksDomain />
        </Splitter.Panel>
      </Splitter>
      <GlobalCustomDragLayer />
    </div>
  )
}

export default ClipLayout

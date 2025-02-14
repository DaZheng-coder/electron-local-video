import { FC } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'
import TracksDomain from './TracksDomain'
import { useDrop } from 'react-dnd'
import { EDragType } from '@renderer/src/utils/trackUtils'
import GlobalCustomDragLayer from '../components/GlobalCustomDragLayer'

const ClipLayout: FC = () => {
  const [collect, dropper] = useDrop({
    accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
    canDrop: (item, monitor) => {},
    drop: (item, monitor) => {}
  })

  return (
    <div ref={dropper}>
      <Splitter layout="vertical" style={{ height: '100vh' }} className="h-screen bg-white">
        <Splitter.Panel defaultSize="40%">
          <Splitter layout="horizontal">
            <Splitter.Panel defaultSize="40%">
              <ResourcePool />
            </Splitter.Panel>
            <Splitter.Panel defaultSize="60%">VideoPlayer</Splitter.Panel>
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

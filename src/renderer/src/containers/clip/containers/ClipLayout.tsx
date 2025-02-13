import { FC } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'
import TracksDomain from './TracksDomain'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CustomDragLayer from './CustomDragLayer'

const ClipLayout: FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
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
      <CustomDragLayer />
    </DndProvider>
  )
}

export default ClipLayout

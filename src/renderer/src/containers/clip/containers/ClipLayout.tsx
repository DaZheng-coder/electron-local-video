import { FC } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'
import TracksDomain from './TracksDomain'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const ClipLayout: FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Splitter layout="vertical" style={{ height: '100vh' }} className="h-screen bg-white">
        <Splitter.Panel defaultSize="60%">
          <Splitter layout="horizontal">
            <Splitter.Panel defaultSize="40%">
              <ResourcePool />
            </Splitter.Panel>
            <Splitter.Panel defaultSize="60%">VideoPlayer</Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
        <Splitter.Panel className="flex" defaultSize="40%">
          <TracksDomain />
        </Splitter.Panel>
      </Splitter>
    </DndProvider>
  )
}

export default ClipLayout

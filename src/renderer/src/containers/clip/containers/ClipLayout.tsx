import { FC } from 'react'
import { Splitter } from 'antd'
import ResourcePool from './ResourcePool'

const ClipLayout: FC = () => {
  return (
    <Splitter layout="vertical" style={{ height: '100vh' }} className="h-screen bg-white">
      <Splitter.Panel defaultSize="60%">
        <Splitter layout="horizontal">
          <Splitter.Panel defaultSize="40%">
            <ResourcePool />
          </Splitter.Panel>
          <Splitter.Panel defaultSize="60%">VideoPlayer</Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="40%">
        <div>Bottom</div>
      </Splitter.Panel>
    </Splitter>
  )
}

export default ClipLayout

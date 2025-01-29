import { Flex, Splitter } from 'antd'
import FolderList from './components/FolderList'
import VideoList from './components/VideoList'

function App(): JSX.Element {
  return (
    <Splitter className="!h-screen bg-white shadow-md">
      <Splitter.Panel collapsible defaultSize="25%" min="25%" max="70%">
        <Flex className="h-full">
          <FolderList />
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel>
        <Flex className="h-full">
          <VideoList />
        </Flex>
      </Splitter.Panel>
    </Splitter>
  )
}

export default App

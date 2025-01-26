import { Flex, Splitter } from 'antd'
import FolderList from './components/FolderList'
import VideoList from './components/VideoList'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Splitter className="!h-screen bg-white shadow-md">
      <Splitter.Panel defaultSize="25%" min="2%" max="70%">
        <Flex justify="center" align="center" className="h-full">
          <FolderList />
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel>
        <Flex justify="center" align="center" className="h-full">
          <VideoList />
        </Flex>
      </Splitter.Panel>
    </Splitter>
  )
}

export default App

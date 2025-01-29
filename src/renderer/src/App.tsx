import { Flex, Splitter } from 'antd'
import FolderList from './components/FolderList'
import VideoList from './components/VideoList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VideoPlayer from './components/VideoPlayer'

function App(): JSX.Element {
  return (
    <Router>
      <Splitter className="!h-screen bg-white shadow-md">
        <Splitter.Panel collapsible defaultSize="25%" min="25%" max="70%">
          <Flex className="h-full">
            <FolderList />
          </Flex>
        </Splitter.Panel>
        <Splitter.Panel>
          <Flex className="h-full">
            <Routes>
              <Route path="/" element={<VideoList />} />
              <Route path="/videoPlayer" element={<VideoPlayer />} />
            </Routes>
          </Flex>
        </Splitter.Panel>
      </Splitter>
    </Router>
  )
}

export default App

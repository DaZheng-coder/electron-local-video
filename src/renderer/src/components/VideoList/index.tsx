import useFolderStore from '@renderer/store/useFolderStore'
import { List } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'
import { FileItem } from 'src/main/types/file'
import VideoItem from './components/VideoItem'
import useVideoStore from '@renderer/store/useVideoStore'
import { useNavigate } from 'react-router-dom'

const VideoList: FC = () => {
  const curFolder = useFolderStore((state) => state.curFolder)
  const setCurVideo = useVideoStore((state) => state.setCurVideo)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const nav = useNavigate()

  const getVideoFiles = useCallback(async () => {
    if (!curFolder) {
      setFileList([])
      return
    }
    // setLoading(true)
    const files = await window.api.fileApis.getFolderFiles(curFolder.path)
    setFileList(files)
    // setLoading(false)
  }, [curFolder])

  const navVideoPlayer = useCallback(
    (fileItem: FileItem) => {
      setCurVideo(fileItem)
      nav('videoPlayer')
    },
    [nav, setCurVideo]
  )

  useEffect(() => {
    getVideoFiles()
  }, [getVideoFiles])

  return (
    <div className="flex flex-col flex-1 p-2">
      <List
        split={false}
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        itemLayout="horizontal"
        dataSource={fileList}
        renderItem={(fileItem: FileItem) => {
          return (
            <List.Item>
              <VideoItem fileItem={fileItem} onClick={navVideoPlayer} />
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default VideoList

import useFolderStore from '@renderer/store/useFolderStore'
import { List } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'
import { FileItem } from 'src/main/types/file'
import { videoExtensions } from '@renderer/constants'

const VideoList: FC = () => {
  const curFolder = useFolderStore((state) => state.curFolder)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getVideoFiles = useCallback(async () => {
    if (!curFolder) return
    setLoading(true)
    const files = await window.api.fileApis.getFolderFiles(curFolder.path, videoExtensions)
    setFileList(files)
    setLoading(false)
  }, [curFolder])

  useEffect(() => {
    getVideoFiles()
  }, [getVideoFiles])

  return (
    <div className="flex flex-col flex-1 p-2">
      <List
        split={false}
        loading={loading}
        grid={{ gutter: 16, column: 4 }}
        itemLayout="horizontal"
        dataSource={fileList}
        renderItem={(folder: FileItem) => <List.Item>1234214</List.Item>}
      />
    </div>
  )
}

export default VideoList

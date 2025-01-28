import { Button, List } from 'antd'
import { FC, useCallback, useState } from 'react'
import { FileItem } from 'src/main/types/file'
import FolderItem from './components/FolderItem'
import useRenderStore from '@renderer/store/useRenderStore'

const FolderList: FC = () => {
  const [folderList, setFolderList] = useState<FileItem[]>([])
  const { curFolder, selectFolder } = useRenderStore((state) => state)

  const handleAddFolder = useCallback(async () => {
    try {
      const folder = await window.api.fileApis.openFolderDialog()
      if (!folder) return
      setFolderList((pre) => [...pre, folder])
      if (!curFolder) {
        selectFolder(folder)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 px-2">
      <List
        header={<div className="flex items-center bg-cyan-700 h-15" />}
        split={false}
        grid={{ gutter: 16, column: 1 }}
        itemLayout="vertical"
        dataSource={folderList}
        renderItem={(folder: FileItem) => (
          <List.Item>
            <FolderItem folderItem={folder} onClick={selectFolder} />
          </List.Item>
        )}
      />
      <Button type="primary" onClick={handleAddFolder}>
        选择文件夹
      </Button>
    </div>
  )
}

export default FolderList

import { Button, List } from 'antd'
import { FC, useCallback, useEffect } from 'react'
import { FileItem } from 'src/main/types/file'
import FolderItem from './components/FolderItem'
import useFolderStore from '@renderer/store/useFolderStore'

const FolderList: FC = () => {
  const { curFolder, setCurFolder, folderList, setFolderList } = useFolderStore((state) => state)

  useEffect(() => {
    if (!curFolder && folderList.length > 0) {
      setCurFolder(folderList[0])
    }
  }, [folderList, curFolder, setCurFolder])

  const handleAddFolder = useCallback(async () => {
    try {
      const folder = await window.api.fileApis.openFolderDialog()
      if (!folder) return
      setFolderList([...folderList, folder])
      if (!curFolder) {
        setCurFolder(folder)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }, [folderList, curFolder, setFolderList, setCurFolder])

  const handleClearFolder = useCallback(async () => {
    setFolderList([])
    setCurFolder(null)
  }, [setCurFolder, setFolderList])

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
            <FolderItem folderItem={folder} onClick={setCurFolder} />
          </List.Item>
        )}
      />
      <div className="flex flex-col gap-2">
        <Button type="primary" onClick={handleAddFolder}>
          添加文件夹
        </Button>
        {!!folderList.length && (
          <Button type="primary" danger onClick={handleClearFolder}>
            清除
          </Button>
        )}
      </div>
    </div>
  )
}

export default FolderList

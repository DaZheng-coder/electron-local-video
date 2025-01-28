import { Button, Empty } from 'antd'
import { FC } from 'react'

const FolderList: FC = () => {
  const handleSelectFolder = async () => {
    console.log('*** window.api', window.api)
    try {
      const folderPath = await window.api.fileApis.openFolderDialog()
      if (!folderPath) return
      const folderFiles = await window.api.fileApis.getFolderFiles(folderPath)
      console.log(folderFiles)
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  return (
    <div>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>
        <Button type="primary" onClick={handleSelectFolder}>
          选择文件夹
        </Button>
      </Empty>
    </div>
  )
}

export default FolderList

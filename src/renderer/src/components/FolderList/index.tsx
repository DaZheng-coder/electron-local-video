import { Button, Empty } from 'antd'
import { FC, useEffect } from 'react'

const FolderList: FC = () => {
  return (
    <div>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>
        <Button type="primary" onClick={async () => {}}>
          添加文件夹
        </Button>
      </Empty>
    </div>
  )
}

export default FolderList

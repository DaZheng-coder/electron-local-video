import LocalImage from '@renderer/components/LocalImage'
import { Card } from 'antd'
import { FC } from 'react'
import { FileItem } from 'src/main/types/file'

const VideoItem: FC<{ fileItem: FileItem }> = ({ fileItem }) => {
  return (
    <Card
      hoverable
      cover={
        <LocalImage className="h-32 object-cover" alt="Local Image" src={fileItem.thumbnail} />
      }
    >
      <div className="truncate">{fileItem.name}</div>
    </Card>
  )
}

export default VideoItem

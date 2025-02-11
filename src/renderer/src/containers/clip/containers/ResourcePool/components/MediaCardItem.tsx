import { Card, Image } from 'antd'
import { FC } from 'react'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { DEFAULT_IMAGE } from '@renderer/src/constants'

const MediaCardItem: FC<{
  title: string
  thumbnail: string
}> = ({ title, thumbnail }) => {
  return (
    <Card
      cover={<Image src="" fallback={DEFAULT_IMAGE} preview={false} />}
      actions={[<PlusCircleOutlined key="add" />, <DeleteOutlined key="delete" />]}
    >
      <div style={{ margin: '-12px', wordBreak: 'break-all' }}>{title}</div>
    </Card>
  )
}

export default MediaCardItem

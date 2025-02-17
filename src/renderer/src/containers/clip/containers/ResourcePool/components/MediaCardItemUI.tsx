import { DEFAULT_IMAGE } from '@renderer/src/constants'
import { IThumbnail } from '@typings/index'
import { Card, Image } from 'antd'
import { FC } from 'react'
// import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'

export interface IMediaCardUIProps {
  title: string
  thumbnail: IThumbnail
  className?: string
  style?: React.CSSProperties
}

const MediaCardItemUI: FC<IMediaCardUIProps> = ({
  title,
  thumbnail,
  className = '',
  style = {}
}) => {
  return (
    <Card
      style={style}
      className={`w-[120px] overflow-hidden ${className} !border-none !bg-[#3B3B3B]`}
      classNames={{
        body: '!py-1 !px-2 bg-[#3B3B3B',
        header: 'bg-[#3B3B3B]'
      }}
      cover={
        <Image
          style={{ objectFit: 'cover' }}
          src={thumbnail.base64}
          width={120}
          height={80}
          fallback={DEFAULT_IMAGE}
          preview={false}
        />
      }
      // actions={[<PlusCircleOutlined key="add" />, <DeleteOutlined key="delete" />]}
    >
      <div className="truncate text-xs">{title}</div>
    </Card>
  )
}

export default MediaCardItemUI

import { Button, Card, Flex } from 'antd'
import MediaCard from './components/MediaCard'
import { useRef } from 'react'
import useNativeDrop from '@renderer/src/hooks/useNativeDrop'
import resourceStore from '@renderer/src/stores/resourceStore'
import { EMediaType } from '@typings/index'
import { DeleteOutlined } from '@ant-design/icons'

const ResourcePool = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const resourcesMap = resourceStore((state) => state.resourceMap)
  const addResourceByPath = resourceStore((state) => state.addResourceByPath)
  const clearResources = resourceStore((state) => state.clearResources)
  // *** todo fix，修复拖拽轨道视频块到这个区域会停住的问题
  const { onDragOver, onDragLeave, onDrop } = useNativeDrop(ref, {
    onDrop: (e) => {
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        // TODO 考虑过滤MP4格式的视频
        for (const file of files) {
          if (file.type === 'video/mp4') {
            window.api.mediaTool.getThumbnail({ inputPath: file.path }).then((thumbnail) => {
              console.log('*** thumbnail:', thumbnail)
            })
            // addResourceByPath(file.path, EMediaType.Video)
          }
        }
      }
    }
  })

  return (
    <Flex className="h-full bg-[#303030] rounded-xl overflow-hidden">
      <div
        className="flex-1 h-full"
        ref={ref}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Card
          title="素材库"
          bordered={false}
          extra={
            <Button danger type="text" title="清空" onClick={clearResources}>
              <DeleteOutlined />
            </Button>
          }
          className="min-h-[100%] !bg-[#303030]"
          classNames={{
            header:
              'sticky top-0 z-1 !bg-[#303030] !border-b-[#141414] !py-1 !px-2 !min-h-auto !text-white', // 这里的z-1是为了确保header挡住下面的内容
            body: '!py-2 !px-2'
          }}
        >
          <MediaCard data={Object.values(resourcesMap)} />
        </Card>
      </div>
    </Flex>
  )
}

export default ResourcePool

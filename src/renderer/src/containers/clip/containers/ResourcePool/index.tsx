import { Button, Card, Flex } from 'antd'
import MediaCard from './components/MediaCard'
import { useEffect, useRef } from 'react'
import useDropper from '@renderer/src/hooks/useDropper'
import resourceStore from '@renderer/src/stores/resourceStore'
import { EMediaType } from '@typings/index'
import { DeleteOutlined } from '@ant-design/icons'

const ResourcePool = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const resourcesMap = resourceStore((state) => state.resourceMap)
  const addResourceByPath = resourceStore((state) => state.addResourceByPath)
  const clearResources = resourceStore((state) => state.clearResources)
  const { onDragOver, onDragLeave, onDrop } = useDropper(ref, {
    onDrop: (e) => {
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        // TODO 考虑过滤MP4格式的视频
        for (const file of files) {
          if (file.type === 'video/mp4') {
            addResourceByPath(file.path, EMediaType.Video)
          }
        }
      }
    }
  })

  // useEffect(() => {
  //   console.log('*** useEffect resourcesMap', resourcesMap)
  // }, [resourcesMap])

  return (
    <Flex className="h-full">
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
          className="min-h-[100%] !bg-transparent"
          classNames={{ header: 'sticky top-0 z-9 !bg-white' }}
        >
          <MediaCard data={Object.values(resourcesMap)} />
        </Card>
      </div>
    </Flex>
  )
}

export default ResourcePool

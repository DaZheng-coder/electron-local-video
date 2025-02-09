import { Card, Flex, Tabs, TabsProps } from 'antd'
import MediaCard from './components/MediaCard'
import { useRef } from 'react'
import useDropper from '@renderer/src/hooks/useDropper'
import resourceStore from '@renderer/src/stores/resourceStore'

const ResourcePool = () => {
  const addResource = resourceStore((state) => state.addResource)
  const ref = useRef<HTMLDivElement | null>(null)
  const { onDragOver, onDragLeave, onDrop } = useDropper(ref, {
    onDrop: (e) => {
      const files = e.dataTransfer.files
      console.log('*** files', files)
      if (files && files.length > 0) {
        // TODO 考虑过滤MP4格式的视频
        const medias = Object.values(files)
          .filter((file) => file.type === 'video/mp4')
          .map((file) => {})
      }
    }
  })
  return (
    <Flex className="h-full">
      <div
        className="flex-1 h-full"
        ref={ref}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Card title="素材库" className="h-full !bg-transparent">
          <MediaCard />
        </Card>
      </div>
    </Flex>
  )
}

export default ResourcePool

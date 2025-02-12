import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import { EDragType, isCursorInParentExcludingChildren } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { useEffect, useRef, useState } from 'react'

const Tracks = () => {
  const tracks = clipStore((state) => state.tracks)
  const [isOver, setIsOver] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ isOverCurrent }, drop] = useDrop({
    accept: EDragType.CELL_ITEM,
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }) // 光标是否在当前元素内
    }),
    hover: (item, monitor) => {
      // 拖拽元素在容器内移动时，判断光标是否在当前元素内且不在任何子元素内
      const isOverCurrent = monitor.isOver({ shallow: true })
      if (isOverCurrent) {
        const clientOffset = monitor.getClientOffset()
        requestAnimationFrame(() => {
          const isOverCurExChildren = isCursorInParentExcludingChildren(clientOffset, containerRef)
          setIsOver(isOverCurExChildren)
        })
      }
    }
  })

  /**
   * 注册拖拽容器
   */
  useEffect(() => {
    if (containerRef.current) {
      drop(containerRef.current)
    }
  }, [drop])

  /**
   * 处理拖拽元素拖出元素边界情况
   */
  useEffect(() => {
    if (isOverCurrent) {
      requestAnimationFrame(() => setIsOver(true))
    } else {
      requestAnimationFrame(() => setIsOver(false))
    }
  }, [isOverCurrent])

  return (
    // 轨道定位容器
    <div
      ref={containerRef}
      className={`flex flex-col flex-1 justify-center py-10 relative ${isOver ? 'bg-gray-200' : ''}`}
    >
      {/* 轨道容器 */}
      <div className="flex flex-col gap-2">
        {tracks.map((track) => (
          <TrackItem key={track.trackId} trackId={track.trackId} />
        ))}
      </div>
    </div>
  )
}

export default Tracks

import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import {
  EDragType,
  getInsertTrackIndexByOffset,
  getIsInEmptyArea
} from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { useEffect, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'

const Tracks = () => {
  const tracks = clipStore((state) => state.tracks)
  const [isOver, setIsOver] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const addNewTrack = clipStore((state) => state.addNewTrack)

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
          const insertIndex = getInsertTrackIndexByOffset(clientOffset, containerRef)
          // setIsOver(isInEmpty)
          console.log('*** insertIndex', insertIndex)
        })
      }
    },
    drop: (item, monitor) => {
      console.log('*** item', item)
      // 拖拽元素放下时，判断光标是否在当前元素内且不在任何子元素内，这种情况要新增轨道
      const isOverCurrent = monitor.isOver({ shallow: true })
      if (isOverCurrent) {
        const clientOffset = monitor.getClientOffset()
        const insertIndex = getInsertTrackIndexByOffset(clientOffset, containerRef)
        // addNewTrack([item.cellId], insertIndex)
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
    <div className={`flex flex-1 overflow-scroll flex-col justify-center relative }`}>
      {/* 轨道容器 */}
      <div ref={containerRef} className="flex flex-col overflow-scroll py-10">
        {tracks.map((track, index) => {
          return (
            <>
              <TrackItem key={track.trackId} trackId={track.trackId} index={index} />
              {/* 分割线，index为插入Track时的索引 */}
              <TrackDivider key={index + 1} index={index + 1} />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Tracks

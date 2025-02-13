import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import { EDragType, getInsertTrackIndexByOffset } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'

const Tracks = () => {
  const [highlightLevel, setHighlightLevel] = useState(-1)

  const tracks = clipStore((state) => state.tracks)
  const addNewTrack = clipStore((state) => state.addNewTrack)

  const containerRef = useRef<HTMLDivElement>(null)
  const tracksWrapRef = useRef<HTMLDivElement>(null)

  const sortedTracks = useMemo(() => tracks.sort((a, b) => b.trackLevel - a.trackLevel), [tracks])

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
          const insertIndex = getInsertTrackIndexByOffset(clientOffset, tracksWrapRef)
          console.log('*** insertIndex', insertIndex)
          setHighlightLevel(insertIndex)
        })
      }
    },
    drop: (item, monitor) => {
      // 拖拽元素放下时，判断光标是否在当前元素内且不在任何子元素内，这种情况要新增轨道
      const isOverCurrent = monitor.isOver({ shallow: true })
      if (isOverCurrent) {
        const clientOffset = monitor.getClientOffset()
        const insertIndex = getInsertTrackIndexByOffset(clientOffset, tracksWrapRef)
        console.log('*** insertIndex', insertIndex)
        if (insertIndex !== -1) {
          addNewTrack(insertIndex, [item.cellId])
        }
      }
    }
  })

  // 注册拖拽容器
  drop(containerRef)

  useEffect(() => {
    // 拖拽元素移出容器时，取消高亮
    if (!isOverCurrent) {
      setHighlightLevel(-1)
    }
  }, [isOverCurrent])

  return (
    // 轨道容器
    <div ref={containerRef} className="no-scrollbar py-15 flex-1 flex flex-col overflow-scroll">
      {/* 占位元素，用于占据上下空白空间，使轨道保持居中 */}
      <div className="flex-1" />
      <div ref={tracksWrapRef} className="relative">
        {sortedTracks.map((track, index) => {
          return (
            <Fragment key={track.trackId}>
              <TrackDivider
                key={index}
                trackLevel={track.trackLevel}
                hightLight={highlightLevel - 1 === track.trackLevel}
              />
              <TrackItem
                key={track.trackId}
                trackId={track.trackId}
                trackLevel={track.trackLevel}
              />
            </Fragment>
          )
        })}
      </div>
      <div className="flex-1" />
    </div>
  )
}

export default Tracks

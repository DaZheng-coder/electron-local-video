import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import {
  EDragResultType,
  EDragType,
  getDomainDragCellResult,
  IDragCellItem
} from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'
import dragStore from '@renderer/src/stores/dragStore'

const Tracks = () => {
  const [highlightDivider, setHighlightDivider] = useState(-1)

  const tracks = clipStore((state) => state.tracks)
  const addNewTrack = clipStore((state) => state.addNewTrack)
  const removeCellInTrack = clipStore((state) => state.removeCellInTrack)
  const updateCell = clipStore((state) => state.updateCell)

  const containerRef = useRef<HTMLDivElement>(null)
  const tracksWrapRef = useRef<HTMLDivElement>(null)

  const sortedTracks = useMemo(() => tracks.sort((a, b) => b.trackLevel - a.trackLevel), [tracks])

  const [{ isOverCurrent }, drop] = useDrop<IDragCellItem, unknown, { isOverCurrent: boolean }>({
    accept: EDragType.CELL_ITEM,
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }) // 光标是否在当前元素内
    }),
    hover: (item, monitor) => {
      // 拖拽元素在容器内移动时，判断光标是否在当前元素内且不在任何子元素内
      const isOverCurrent = monitor.isOver({ shallow: true })
      console.log('*** isOverCurrent', isOverCurrent)
      if (isOverCurrent) {
        requestAnimationFrame(() => {
          const result = getDomainDragCellResult(monitor, tracksWrapRef)
          if (result) {
            if (result.type === EDragResultType.NEW_TRACK) {
              setHighlightDivider(result.insertIndex)
              return
            }
          }
          setHighlightDivider(-1)
        })
      }
    },
    drop: (item, monitor) => {
      // 拖拽元素放下时，判断光标是否在当前元素内且不在任何子元素内，这种情况要新增轨道
      const isOverCurrent = monitor.isOver({ shallow: true })
      if (isOverCurrent) {
        const result = getDomainDragCellResult(monitor, tracksWrapRef)
        if (result) {
          if (result.type === EDragResultType.NEW_TRACK) {
            // TODO *** 考虑多选的情况
            const left = monitor.getSourceClientOffset()?.x || 0
            removeCellInTrack(item.cellId)
            addNewTrack(result.insertIndex, [item.cellId])
            updateCell(item.cellId, { left })
            return
          }
        }
      }
    }
  })

  // 注册拖拽容器
  drop(containerRef)

  useEffect(() => {
    // 拖拽元素移出容器时，取消高亮
    if (!isOverCurrent) {
      setHighlightDivider(-1)
    }
  }, [isOverCurrent])

  useEffect(() => {
    // 注册轨道容器
    dragStore.setState({ tracksDomRef: containerRef })
    return () => {
      dragStore.setState({ tracksDomRef: null })
    }
  }, [])

  return (
    // 轨道容器
    <div ref={containerRef} className="no-scrollbar flex-1 flex flex-col overflow-scroll">
      {/* 占位元素，用于占据上下空白空间，使轨道保持居中 */}
      <div className="flex-1" />
      <div ref={tracksWrapRef} className="relative">
        {sortedTracks.map((track, index) => {
          return (
            <Fragment key={track.trackId}>
              <TrackDivider
                key={index}
                trackLevel={track.trackLevel}
                hightLight={highlightDivider - 1 === track.trackLevel}
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

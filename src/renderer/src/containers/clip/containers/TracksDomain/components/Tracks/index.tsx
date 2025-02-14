import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import { EDragResultType, EDragType, getDomainDragCellResult } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragCellItem } from '@renderer/src/types'

const Tracks = () => {
  const [highlightDivider, setHighlightDivider] = useState(-1)

  const tracks = clipStore((state) => state.tracks)
  const addNewTrack = clipStore((state) => state.addNewTrack)
  const removeCellInTrack = clipStore((state) => state.removeCellInTrack)
  const addCellInTrack = clipStore((state) => state.addCellInTrack)
  const updateCell = clipStore((state) => state.updateCell)
  const createCell = clipStore((state) => state.createCell)

  const containerRef = useRef<HTMLDivElement>(null)
  const tracksWrapRef = useRef<HTMLDivElement>(null)

  const [{ isOverCurrent }, drop] = useDrop<IDragCellItem, unknown, { isOverCurrent: boolean }>({
    accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }) // 光标是否在当前元素内
    }),
    hover: (item, monitor) => {
      // 拖拽元素在容器内移动时，判断光标是否在当前元素内且不在任何子元素内
      if (monitor.isOver({ shallow: true })) {
        requestAnimationFrame(() => {
          const result = getDomainDragCellResult(monitor, tracksWrapRef)
          if (result) {
            if (result.type === EDragResultType.NEW_TRACK) {
              setHighlightDivider(result.insertIndex)
              return
            }
          } else {
            setHighlightDivider(-1)
          }
        })
      }
    },
    drop: (item, monitor) => {
      // 拖拽元素放下时，判断光标是否在当前元素内且不在任何子元素内，这种情况要新增轨道
      if (monitor.isOver({ shallow: true })) {
        const itemType = monitor.getItemType()
        const result = getDomainDragCellResult(monitor, tracksWrapRef)
        if (!result || !itemType) return
        if (result.type === EDragResultType.NEW_TRACK) {
          // TODO *** 考虑多选的情况
          switch (itemType) {
            case EDragType.CELL_ITEM: {
              const left = monitor.getSourceClientOffset()?.x || 0
              removeCellInTrack(item.cellId)
              addNewTrack(result.insertIndex, [item.cellId])
              updateCell(item.cellId, { left })
              break
            }
            case EDragType.MEDIA_CARD: {
              const left = monitor.getClientOffset()?.x || 0
              const newTrack = addNewTrack(result.insertIndex)
              createCell(left, 250, newTrack.trackId)
              break
            }
          }
          return
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

  const renderTracks = () => {
    const len = tracks.length
    return tracks.toReversed().map((track, idx) => {
      const index = len - idx - 1 // 因为轨道是从最底下索引为0的主轨开始向上叠加index的，所以这里要倒过来
      return (
        <Fragment key={track.trackId}>
          <TrackDivider
            key={index}
            trackIndex={index}
            hightLight={highlightDivider - 1 === index}
          />
          <TrackItem key={track.trackId} trackId={track.trackId} trackIndex={index} />
        </Fragment>
      )
    })
  }

  return (
    // 轨道容器
    <div ref={containerRef} className="no-scrollbar flex-1 flex flex-col overflow-scroll">
      {/* 占位元素，用于占据上下空白空间，使轨道保持居中 */}
      <div className="flex-1 min-h-10" />
      <div ref={tracksWrapRef} className="relative">
        {renderTracks()}
      </div>
      <div className="flex-1 min-h-10" />
    </div>
  )
}

export default Tracks

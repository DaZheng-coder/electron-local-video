import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import {
  EDragResultType,
  EDragType,
  getDraggingInTracksResult
} from '@renderer/src/utils/dragUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { Fragment, useEffect, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragCellItem, IPreviewCellData } from '@renderer/src/types'
import CellItemUI from './components/CellItem/CellItemUI'

const Tracks = () => {
  const [highlightDivider, setHighlightDivider] = useState(-1)
  const [previewCellData, setPreviewCellData] = useState<IPreviewCellData | null>(null)

  const tracks = clipStore((state) => state.tracks)
  const addNewTrack = clipStore((state) => state.addNewTrack)
  const removeCellInTrack = clipStore((state) => state.removeCellInTrack)
  const updateCell = clipStore((state) => state.updateCell)
  const createCell = clipStore((state) => state.createCell)
  const moveCellToTrack = clipStore((state) => state.moveCellToTrack)

  const containerRef = useRef<HTMLDivElement>(null)
  const tracksWrapRef = useRef<HTMLDivElement>(null)

  const [{ isOverCurrent }, drop] = useDrop<IDragCellItem, unknown, { isOverCurrent: boolean }>({
    accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }) // 光标是否在当前元素内
    }),
    hover: (item, monitor) => {
      // 拖拽元素在容器内移动时，判断光标是否在当前元素内且不在任何子元素内
      if (!monitor.isOver({ shallow: true })) return
      requestAnimationFrame(() => {
        const result = getDraggingInTracksResult(monitor)
        if (result && result.type === EDragResultType.NEW_TRACK) {
          setHighlightDivider(result.insertTrackIndex)
        } else {
          setHighlightDivider(-1)
        }

        if (result && result.type === EDragResultType.INSERT_CELL) {
          // TODO 插入cell
          setPreviewCellData({
            cellId: 'test',
            left: result.left,
            width: 200,
            top: result.top
          })
        } else {
          setPreviewCellData(null)
        }
      })
    },
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return
      const result = getDraggingInTracksResult(monitor)
      if (!result) return
      if (result.type === EDragResultType.NEW_TRACK) {
        switch (monitor.getItemType()) {
          case EDragType.CELL_ITEM: {
            removeCellInTrack(item.cellId)
            addNewTrack(result.insertTrackIndex + 1, [item.cellId])
            updateCell(item.cellId, { left: result.left })
            break
          }
          case EDragType.MEDIA_CARD: {
            const newTrack = addNewTrack(result.left)
            createCell(result.left, 200, newTrack.trackId)
            break
          }
        }
      } else if (result.type === EDragResultType.INSERT_CELL) {
        switch (monitor.getItemType()) {
          case EDragType.CELL_ITEM: {
            const cellId = item.cellId
            updateCell(cellId, { left: result.left })
            moveCellToTrack(cellId, tracks[result.insertTrackIndex].trackId)
            break
          }
          case EDragType.MEDIA_CARD: {
            createCell(result.left, 200, tracks[result.insertTrackIndex].trackId)
            break
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
    dragStore.setState({ tracksContainerDomRef: containerRef, tracksWrapDomRef: tracksWrapRef })
    return () => {
      dragStore.setState({ tracksContainerDomRef: null, tracksWrapDomRef: null })
    }
  }, [])

  const renderTracks = () => {
    const len = tracks.length
    return tracks.toReversed().map((track, idx) => {
      const index = len - idx - 1 // 因为轨道是从最底下索引为0的主轨开始向上叠加index的，所以这里要倒过来
      return (
        <Fragment key={track.trackId}>
          <TrackDivider key={index} trackIndex={index} hightLight={highlightDivider === index} />
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
        {!!previewCellData && (
          <CellItemUI
            style={{
              opacity: 0.8,
              position: 'absolute',
              left: Math.max(previewCellData?.left, 0),
              top: previewCellData.top
            }}
            title={previewCellData.cellId}
            width={previewCellData.width}
          />
        )}
      </div>
      <div className="flex-1 min-h-10" />
    </div>
  )
}

export default Tracks

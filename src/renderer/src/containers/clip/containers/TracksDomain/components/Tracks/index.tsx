import { useDrop } from 'react-dnd'
import TrackItem from './components/TrackItem'
import {
  EDragResultType,
  EDragType,
  getDraggingInTracksResult
} from '@renderer/src/utils/dragUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import TrackDivider from './components/TrackDivider'
import dragStore from '@renderer/src/stores/dragStore'
import { IDragItem, IPreviewCellData } from '@renderer/src/types'
import CellItemUI from './components/CellItem/CellItemUI'
import { getGridPixel } from '@renderer/src/utils/timelineUtils'
import { ICellData } from '@typings/track'
import { IVideoData } from '@typings/index'
import { DRAGGING_PREVIEW_CELL_ID } from '@renderer/src/constants'

const Tracks = () => {
  const [highlightDivider, setHighlightDivider] = useState(-1)
  const [previewCellData, setPreviewCellData] = useState<IPreviewCellData | null>(null)
  const [tracksWidth, setTracksWidth] = useState<number>(0)

  const timelineScale = clipStore((state) => state.timelineScale)
  const frameCount = clipStore((state) => state.frameCount)
  const tracks = clipStore((state) => state.tracks)
  const addNewTrack = clipStore((state) => state.addNewTrack)
  const removeCellInTrack = clipStore((state) => state.removeCellInTrack)
  const updateCell = clipStore((state) => state.updateCell)
  const createCell = clipStore((state) => state.createCell)
  const moveCellToTrack = clipStore((state) => state.moveCellToTrack)

  const containerRef = useRef<HTMLDivElement>(null)
  const tracksWrapRef = useRef<HTMLDivElement>(null)

  const [{ isOverCurrent }, drop] = useDrop<IDragItem, unknown, { isOverCurrent: boolean }>({
    accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }) // 光标是否在当前元素内
    }),
    hover: (_, monitor) => {
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
            cellId: DRAGGING_PREVIEW_CELL_ID,
            startFrame: result.startFrame,
            frameCount: result.frameCount,
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
            const dragData = item.data as ICellData
            removeCellInTrack(dragData.cellId)
            addNewTrack(result.insertTrackIndex + 1, [dragData.cellId])
            updateCell(dragData.cellId, { startFrame: result.startFrame })
            break
          }
          case EDragType.MEDIA_CARD: {
            const newTrack = addNewTrack(result.insertTrackIndex + 1)
            createCell(
              {
                startFrame: result.startFrame,
                frameCount: result.frameCount,
                trackId: newTrack.trackId,
                resourceId: (item.data as IVideoData).id
              },
              newTrack.trackId
            )
            break
          }
        }
      } else if (result.type === EDragResultType.INSERT_CELL) {
        switch (monitor.getItemType()) {
          case EDragType.CELL_ITEM: {
            const cellId = (item.data as ICellData).cellId
            updateCell(cellId, { startFrame: result.startFrame })
            moveCellToTrack(cellId, tracks[result.insertTrackIndex].trackId)
            break
          }
          case EDragType.MEDIA_CARD: {
            createCell(
              {
                startFrame: result.startFrame,
                frameCount: result.frameCount,
                trackId: tracks[result.insertTrackIndex].trackId,
                resourceId: (item.data as IVideoData).id
              },
              tracks[result.insertTrackIndex].trackId
            )
            break
          }
        }
      }
    }
  })

  // 注册拖拽容器
  drop(containerRef)

  useEffect(() => {
    if (!containerRef.current) return
    const pixelWidth = getGridPixel(timelineScale, frameCount)
    const minWidth = containerRef.current.clientWidth || 0
    setTracksWidth(Math.max(pixelWidth, minWidth))
  }, [timelineScale, frameCount])

  useEffect(() => {
    // 拖拽元素移出容器时，取消高亮，取消预览
    if (!isOverCurrent) {
      setHighlightDivider(-1)
      setPreviewCellData(null)
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
    <div ref={containerRef} className="scrollbar-y-only flex-1 flex flex-col overflow-scroll">
      {/* 占位元素，用于占据上下空白空间，使轨道保持居中 */}
      <div className="flex-1 min-h-10" />
      <div ref={tracksWrapRef} className="relative" style={{ width: tracksWidth }}>
        {renderTracks()}
        {!!previewCellData && (
          <CellItemUI
            style={{
              opacity: 0.8,
              position: 'absolute',
              left: Math.max(getGridPixel(timelineScale, previewCellData?.startFrame), 0),
              top: previewCellData.top
            }}
            title={previewCellData.cellId}
            width={getGridPixel(timelineScale, previewCellData.frameCount)}
          />
        )}
      </div>
      <div className="flex-1 min-h-10" />
    </div>
  )
}

export default Tracks

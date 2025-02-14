import { FC, useCallback, useEffect, useRef, useState } from 'react'
import CellItem from '../CellItem'
import { EDragType, getTrackDragCellResult, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { useDrop } from 'react-dnd'
import CellItemUI from '../CellItem/CellItemUI'
import { ICellData } from '@typings/track'
import {
  IDragCellItem,
  IDragMediaItem,
  IPreviewCellData,
  TGlobalDragItem
} from '@renderer/src/types'

interface ITrackItemProps {
  trackId: string
  trackIndex: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackIndex }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))
  const updateCell = clipStore((state) => state.updateCell)
  const createCell = clipStore((state) => state.createCell)
  const moveCellToTrack = clipStore((state) => state.moveCellToTrack)
  const addCellInTrack = clipStore((state) => state.addCellInTrack)
  const trackRef = useRef<HTMLDivElement>(null)

  const [previewCellData, setPreviewCellData] = useState<IPreviewCellData | null>(null)

  const handleDragResult = useCallback(
    (item, monitor, itemType) => {
      const curCellData =
        itemType === EDragType.CELL_ITEM ? item.cellData : { width: 200, cellId: '' }
      const res = getTrackDragCellResult({
        monitor,
        trackRef,
        trackCellIds: trackData?.cellIds || [],
        curCellData,
        itemType
      })
      return {
        res,
        curCellData
      }
    },
    [trackData]
  )

  const [{ isOverCurrent }, dropper] = useDrop<
    TGlobalDragItem,
    unknown,
    { isOverCurrent: boolean }
  >({
    accept: [EDragType.CELL_ITEM, EDragType.MEDIA_CARD],
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true })
    }),
    hover: (item, monitor) => {
      const itemType = monitor.getItemType()
      if (!monitor.isOver({ shallow: true }) || !trackData || !itemType) return

      requestAnimationFrame(() => {
        const { res, curCellData } = handleDragResult(item, monitor, itemType)
        if (res) {
          setPreviewCellData({
            cellId: curCellData.cellId,
            width: curCellData.width,
            left: res.left
          })
        } else {
          setPreviewCellData(null)
        }
      })
    },
    drop: (item, monitor) => {
      const itemType = monitor.getItemType()
      if (!monitor.isOver({ shallow: true }) || !trackData || !itemType) return
      const { res, curCellData } = handleDragResult(item, monitor, itemType)
      if (res) {
        if (itemType === EDragType.CELL_ITEM) {
          const cellId = curCellData.cellId
          updateCell(cellId, { left: res.left })
          moveCellToTrack(cellId, trackId)
        } else if (itemType === EDragType.MEDIA_CARD) {
          const newCell = createCell(res.left, 200, trackId)
          addCellInTrack(newCell.cellId, trackId)
        }
      }
    }
  })

  /**
   * 鼠标移出当前轨道时，清除预览cell
   */
  useEffect(() => {
    if (!isOverCurrent) {
      requestAnimationFrame(() => setPreviewCellData(null))
    }
  }, [isOverCurrent])

  dropper(trackRef)

  return (
    <div
      ref={trackRef}
      data-track-id={trackData?.trackId}
      data-type={EDragType.TRACK_ITEM}
      data-index={trackIndex}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-blue-500 rounded-[6px] relative"
    >
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
      {!!previewCellData && (
        <CellItemUI
          style={{
            opacity: 0.8,
            position: 'absolute',
            left: Math.max(previewCellData?.left, 0),
            top: 0
          }}
          title={previewCellData.cellId}
          width={previewCellData.width}
        />
      )}
    </div>
  )
}

export default TrackItem

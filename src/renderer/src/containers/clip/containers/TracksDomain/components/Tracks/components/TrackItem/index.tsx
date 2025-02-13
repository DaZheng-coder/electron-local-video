import { FC, useEffect, useRef, useState } from 'react'
import CellItem from '../CellItem'
import {
  EDragType,
  getTrackDragCellResult,
  IDragCellItem,
  TRACK_HEIGHT
} from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { useDrop } from 'react-dnd'
import CellItemUI from '../CellItem/CellItemUI'
import { ICellData } from '@typings/track'

interface ITrackItemProps {
  trackId: string
  trackLevel: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackLevel }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))
  const removeCellInTrack = clipStore((state) => state.removeCellInTrack)
  const addCellInTrack = clipStore((state) => state.addCellInTrack)
  const updateCell = clipStore((state) => state.updateCell)
  const trackRef = useRef<HTMLDivElement>(null)

  const [previewCellData, setPreviewCellData] = useState<ICellData | null>(null)

  const [{ isOverCurrent }, dropper] = useDrop<IDragCellItem, unknown, { isOverCurrent: boolean }>({
    accept: EDragType.CELL_ITEM,
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true })
    }),
    hover: (item, monitor) => {
      const isOverCurrent = monitor.isOver({ shallow: true })
      requestAnimationFrame(() => {
        if (isOverCurrent && trackData) {
          const res = getTrackDragCellResult(monitor, trackRef, item, trackData)
          if (res) {
            setPreviewCellData({ ...item.cellData, left: res.left })
          }
        }
      })
    },
    drop: (item, monitor) => {
      const isOverCurrent = monitor.isOver({ shallow: true })
      if (isOverCurrent && trackData) {
        const res = getTrackDragCellResult(monitor, trackRef, item, trackData)
        if (res) {
          removeCellInTrack(item.cellId)
          updateCell(item.cellId, { ...item.cellData, left: res.left, trackId })
          addCellInTrack(item.cellId, trackId)
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
      data-type={EDragType.TRACK_ITEM}
      data-level={trackLevel}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-blue-500 rounded-[6px] relative"
    >
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
      {!!previewCellData && (
        <CellItemUI
          style={{ opacity: 0.8, position: 'absolute', left: previewCellData?.left, top: 0 }}
          title={previewCellData.cellId}
          width={previewCellData.width}
        />
      )}
    </div>
  )
}

export default TrackItem

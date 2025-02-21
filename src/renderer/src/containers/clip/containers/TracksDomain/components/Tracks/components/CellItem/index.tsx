import clipStore from '@renderer/src/stores/clipStore'
import { EDragType } from '@renderer/src/utils/dragUtils'
import { FC, useCallback, useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import CellItemUI from './CellItemUI'
import ResizableDiv, { TTrigger } from '@renderer/src/components/ResizableDiv'
import { IDragItem } from '@renderer/src/types'
import { getGridFrame, getGridPixel } from '@renderer/src/utils/timelineUtils'
import resourceStore from '@renderer/src/stores/resourceStore'
import { TRACK_HEIGHT } from '@renderer/src/constants'
import { getNearByCell } from '@renderer/src/utils/clipUtils'

interface ICellItemProps {
  cellId: string
  trackIndex: number
}

const CellItem: FC<ICellItemProps> = ({ cellId, trackIndex }) => {
  const cellData = clipStore((state) => state.cells[cellId])
  const updateCell = clipStore((state) => state.updateCell)
  const timelineScale = clipStore((state) => state.timelineScale)
  const selectedCellIds = clipStore((state) => state.selectedCellIds)
  const addSelectedId = clipStore((state) => state.addSelectedId)
  const getResource = resourceStore((state) => state.getResource)

  const cellRef = useRef<HTMLDivElement>(null)
  const resizeBoundaryRef = useRef<{
    start: number
    end: number
  }>({
    start: 0,
    end: 0
  })

  const resource = getResource(cellData?.resourceId)
  const isSelected = selectedCellIds.includes(cellId)

  const [{ isDragging }, dragger, preview] = useDrag<IDragItem, unknown, { isDragging: boolean }>(
    () => ({
      type: EDragType.CELL_ITEM,
      item: {
        data: cellData,
        domRef: cellRef
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [cellData, cellId]
  )

  const handleResizeStart = useCallback(() => {
    const { prevCell, nextCell } = getNearByCell(cellId, trackIndex)
    // 记录resize的边界
    const prevCellEnd = prevCell ? prevCell.startFrame + prevCell.frameCount : 0
    const nextCellStart = nextCell ? nextCell.startFrame : Infinity
    resizeBoundaryRef.current = {
      start: Math.max(prevCellEnd, cellData.startFrame - cellData.selfStartFrame),
      end: Math.min(
        nextCellStart,
        cellData.startFrame + (resource?.frameCount || 0) - cellData.selfStartFrame
      )
    }
  }, [cellData, cellId, trackIndex, resource])

  // TODO 这里一直resize改变cells可能有性能问题，后续可以优化
  const handleResize = useCallback(
    ({ width, left }, trigger: TTrigger) => {
      const movingFrame = getGridFrame(timelineScale, left)
      const frameCount = getGridFrame(timelineScale, width) // cell当前总帧数
      const { start, end } = resizeBoundaryRef.current
      if (start <= movingFrame && movingFrame <= end) {
        if (trigger === 'left') {
          updateCell(cellId, {
            startFrame: movingFrame,
            frameCount: frameCount,
            selfStartFrame: cellData.selfStartFrame - (cellData.startFrame - movingFrame)
          })
        }
        if (trigger === 'right') {
          updateCell(cellId, {
            frameCount: Math.min(frameCount, end - movingFrame)
          })
        }
      }
    },
    [cellId, updateCell, timelineScale, cellData]
  )

  const handleSelect = useCallback(
    (e) => {
      e.stopPropagation()
      addSelectedId(cellId)
    },
    [addSelectedId, cellId]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  dragger(cellRef)

  const width = getGridPixel(timelineScale, cellData?.frameCount || 0)
  const left = getGridPixel(timelineScale, cellData?.startFrame || 0)

  return (
    <ResizableDiv
      options={{
        width,
        height: TRACK_HEIGHT,
        left,
        disableHeightResize: true,
        style: {
          position: 'absolute',
          opacity: isDragging ? 0 : 1,
          top: 0
        }
      }}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
    >
      <div
        data-type={EDragType.CELL_ITEM}
        data-cell-id={cellId}
        ref={cellRef}
        className={`${isDragging ? 'opacity-0' : ''} h-full`}
        onClick={handleSelect}
      >
        <CellItemUI title={cellData?.cellId + ''} width={width} focus={isSelected} />
      </div>
    </ResizableDiv>
  )
}

export default CellItem

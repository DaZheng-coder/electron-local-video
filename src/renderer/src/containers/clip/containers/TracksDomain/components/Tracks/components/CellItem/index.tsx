import clipStore from '@renderer/src/stores/clipStore'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
import { FC, useCallback, useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import CellItemUI from './CellItemUI'
import ResizableDiv from '@renderer/src/components/ResizableDiv'
import { IDragItem } from '@renderer/src/types'
import { getGridFrame, getGridPixel } from '@renderer/src/utils/timelineUtils'
import resourceStore from '@renderer/src/stores/resourceStore'

interface ICellItemProps {
  cellId: string
}

const CellItem: FC<ICellItemProps> = ({ cellId }) => {
  const cellData = clipStore((state) => state.cells[cellId])
  const updateCell = clipStore((state) => state.updateCell)
  const cellRef = useRef<HTMLDivElement>(null)
  const timelineScale = clipStore((state) => state.timelineScale)
  const getResource = resourceStore((state) => state.getResource)
  const resource = getResource(cellData?.resourceId)
  const selectedCellIds = clipStore((state) => state.selectedCellIds)
  const addSelectedId = clipStore((state) => state.addSelectedId)
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

  const handleResize = useCallback(
    ({ width, left }) => {
      // TODO
      const maxFrameCount = resource?.frameCount || 0
      const frameCount = getGridFrame(timelineScale, width)
      if (0 <= frameCount && frameCount <= maxFrameCount) {
        updateCell(cellId, {
          startFrame: getGridFrame(timelineScale, left),
          frameCount
        })
      }
    },
    [cellId, updateCell, timelineScale, resource]
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

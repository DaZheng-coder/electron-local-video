import clipStore from '@renderer/src/stores/clipStore'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import CellItemUI from './CellItemUI'
import ResizableDiv from '@renderer/src/components/ResizableDiv'
import { IDragCellItem } from '@renderer/src/types'

interface ICellItemProps {
  cellId: string
}

const CellItem: FC<ICellItemProps> = ({ cellId }) => {
  const cellData = clipStore((state) => state.cells[cellId])
  const updateCell = clipStore((state) => state.updateCell)
  const cellRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragger, preview] = useDrag<
    IDragCellItem,
    unknown,
    { isDragging: boolean }
  >(
    () => ({
      type: EDragType.CELL_ITEM,
      item: {
        cellId,
        cellData,
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
      updateCell(cellId, { width, left })
    },
    [cellId, updateCell]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  dragger(cellRef)

  return (
    <ResizableDiv
      options={{
        width: cellData?.width || 0,
        height: TRACK_HEIGHT,
        left: cellData?.left || 0,
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
        className={`${isDragging ? 'opacity-0' : ''}`}
      >
        <CellItemUI title={cellData?.cellId + ''} width={cellData?.width} />
      </div>
    </ResizableDiv>
  )
}

export default CellItem

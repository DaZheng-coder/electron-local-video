import clipStore from '@renderer/src/stores/clipStore'
import { EDragType, IDragCellItem, IDragItem, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import CellItemUI from './CellItemUI'

interface ICellItemProps {
  cellId: string
}

const CellItem: FC<ICellItemProps> = ({ cellId }) => {
  const cellData = clipStore((state) => state.cells[cellId])
  const cellRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragger, preview] = useDrag<
    IDragCellItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: EDragType.CELL_ITEM,
    item: {
      cellId,
      cellData,
      domRef: cellRef
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  dragger(cellRef)

  return (
    <div
      data-type={EDragType.CELL_ITEM}
      data-cell-id={cellId}
      ref={cellRef}
      className={`absolute ${isDragging ? 'opacity-0' : ''}`}
      style={{ left: cellData?.left || 0, top: 0 }}
    >
      <CellItemUI title={cellData?.cellId + ''} width={cellData?.width} />
    </div>
  )
}

export default CellItem

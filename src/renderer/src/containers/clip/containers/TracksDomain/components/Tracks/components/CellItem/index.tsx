import clipStore from '@renderer/src/stores/clipStore'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import CellItemUI from './CellItemUI'

interface ICellItemProps {
  cellId: string
}

const CellItem: FC<ICellItemProps> = ({ cellId }) => {
  const cellData = clipStore((state) => state.cells.find((cell) => cell.cellId === cellId))
  const cellRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragger, preview] = useDrag(() => ({
    type: EDragType.CELL_ITEM,
    item: {
      cellId
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
    <div ref={cellRef} className={`${isDragging ? 'opacity-50' : ''}`}>
      <CellItemUI title={cellData?.cellId + ''} />
    </div>
  )
}

export default CellItem

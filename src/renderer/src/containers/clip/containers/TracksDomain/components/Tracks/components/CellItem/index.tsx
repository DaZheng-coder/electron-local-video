import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'
import { useDrag } from 'react-dnd'

interface ICellItemProps {
  cellId: string
}

const CellItem: FC<ICellItemProps> = ({ cellId }) => {
  const [{ isDragging }, dragger] = useDrag(() => ({
    type: EDragType.CELL_ITEM,
    item: {},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div
      ref={dragger}
      style={{ height: TRACK_HEIGHT, transform: 'translateZ(0)' }}
      className={`absolute bg-gray-500 rounded-[6px] ${isDragging ? 'opacity-50' : ''}`}
    >
      CellItem123412341234
    </div>
  )
}

export default CellItem

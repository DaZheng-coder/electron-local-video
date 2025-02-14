import { TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'

export interface ICellItemUIProps {
  title: string
  style?: React.CSSProperties
  width?: number
}

const CellItemUI: FC<ICellItemUIProps> = ({ title, style = {}, width = 'auto' }) => {
  return (
    <div
      style={{ height: TRACK_HEIGHT, width, ...style }}
      className="absolute bg-gray-500 rounded-[6px] overflow-hidden"
    >
      {title}
    </div>
  )
}

export default CellItemUI

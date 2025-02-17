import { TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
import { FC } from 'react'

export interface ICellItemUIProps {
  title: string
  style?: React.CSSProperties
  width?: number
  focus?: boolean
}

const CellItemUI: FC<ICellItemUIProps> = ({ title, style = {}, width = 'auto', focus }) => {
  return (
    <div
      style={{ height: TRACK_HEIGHT, width, ...style }}
      className="bg-gray-500 rounded-[6px] overflow-hidden border-1 border-teal-900"
    >
      {title}
      {focus && (
        <div className="absolute rounded-[6px] left-0 right-0 top-0 w-full h-full border-amber-50 border-2 pointer-events-none"></div>
      )}
    </div>
  )
}

export default CellItemUI

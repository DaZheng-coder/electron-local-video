import { TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'

export interface ICellItemUIProps {
  title: string
  style?: React.CSSProperties
}

const CellItemUI: FC<ICellItemUIProps> = ({ title, style = {} }) => {
  return (
    <div style={{ ...style, height: TRACK_HEIGHT }} className="absolute bg-gray-500 rounded-[6px] ">
      {title}
    </div>
  )
}

export default CellItemUI

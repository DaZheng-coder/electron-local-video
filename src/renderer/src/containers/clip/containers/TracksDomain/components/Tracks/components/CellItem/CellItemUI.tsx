import { TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'

export interface ICellItemUIProps {
  title: string
}

const CellItemUI: FC<ICellItemUIProps> = ({ title }) => {
  return (
    <div style={{ height: TRACK_HEIGHT }} className="absolute bg-gray-500 rounded-[6px] ">
      {title}
    </div>
  )
}

export default CellItemUI

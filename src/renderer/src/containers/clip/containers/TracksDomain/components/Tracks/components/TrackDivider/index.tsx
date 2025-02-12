import { EDragType } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'

interface ITrackDividerProps {
  index: number
}

const TrackDivider: FC<ITrackDividerProps> = ({ index }) => {
  return <div data-type={EDragType.TRACK_DIVIDER} data-idx={index} className="h-1"></div>
}

export default TrackDivider

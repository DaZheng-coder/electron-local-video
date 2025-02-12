import { EDragType } from '@renderer/src/utils/trackUtils'
import { FC } from 'react'

interface ITrackDividerProps {
  trackLevel: number
}

const TrackDivider: FC<ITrackDividerProps> = ({ trackLevel }) => {
  return <div data-type={EDragType.TRACK_DIVIDER} data-level={trackLevel} className="h-1"></div>
}

export default TrackDivider

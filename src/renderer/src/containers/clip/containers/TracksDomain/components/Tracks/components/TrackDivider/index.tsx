import { FC } from 'react'

interface ITrackDividerProps {
  trackIndex: number
  hightLight?: boolean
}

const TrackDivider: FC<ITrackDividerProps> = ({ trackIndex, hightLight }) => {
  return <div data-index={trackIndex} className={`h-1 ${hightLight ? 'bg-amber-300' : ''}`} />
}

export default TrackDivider

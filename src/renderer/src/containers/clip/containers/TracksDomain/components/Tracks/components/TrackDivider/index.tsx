import { FC } from 'react'

interface ITrackDividerProps {
  trackLevel: number
  hightLight?: boolean
}

const TrackDivider: FC<ITrackDividerProps> = ({ trackLevel, hightLight }) => {
  return <div data-level={trackLevel} className={`h-1 ${hightLight ? 'bg-amber-300' : ''}`} />
}

export default TrackDivider

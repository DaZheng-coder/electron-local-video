import { FC } from 'react'

interface ITrackDividerProps {
  index: number
}

const TrackDivider: FC<ITrackDividerProps> = ({ index }) => {
  return <div className="h-1 flex-shrink-0"></div>
}

export default TrackDivider

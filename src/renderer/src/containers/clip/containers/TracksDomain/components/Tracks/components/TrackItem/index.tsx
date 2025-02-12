import { FC } from 'react'
import CellItem from '../CellItem'
import { TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'

interface ITrackItemProps {
  trackId: string
}

const TrackItem: FC<ITrackItemProps> = ({ trackId }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))

  return (
    <div style={{ height: TRACK_HEIGHT }} className="w-full bg-blue-500 relative rounded-[6px]">
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
    </div>
  )
}

export default TrackItem

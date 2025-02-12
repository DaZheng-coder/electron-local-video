import { FC } from 'react'
import CellItem from '../CellItem'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'

interface ITrackItemProps {
  trackId: string
  index: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, index }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))

  return (
    <div style={{ height: TRACK_HEIGHT }} className="w-full bg-blue-500 rounded-[6px]">
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
    </div>
  )
}

export default TrackItem

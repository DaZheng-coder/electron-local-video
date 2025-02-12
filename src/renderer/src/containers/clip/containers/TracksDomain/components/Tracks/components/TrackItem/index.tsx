import { FC } from 'react'
import CellItem from '../CellItem'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'

interface ITrackItemProps {
  trackId: string
  trackLevel: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackLevel }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))

  return (
    <div
      data-type={EDragType.TRACK_ITEM}
      data-level={trackLevel}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-blue-500 rounded-[6px]"
    >
      {/* {trackLevel} */}
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
    </div>
  )
}

export default TrackItem

import { FC } from 'react'
import CellItem from '../CellItem'
import { EDragType } from '@renderer/src/utils/dragUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { TRACK_HEIGHT } from '@renderer/src/constants'

interface ITrackItemProps {
  trackId: string
  trackIndex: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackIndex }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))

  return (
    <div
      data-track-id={trackId}
      data-type={EDragType.TRACK_ITEM}
      data-index={trackIndex}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-[#3B3B3B] rounded-[6px] relative"
    >
      {trackData?.cellIds.map((cellId) => (
        <CellItem key={cellId} cellId={cellId} trackIndex={trackIndex} />
      ))}
    </div>
  )
}

export default TrackItem

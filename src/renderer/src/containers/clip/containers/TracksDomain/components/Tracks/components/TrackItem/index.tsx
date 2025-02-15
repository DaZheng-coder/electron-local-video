import { FC, useRef } from 'react'
import CellItem from '../CellItem'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/dragUtils'
import clipStore from '@renderer/src/stores/clipStore'

interface ITrackItemProps {
  trackId: string
  trackIndex: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackIndex }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={trackRef}
      data-track-id={trackData?.trackId}
      data-type={EDragType.TRACK_ITEM}
      data-index={trackIndex}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-blue-500 rounded-[6px] relative"
    >
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
    </div>
  )
}

export default TrackItem

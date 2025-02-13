import { FC, useRef } from 'react'
import CellItem from '../CellItem'
import { EDragType, TRACK_HEIGHT } from '@renderer/src/utils/trackUtils'
import clipStore from '@renderer/src/stores/clipStore'
import { useDrop } from 'react-dnd'

interface ITrackItemProps {
  trackId: string
  trackLevel: number
}

const TrackItem: FC<ITrackItemProps> = ({ trackId, trackLevel }) => {
  const trackData = clipStore((state) => state.tracks.find((track) => track.trackId === trackId))
  const trackRef = useRef<HTMLDivElement>(null)

  const [cellect, dropper] = useDrop({
    accept: EDragType.CELL_ITEM,
    hover: (item, monitor) => {
      console.log('*** hover')
    },
    drop: (item, monitor) => {
      console.log('*** drop')
    }
  })

  dropper(trackRef)

  return (
    <div
      data-type={EDragType.TRACK_ITEM}
      data-level={trackLevel}
      style={{ height: TRACK_HEIGHT }}
      className="w-full bg-blue-500 rounded-[6px]"
    >
      {trackData?.cellIds.map((cellId) => <CellItem key={cellId} cellId={cellId} />)}
    </div>
  )
}

export default TrackItem

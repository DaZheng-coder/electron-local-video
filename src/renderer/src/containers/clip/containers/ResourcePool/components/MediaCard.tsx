import { IVideoData } from '@typings/index'
import MediaCardItem from './MediaCardItem'

const MediaCard = ({ data }: { data: IVideoData[] }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {data.map((item) => {
        return <MediaCardItem key={item.id} title={item.title} thumbnail={item.thumbnail} />
      })}
    </div>
  )
}

export default MediaCard

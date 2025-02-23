import { IVideoData } from '@typings/index'
import MediaCardItem from './MediaCardItem'

const MediaCard = ({ data }: { data: IVideoData[] }) => {
  console.log('*** data', data)
  return (
    <div className="flex gap-2 flex-wrap">
      {data.map((item) => {
        return <MediaCardItem key={item.id} data={item} />
      })}
    </div>
  )
}

export default MediaCard

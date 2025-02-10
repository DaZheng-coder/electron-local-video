import { IVideoData } from '@typings/index'
import MediaCardItem from './MediaCardItem'

const MediaCard = ({ data }: { data: IVideoData[] }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '16px',
        gridTemplateColumns: 'repeat( auto-fit, minmax(150px, 1fr) )'
      }}
    >
      {data.map((item) => {
        return <MediaCardItem key={item.id} title={item.title} thumbnail={item.thumbnail} />
      })}
    </div>
  )
}

export default MediaCard

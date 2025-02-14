import { IBaseMediaData } from '@typings/index'

export interface IBaseDragItem {
  domRef?: React.RefObject<HTMLDivElement>
}

export interface IDragMediaItem extends IBaseDragItem {
  mediaData: IBaseMediaData
}

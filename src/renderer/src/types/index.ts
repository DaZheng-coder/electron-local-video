import { IBaseMediaData } from '@typings/index'
import { ICellData } from '@typings/track'

export interface IPreviewCellData {
  cellId: string
  frameCount: number
  startFrame: number
  top: number
}

export interface IDragItem {
  domRef?: React.RefObject<HTMLDivElement>
  data: ICellData | IBaseMediaData
}

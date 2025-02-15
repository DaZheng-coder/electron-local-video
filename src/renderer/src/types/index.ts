import { IBaseMediaData } from '@typings/index'
import { ICellData } from '@typings/track'

export interface IPreviewCellData {
  cellId: string
  width: number
  left: number
  top: number
}

export interface IBaseDragItem {
  domRef?: React.RefObject<HTMLDivElement>
}

/**
 * 拖拽cell过程中传递的数据
 */
export interface IDragCellItem extends IBaseDragItem {
  cellId: string
  cellData: ICellData
}

/**
 * 拖拽媒体卡片过程中传递的数据
 */
export interface IDragMediaItem extends IBaseDragItem {
  mediaData: IBaseMediaData
}

export type TGlobalDragItem = IDragCellItem | IDragMediaItem

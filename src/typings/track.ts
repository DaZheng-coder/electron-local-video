export interface ITrackData {
  trackId: string
  cellIds: string[]
}
export interface ICellData {
  cellId: string
  trackId: string // 轨道id
  startFrame: number // 在轨道的起始帧数/起始位置
  frameCount: number // 当前总帧数/当前显示的总帧数
  resourceId: string // 资源id
  selfStartFrame: number // 自身开始帧数
}

export interface IPlayItem {
  // cellId: string
  // path: string
  // duration: number
  // startTime: number
  // endTime: number
}

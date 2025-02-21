export interface ITrackData {
  trackId: string
  cellIds: string[]
}
export interface ICellData {
  cellId: string
  trackId: string // 轨道id
  startFrame: number // 起始帧数
  frameCount: number // 当前总帧数
  resourceId: string // 资源id
  selfStartTime: number // 自身开始时间
  selfEndTime: number // 自身结束时间
}

export interface IPlayItem {
  // cellId: string
  // path: string
  // duration: number
  // startTime: number
  // endTime: number
}

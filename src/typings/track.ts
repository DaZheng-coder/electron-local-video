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
}

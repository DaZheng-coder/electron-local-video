import { ICellData, ITrackData } from '@typings/track'
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { sortMainTrackCells } from '../utils/clipUtils'

interface IClipStore {
  init: () => void

  timelineScale: number
  setTimelineScale: (scale: number) => void

  frameCount: number

  currentFrame: number
  setCurrentFrame: (time: number) => void

  selectedCellIds: string[]
  setSelectedCellIds: (cellIds: string[]) => void
  addSelectedId: (cellId: string) => void

  tracks: ITrackData[]
  setTracks: (tracks: ITrackData[]) => ITrackData[]
  setCells: (cells: Record<string, ICellData>) => void
  addNewTrack: (index: number, cellIds?: string[]) => ITrackData
  removeTrack: (trackId: string) => void

  cells: Record<string, ICellData>
  createCell: (data: Omit<ICellData, 'cellId'>, trackId?: string) => ICellData
  removeCellInTrack: (cellId: string) => void
  addCellInTrack: (cellId: string, trackId: string) => void
  moveCellToTrack: (cellId: string, targetTrackId: string) => void
  updateCell: (cellId: string, data: Partial<ICellData>) => void
}

const clipStore = create<IClipStore>((set, get) => ({
  init() {
    // TODO 拉取本地配置，初始化tracks
    const mainTrack = {
      trackId: uuid(),
      cellIds: []
    }
    get().setTracks([mainTrack])
  },

  timelineScale: 0,
  setTimelineScale: (scale: number) => {
    set({ timelineScale: scale })
  },

  frameCount: 0,

  currentFrame: 100,
  setCurrentFrame: (time: number) => {
    set({ currentFrame: time })
  },

  selectedCellIds: [],
  setSelectedCellIds: (cellIds: string[]) => {
    set({ selectedCellIds: cellIds })
  },
  addSelectedId: (cellId: string) => {
    if (get().selectedCellIds.includes(cellId)) return
    set({ selectedCellIds: [...get().selectedCellIds, cellId] })
  },

  /**
   * 关于轨道的操作
   */
  tracks: [],
  setTracks: (tracks: ITrackData[]) => {
    // 主轨需要贴近处理
    const { track, cells } = sortMainTrackCells(tracks[0])
    tracks[0] = track
    set({ tracks })
    get().setCells(cells)
    return tracks
  },
  setCells: (cells: Record<string, ICellData>) => {
    let maxFrameCount = 0
    for (const cellId in cells) {
      const cell = cells[cellId]
      const frameCount = cell.startFrame + cell.frameCount
      if (frameCount > maxFrameCount) {
        maxFrameCount = frameCount
      }
    }
    set({ frameCount: maxFrameCount, cells })
  },
  addNewTrack: (index: number, cellIds: string[] = []) => {
    const tracks = get().tracks.slice()
    const trackId = uuid()
    const track = { trackId, cellIds }
    tracks.splice(index, 0, track)

    if (cellIds.length) {
      const cells = { ...get().cells }
      for (const cellId of cellIds) {
        cells[cellId].trackId = trackId
      }
      get().setCells(cells)
    }

    get().setTracks(tracks)

    return track
  },
  removeTrack: (trackId: string) => {
    const oldTracks = get().tracks
    const newTracks: ITrackData[] = []
    for (let i = 0; i < oldTracks.length; i++) {
      const track = oldTracks[i]
      if (track.trackId !== trackId || i === 0) {
        newTracks.push(track)
      }
    }

    get().setTracks(newTracks)
  },

  /**
   * 关于cell的操作
   */
  cells: {},
  createCell: (cellData, trackId) => {
    const id = uuid()
    const cells = { ...get().cells }
    const cell: ICellData = { ...cellData, cellId: id }
    cells[id] = cell
    get().setCells(cells)
    if (trackId) {
      get().addCellInTrack(cell.cellId, trackId)
    }
    return cell
  },
  removeCellInTrack: (cellId: string) => {
    const cells = { ...get().cells }
    const trackId = cells[cellId].trackId
    cells[cellId].trackId = ''

    const tracks = get().tracks.slice()
    const track = tracks.find((track) => track.trackId === trackId)
    if (!track) return
    track.cellIds = track.cellIds.filter((id) => id !== cellId)

    get().setCells(cells)
    get().setTracks(tracks)

    // 当前轨道为空时，删掉该轨道
    if (!track.cellIds.length) {
      get().removeTrack(trackId)
    }
  },
  addCellInTrack: (cellId: string, trackId: string) => {
    const cells = { ...get().cells }
    cells[cellId].trackId = trackId

    const tracks = get().tracks.slice()
    const track = tracks.find((track) => track.trackId === trackId)
    if (!track) return
    if (track.cellIds.includes(cellId)) return
    track.cellIds.push(cellId)

    get().setCells(cells)
    get().setTracks(tracks)
  },
  moveCellToTrack: (cellId: string, targetTrackId: string) => {
    const cells = { ...get().cells }
    const fromTrackId = cells[cellId].trackId
    if (fromTrackId === targetTrackId && fromTrackId !== get().tracks[0].trackId) {
      return
    } else {
      get().removeCellInTrack(cellId)
      get().addCellInTrack(cellId, targetTrackId)
    }
  },
  updateCell: (cellId: string, data: Partial<ICellData>) => {
    const cells = { ...get().cells }
    const oldCell = cells[cellId]
    const newCell = { ...oldCell, ...data }
    cells[cellId] = newCell
    // 如果调整的是主轨的宽度，需要重新排序
    if (newCell.trackId === get().tracks[0].trackId && data.frameCount) {
      const { cells: newCells } = sortMainTrackCells(get().tracks[0], cells)
      get().setCells(newCells)
    } else {
      get().setCells(cells)
    }
  }
}))

export default clipStore

import PreviewPlay from '../containers/clip/service/PreviewPlay'
import clipStore from '../stores/clipStore'
import resourceStore from '../stores/resourceStore'
import { getCellByCurrentFrame, getTimeByFrame } from './clipUtils'
import { getResourcePath } from './common'

export const previewCurrentCell = (_currentFrame?: number) => {
  const currentFrame =
    typeof _currentFrame === 'number' ? _currentFrame : clipStore.getState().currentFrame
  const cell = getCellByCurrentFrame(currentFrame)
  if (!cell) {
    // PreviewPlay.changePlayerVideo('')
    return
  }
  const resource = resourceStore.getState().getResource(cell.resourceId)
  const url = getResourcePath(resource?.path)
  const startTime = getTimeByFrame(currentFrame - cell.startFrame + cell.selfStartFrame)

  PreviewPlay.changePlayerVideo(url, startTime)
}

export const registerTimeUpdate = () => {}

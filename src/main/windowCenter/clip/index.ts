import { screen } from 'electron'
import { BaseWindowOptions } from '../../types'
import BaseWindow from '../BaseWindow'

function CreateClipWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize
  const screenWidth = size.width
  const screenHeight = size.height
  const options: BaseWindowOptions = {
    name: 'clip',
    title: 'clip',
    width: screenWidth,
    height: screenHeight
    // resizable: false,
  }
  const clipWindow = new BaseWindow(options)
  return clipWindow
}

export default CreateClipWindow

import { screen } from 'electron'
import { BaseWindowOptions } from '../../types'
import BaseWindow from '../BaseWindow'
import path from 'path'
import MediaTool from '../../mediaTool'
import { staticPath } from '../../staticPath'

function CreateClipWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize
  // const screenWidth = size.width
  // const screenHeight = size.height
  const screenWidth = 900
  const screenHeight = 800
  const options: BaseWindowOptions = {
    name: 'clip',
    title: 'clip',
    width: screenWidth,
    height: screenHeight,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/clip.js')
    }
  }
  const clipWindow = new BaseWindow(options)

  MediaTool.config({ localStaticPath: staticPath })

  return clipWindow
}

export default CreateClipWindow

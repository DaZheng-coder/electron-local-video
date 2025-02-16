import { ipcMain, screen } from 'electron'
import { BaseWindowOptions } from '../../types'
import BaseWindow from '../BaseWindow'
import path from 'path'
import { EMediaToolChannels } from '../../../typings/store'
import MediaTool from '../../mediaTool'
import { staticPath } from '../../staticPath'

function CreateClipWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize
  // const screenWidth = size.width
  // const screenHeight = size.height
  const screenWidth = 1200
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
  ipcMain.handle(EMediaToolChannels.GenerateThumbnail, async (_, inputPath) => {
    console.log(' ipcMaininputPath:', inputPath)
    return await MediaTool.generateThumbnail(inputPath)
  })
  return clipWindow
}

export default CreateClipWindow

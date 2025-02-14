import { BrowserWindow } from 'electron'
import BaseWindow from './BaseWindow'
import CreateClipWindow from './clip'

class WindowCenter {
  windows: Record<string, BaseWindow> = {}
  constructor() {
    this.windows = {
      clip: CreateClipWindow()
    }
  }

  public getAllWindows() {
    return BrowserWindow.getAllWindows()
  }

  public sendToAllWindows(channel: string, args: unknown) {
    const allWindows = this.getAllWindows()
    allWindows.forEach((item) => {
      item.webContents.send(channel, args)
    })
  }

  public closeAllWindows() {
    const allWindows = this.getAllWindows()
    allWindows.forEach((item) => {
      item.close()
    })
  }

  public hideAllWindows() {
    const allWindows = this.getAllWindows()
    allWindows.forEach((item) => {
      item.hide()
    })
  }

  public minimizeAllWindows() {
    const allWindows = this.getAllWindows()
    allWindows.forEach((item) => {
      if (item.isVisible()) {
        item.minimize()
      }
    })
  }

  public getFocusedWindows() {
    return BrowserWindow.getFocusedWindow()
  }
}

export default WindowCenter

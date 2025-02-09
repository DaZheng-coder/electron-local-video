import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import WindowCenter from './windowCenter'

function setup() {
  if (!global.windowCenter) {
    global.windowCenter = new WindowCenter()
  }
  global.windowCenter.windows.clip.open()
  global.env = {
    mode: import.meta.env.MODE // development, production
  }
  console.log('mode:', global.env.mode)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setup()

  // // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      setup()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

import { app, BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { BaseWindowLoadOptions, BaseWindowOptions } from '../types'
import _ from 'lodash'
import path from 'path'

class BaseWindow {
  private _name: string
  private _instance: BrowserWindow | null = null
  browserWindowOption: BrowserWindowConstructorOptions = {
    title: 'clip',
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      sandbox: false
    }
  }

  constructor(options: BaseWindowOptions) {
    const { name, ...windowOptions } = options
    this._name = name
    this.browserWindowOption = _.merge(this.browserWindowOption, windowOptions)
  }

  create(options?: BaseWindowLoadOptions, visible?: boolean) {
    this.browserWindowOption = _.merge(this.browserWindowOption, options?.browserWindowOptions)
    console.log(`create window ${this._name}`)
    // this._initInstance()

    this._instance = new BrowserWindow(this.browserWindowOption)
    this._instance.on('ready-to-show', () => {
      if (visible) {
        this._instance?.show()
      } else {
        this._instance?.hide()
      }
    })

    this._instance.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      this._instance.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/entry/${this._name}.html`)
    } else {
      this._instance.loadFile(path.join(__dirname, `../../renderer/entry/${this._name}.html`))
    }
  }

  open(options?: BaseWindowLoadOptions) {
    let show = true
    if (options?.show === false) {
      show = false
    }
    if (this._instance && !this._instance.isDestroyed()) {
      this._instance.show()
    } else {
      this.create(options, show)
    }
  }

  close() {
    this._instance?.close()
    this._instance?.destroy()
    this._instance = null
  }

  hide() {
    this._instance?.hide()
  }

  show() {
    this._instance?.show()
  }

  minimize() {
    this._instance?.minimize()
  }

  openDevTools() {
    this._instance?.webContents.openDevTools()
  }

  getInstance() {
    return this._instance
  }
}

export default BaseWindow

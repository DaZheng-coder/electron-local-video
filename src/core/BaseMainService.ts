const { ipcMain } = require('electron')

class BaseMainService {
  constructor() {
    this.install()
  }

  private install() {
    const name = this.constructor.name
    ipcMain.handle(name, async (event, ...args) => {
      const method = args.shift()
      if (typeof this[method] !== 'function') {
        throw new Error(`Method ${method} not found in ${name}`)
      }
      return this[method](event, ...args)
    })
  }
}

export default BaseMainService

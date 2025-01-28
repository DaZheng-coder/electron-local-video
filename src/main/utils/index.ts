import { ipcMain, IpcMainInvokeEvent } from 'electron'

export function registerHandler(apisObject: object) {
  Object.keys(apisObject).map((methodName: string) => {
    if (typeof apisObject[methodName] === 'function') {
      ipcMain.handle(methodName, async (_: IpcMainInvokeEvent, ...args: unknown[]) => {
        return await apisObject[methodName](...args)
      })
    }
  })
}

import { app } from 'electron'
import path from 'path'
import fs from 'fs'
export const staticPath = path.join(app.getPath('userData'), 'static')
fs.access(staticPath, (exists) => {
  !exists && fs.mkdir(staticPath, () => {})
})

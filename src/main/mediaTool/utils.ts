import fs from 'fs'
import path from 'path'

export const ensureDir = (folderPath: string): boolean => {
  try {
    const exists = fs.existsSync(folderPath)
    if (!exists) {
      return mkdirSync(folderPath) || false
    } else {
      return true
    }
  } catch (error) {
    console.log('ensureDir error:', error)
    return false
  }
}

export const mkdirSync = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
    return false
  }
}

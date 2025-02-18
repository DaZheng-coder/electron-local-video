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

export const getHash = (str: string): string => {
  let hash = 0
  let i
  let chr
  if (str.length !== 0) {
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
  }
  return hash.toString(16)
}

export const clearDir = (folderPath: string) => {
  fs.rmdirSync(folderPath, { recursive: true })
  ensureDir(folderPath)
}

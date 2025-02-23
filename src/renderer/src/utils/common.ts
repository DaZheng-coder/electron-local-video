/**
 * 以合法的方式获取本地资源路径
 * @param path
 * @returns
 */
export const getResourcePath = (path: string | undefined) => {
  if (!path) return ''
  return path
  // return `local-resource://${path}`
}

/**
 * 将file协议URI转换为Windows本地路径
 * @param uri
 * @returns
 */
export const convertFileUriToWindowsPath = (uri: string): string => {
  console.log('*** uri', uri)
  if (!uri) return ''

  const decodedPath = decodeURIComponent(uri.slice(8)) // 移除file:///前缀

  // 转换路径分隔符（支持多个操作系统环境）
  const windowsPath = decodedPath
    .replace(/\//g, '\\') // 全局替换正斜杠为反斜杠
    .replace(/\\\\+/g, '\\') // 合并连续反斜杠

  // 处理可能的编码残留（如%25转为%）
  return windowsPath.replace(/%(\w{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

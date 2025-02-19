/**
 * 以合法的方式获取本地资源路径
 * @param path
 * @returns
 */
export const getResourcePath = (path: string) => {
  return `local-resource://${path}`
}

export interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  thumbnail: string
  // *** todo 考虑文件夹被删除的情况
}

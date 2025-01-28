import { FC } from 'react'
import { FileItem } from 'src/main/types/file'

const FolderItem: FC<{
  folderItem: FileItem
  onClick?: (folderItem: FileItem) => void
}> = ({ folderItem, onClick }) => {
  return (
    <div
      className="border-l-3 flex-1 border-primary shadow p-2 hover:shadow-lg cursor-pointer"
      onClick={() => onClick?.(folderItem)}
    >
      <div className="truncate text-xl">{folderItem.name}</div>
      <div className="truncate-2 break-all text-gray-400">{folderItem.path}</div>
    </div>
  )
}

export default FolderItem

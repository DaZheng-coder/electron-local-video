import { XYCoord } from 'react-dnd'

export const TRACK_HEIGHT = 60

export enum EDragType {
  CELL_ITEM = 'CELL_ITEM',
  TRACK_ITEM = 'TRACK_ITEM'
}

/**
 * 判断光标是否在父元素内且不在任何子元素内
 * @param clientOffset
 * @param parentRef
 * @returns
 */
export const isCursorInParentExcludingChildren = (
  clientOffset: XYCoord | null,
  parentRef: React.RefObject<HTMLDivElement>
) => {
  if (!parentRef.current || !clientOffset) return false

  const parentRect = parentRef.current.getBoundingClientRect()
  // 检查是否在父元素内
  const inParent =
    clientOffset.x >= parentRect.left &&
    clientOffset.x <= parentRect.right &&
    clientOffset.y >= parentRect.top &&
    clientOffset.y <= parentRect.bottom
  if (!inParent) return false

  // 检查是否在任何子元素内
  const children = parentRef.current.children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const childRect = child.getBoundingClientRect()
    const inChild =
      clientOffset.x >= childRect.left &&
      clientOffset.x <= childRect.right &&
      clientOffset.y >= childRect.top &&
      clientOffset.y <= childRect.bottom
    if (inChild) return false
  }
  return true
}

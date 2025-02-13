import { XYCoord } from 'react-dnd'

export const TRACK_HEIGHT = 60

export enum EDragType {
  CELL_ITEM = 'CELL_ITEM',
  TRACK_ITEM = 'TRACK_ITEM'
}

// export const getIsInEmptyArea = (
//   clientOffset: XYCoord | null,
//   parentRef: React.RefObject<HTMLDivElement>
// ): boolean => {
//   // 0. 参数容错处理
//   if (!parentRef.current || !clientOffset) return false

//   const parentRect = parentRef.current.getBoundingClientRect()
//   // 1. 检查是否在父元素内
//   const inParent =
//     clientOffset.x >= parentRect.left &&
//     clientOffset.x <= parentRect.right &&
//     clientOffset.y >= parentRect.top &&
//     clientOffset.y <= parentRect.bottom
//   if (!inParent) return false

//   // 2. 检查是否在子元素内
//   const children = parentRef.current.children
//   if (!children.length) return true
//   const top = children[0].getBoundingClientRect().top
//   const bottom = children[children.length - 1].getBoundingClientRect().bottom
//   const left = parentRect.left
//   const right = parentRect.right

//   if (
//     clientOffset.x >= left &&
//     clientOffset.x <= right &&
//     clientOffset.y >= top &&
//     clientOffset.y <= bottom
//   ) {
//     return false
//   }

//   return true
// }

/**
 * 获取要插入的轨道位置
 * @param clientOffset
 * @param parentRef
 * @returns
 */
export const getInsertTrackIndexByOffset = (
  clientOffset: XYCoord | null,
  parentRef: React.RefObject<HTMLDivElement>
) => {
  // 0. 参数容错处理
  if (!parentRef.current || !clientOffset) return -1

  // 1. 获取所有轨道元素，主轨道的等级为0
  const trackItems = Array.from(parentRef.current.children)
    .filter((child) => {
      return child.getAttribute('data-type') === EDragType.TRACK_ITEM
    })
    .sort(
      (a, b) =>
        parseInt(a.getAttribute('data-level') || '0') -
        parseInt(b.getAttribute('data-level') || '0')
    )

  // 2. 获取每个轨道的位置信息
  const trackRects: DOMRect[] = []
  for (let i = 0; i < trackItems.length; i++) {
    const child = trackItems[i]
    const childRect = child.getBoundingClientRect()
    trackRects.push(childRect)
  }

  // 3. 计算插入索引
  // 特判是否位于主轨前端的区域，如果是则插入到主轨后面（需求要求）
  if (clientOffset.y > trackRects[0].bottom) return 1
  // 特判是否位于最后一个轨道的后面, 如果是则插入到最后一个轨道的后面
  if (clientOffset.y < trackRects[trackRects.length - 1].top) return trackRects.length

  for (let i = 0; i < trackRects.length - 1; i++) {
    // 判断要不要插入到当前轨道的后面
    if (clientOffset.y < trackRects[i].top && clientOffset.y > trackRects[i + 1].bottom) {
      return i + 1
    }
  }

  return -1
}

// *** test
export const getInsertCellPositionByOffset = (
  clientOffset: XYCoord | null,
  parentRef: React.RefObject<HTMLDivElement>
) => {
  // 0. 参数容错处理
  if (!parentRef.current || !clientOffset) return -1

  // 1. 获取所有单元元素
  const cellItems = Array.from(parentRef.current.children)
    .filter((child) => {
      return child.getAttribute('data-type') === EDragType.CELL_ITEM
    })
    .sort((a, b) => {
      const aTop = a.getBoundingClientRect().top
      const bTop = b.getBoundingClientRect().top
      return aTop - bTop
    })

  // 2. 获取每个单元的位置信息
  const cellRects: DOMRect[] = []
  for (let i = 0; i < cellItems.length; i++) {
    const child = cellItems[i]
    const childRect = child.getBoundingClientRect()
    cellRects.push(childRect)
  }

  // 3. 计算插入索引
  for (let i = 0; i < cellRects.length - 1; i++) {
    // 判断要不要插入到当前单元的后面
    if (clientOffset.y < cellRects[i].top && clientOffset.y > cellRects[i + 1].bottom) {
      return i + 1
    }
  }

  return -1
}

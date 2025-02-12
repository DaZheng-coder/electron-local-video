import { XYCoord } from 'react-dnd'

export const TRACK_HEIGHT = 60

export enum EDragType {
  CELL_ITEM = 'CELL_ITEM',
  TRACK_ITEM = 'TRACK_ITEM'
}

export const getIsInEmptyArea = (
  clientOffset: XYCoord | null,
  parentRef: React.RefObject<HTMLDivElement>
): boolean => {
  // 0. 参数容错处理
  if (!parentRef.current || !clientOffset) return false

  const parentRect = parentRef.current.getBoundingClientRect()
  // 1. 检查是否在父元素内
  const inParent =
    clientOffset.x >= parentRect.left &&
    clientOffset.x <= parentRect.right &&
    clientOffset.y >= parentRect.top &&
    clientOffset.y <= parentRect.bottom
  if (!inParent) return false

  // 2. 检查是否在子元素内
  const children = parentRef.current.children
  if (!children.length) return true
  const top = children[0].getBoundingClientRect().top
  const bottom = children[children.length - 1].getBoundingClientRect().bottom
  const left = parentRect.left
  const right = parentRect.right

  if (
    clientOffset.x >= left &&
    clientOffset.x <= right &&
    clientOffset.y >= top &&
    clientOffset.y <= bottom
  ) {
    return false
  }

  return true
}

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
  if (!parentRef.current || !clientOffset) return 1

  // const parentRect = parentRef.current.getBoundingClientRect()
  // // 检查是否在父元素内
  // const inParent =
  //   clientOffset.x >= parentRect.left &&
  //   clientOffset.x <= parentRect.right &&
  //   clientOffset.y >= parentRect.top &&
  //   clientOffset.y <= parentRect.bottom
  // if (!inParent) return false

  // 1. 获取所有轨道元素，主轨道的索引为0
  const trackItems = Array.from(parentRef.current.children)
    .filter((child) => {
      return child.getAttribute('data-type') === EDragType.TRACK_ITEM
    })
    .sort(
      (a, b) =>
        parseInt(a.getAttribute('data-idx') || '0') - parseInt(b.getAttribute('data-idx') || '0')
    )
  if (trackItems.length === 1) return 1 // 只有主轨道时，插入到主轨道后面

  // 2. 获取每个轨道的位置信息
  const trackRects: DOMRect[] = []
  for (let i = 0; i < trackItems.length; i++) {
    const child = trackItems[i]
    const childRect = child.getBoundingClientRect()
    trackRects.push(childRect)
  }

  // 3. 计算插入索引
  let insertIndex = 1
  // 特判是否位于主轨前端的区域，如果是则插入到主轨后面（需求要求）
  if (clientOffset.y > trackRects[0].bottom) return 1

  for (let i = 0; i < trackRects.length - 1; i++) {
    // 判断要不要插入到当前轨道的后面
    if (clientOffset.y < trackRects[i].top && clientOffset.y > trackRects[i + 1].bottom) {
      insertIndex = i + 1
      break
    }
  }

  // 特判要不要插入到最后一个轨道的后面
  if (clientOffset.y < trackRects[trackRects.length - 1].top) {
    insertIndex = trackRects.length
  }

  console.log('*** insertIndex', insertIndex)

  return insertIndex
}

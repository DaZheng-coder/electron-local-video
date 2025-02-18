import { useState, useEffect, useCallback } from 'react'
import { XYCoord } from 'react-dnd'

type TDragConstraint = 'both' | 'horizontal' | 'vertical'

type TDragBoundary = {
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
}

interface IUseNativeDrag {
  ref: React.RefObject<HTMLDivElement>
  constraint?: TDragConstraint
  initPosition?: XYCoord
  boundary?: TDragBoundary
  onDragStart?: () => void
  onDragging?: (position: XYCoord) => void
  onDragEnd?: (position: XYCoord) => void
}

const useNativeDrag = ({
  ref,
  constraint = 'both',
  initPosition = { x: 0, y: 0 },
  boundary,
  onDragStart,
  onDragging,
  onDragEnd
}: IUseNativeDrag) => {
  const [position, setPosition] = useState(initPosition)
  const [isDragging, setIsDragging] = useState(false)

  // 边界约束计算
  const applyBoundary = useCallback(
    (x: number, y: number) => {
      if (!boundary) return { x, y }
      const { minX = -Infinity, maxX = Infinity, minY = -Infinity, maxY = Infinity } = boundary

      return {
        x: Math.max(minX, Math.min(x, maxX)),
        y: Math.max(minY, Math.min(y, maxY))
      }
    },
    [boundary]
  )

  const updatePosition = useCallback(
    (x: number, y: number) => {
      const constrained = applyBoundary(x, y)
      setPosition(constrained)
      onDragging?.(constrained)
    },
    [applyBoundary, onDragging]
  )

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    let startX = 0
    let startY = 0

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      startX = e.clientX - position.x
      startY = e.clientY - position.y

      // 防止文本选中
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
      onDragStart?.()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      let newX = position.x
      let newY = position.y

      if (constraint !== 'vertical') {
        newX = e.clientX - startX
      }

      if (constraint !== 'horizontal') {
        newY = e.clientY - startY
      }
      updatePosition(newX, newY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      onDragEnd?.(position)
    }

    element.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, position, ref, constraint, updatePosition, onDragStart, onDragEnd])

  return {
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: 'grab'
    },
    isDragging
  }
}

export default useNativeDrag

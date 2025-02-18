import { useState, useEffect, useCallback, useRef } from 'react'

type TDragBoundary = {
  minX?: number
  maxX?: number
}

interface IUseNativeDrag {
  ref: React.RefObject<HTMLDivElement>
  initPosition?: { x: number }
  boundary?: TDragBoundary
  onDragStart?: () => void
  onDragging?: (position: { x: number }) => void
  onDragEnd?: (position: { x: number }) => void
}

const useAnchorDrag = ({
  ref,
  initPosition = { x: 0 },
  boundary,
  onDragStart,
  onDragging,
  onDragEnd
}: IUseNativeDrag) => {
  const [position, setPosition] = useState(initPosition)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)
  // 边界约束计算
  const applyBoundary = useCallback(
    (x: number) => {
      if (!boundary) return { x }
      const { minX = -Infinity, maxX = Infinity } = boundary

      return {
        x: Math.max(minX, Math.min(x, maxX))
      }
    },
    [boundary]
  )

  const updatePosition = useCallback(
    (x: number) => {
      const constrained = applyBoundary(x)
      setPosition(constrained)
      onDragging?.(constrained)
    },
    [applyBoundary, onDragging]
  )

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      startXRef.current = e.clientX - position.x

      // 防止文本选中
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
      onDragStart?.()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - startXRef.current

      updatePosition(newX)
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
  }, [isDragging, position, ref, updatePosition, onDragStart, onDragEnd])

  return {
    style: {
      transform: `translate(${position.x}px)`,
      cursor: 'grab'
    },
    isDragging
  }
}

export default useAnchorDrag

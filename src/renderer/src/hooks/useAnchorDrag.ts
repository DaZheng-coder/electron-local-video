import { useState, useEffect, useCallback, useRef } from 'react'
import clipStore from '../stores/clipStore'
import { getGridPixel } from '../utils/timelineUtils'
import dragStore from '../stores/dragStore'

type TDragBoundary = {
  minX?: number
  maxX?: number
}

interface IUseNativeDrag {
  ref: React.RefObject<HTMLDivElement>
  onDragStart?: () => void
  onDragging?: (position: { x: number }) => void
  onDragEnd?: (position: { x: number }) => void
}

const useAnchorDrag = ({ ref, onDragStart, onDragging, onDragEnd }: IUseNativeDrag) => {
  const currentFrame = clipStore((state) => state.currentFrame)
  const frameCount = clipStore((state) => state.frameCount)
  const timelineScale = clipStore((state) => state.timelineScale)
  const tracksScrollLeft = dragStore((state) => state.tracksScrollLeft)

  const [position, setPosition] = useState<{ x: number }>({ x: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)
  const [boundary, setBoundary] = useState<TDragBoundary>({
    minX: -Infinity,
    maxX: Infinity
  })

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

  // 根据总帧数变化，更新锚点边界
  useEffect(() => {
    setBoundary({ minX: 0, maxX: getGridPixel(timelineScale, frameCount) })
  }, [frameCount, timelineScale])

  // 根据当前帧数变化，更新锚点位置
  useEffect(() => {
    setPosition({ x: getGridPixel(timelineScale, currentFrame) })
  }, [currentFrame, timelineScale])

  // 根据滚动条变化，更新锚点位置
  useEffect(() => {
    setPosition({
      x: getGridPixel(timelineScale, currentFrame) - tracksScrollLeft
    })
  }, [tracksScrollLeft, currentFrame, timelineScale])

  // 锚点跟随鼠标移动
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

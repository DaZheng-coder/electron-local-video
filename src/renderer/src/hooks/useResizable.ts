import { RefObject, useCallback, useEffect, useState } from 'react'
import { XYCoord } from 'react-dnd'

export interface ResizableOptions {
  minWidth?: number
  minHeight?: number
  initWidth?: number
  initHeight?: number
}

export interface IDimensions {
  width: number
  height: number
}

const useResizable = (ref: RefObject<HTMLElement>, options: ResizableOptions = {}) => {
  const [dimensions, setDimensions] = useState<IDimensions>({
    width: options.initWidth || 0,
    height: options.initHeight || 0
  })
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<XYCoord>({ x: 0, y: 0 })
  const [startDimensions, setStartDimensions] = useState<IDimensions>({ width: 0, height: 0 })

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsResizing(true)
      setStartPos({ x: e.clientX, y: e.clientY })
      setStartDimensions({ width: dimensions.width, height: dimensions.height })

      // 防止文本选中
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [dimensions]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = startDimensions.width + (e.clientX - startPos.x)
      const newHeight = startDimensions.height + (e.clientY - startPos.y)

      // 限制最小尺寸
      setDimensions({
        width: Math.max(options.minWidth || 0, newWidth),
        height: Math.max(options.minHeight || 0, newHeight)
      })
    },
    [isResizing, startPos, startDimensions, options]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    if (!ref.current) return
    ref.current.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })
}

export default useResizable

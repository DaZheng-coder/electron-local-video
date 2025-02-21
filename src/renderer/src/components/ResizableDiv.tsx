import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { XYCoord } from 'react-dnd'

export const HANDLER_WIDTH = 10 // 单手柄宽度
export const HANDLER_HEIGHT = 10 // 单手柄高度
export const HANDLER_WIDTH_BOTTOM_RIGHT = 15 // 右下角手柄宽度

export interface IResizableDivProps extends PropsWithChildren {
  options: IResizableOptions
  onResizeStart?: (trigger: TTrigger) => void
  onResize?: (dimensions: IDimensions, trigger: TTrigger) => void
  onResizeEnd?: (trigger: TTrigger) => void
}

export interface IResizableOptions {
  width: number
  height: number
  left: number
  disableWithResize?: boolean // 禁用宽度调整
  disableHeightResize?: boolean // 禁用高度调整
  style?: React.CSSProperties
}

export interface IDimensions {
  width: number
  height: number
  left: number
}

export type TTrigger = 'left' | 'right' | 'bottom' | 'rightBottom' | undefined // 触发调整的手柄类型

function ResizableDiv({
  children,
  options,
  onResize,
  onResizeStart,
  onResizeEnd
}: IResizableDivProps) {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<XYCoord>({ x: 0, y: 0 }) // 鼠标按下时的坐标
  const [startDim, setStartDim] = useState<IDimensions>({ width: 0, height: 0, left: 0 }) // 鼠标按下时的尺寸
  const [trigger, setTrigger] = useState<TTrigger>() // 触发调整的手柄类型

  // 处理鼠标按下事件，准备初始数据
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, trigger: TTrigger) => {
      setIsResizing(true)
      setStartPos({ x: e.clientX, y: e.clientY })
      setStartDim({ ...options })
      setTrigger(trigger)

      // 防止文本选中
      document.body.style.userSelect = 'none'

      onResizeStart?.(trigger)
    },
    [options, onResizeStart]
  )

  // 处理鼠标移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const { width: startWidth, height: startHeight, left: startLeft } = startDim
      const { disableWithResize, disableHeightResize, height } = options
      const offsetX = e.clientX - startPos.x
      const offsetY = e.clientY - startPos.y

      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft

      // 根据触发的手柄类型，计算新的尺寸
      if (trigger === 'right') {
        newWidth = startWidth + offsetX
      } else if (trigger === 'left') {
        // 手柄在左侧，调整宽度的同时调整left，同时限制left的最小值
        newWidth = startWidth - offsetX
        // TODO 修复newLeft取值问题
        newLeft = startLeft + offsetX
      } else {
        newWidth = disableWithResize ? options.width : startWidth + offsetX
        newHeight = disableHeightResize ? height : startHeight + offsetY
      }

      const res: IDimensions = {
        width: newWidth,
        height: newHeight,
        left: newLeft
      }

      requestAnimationFrame(() => {
        onResize?.(res, trigger)
      })
    },
    [isResizing, startPos, startDim, options, onResize, trigger]
  )

  // 处理鼠标释放
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setTrigger(undefined)
    document.body.style.userSelect = ''

    onResizeEnd?.(trigger)
  }, [onResizeEnd, trigger])

  // 添加全局事件监听
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      style={{
        width: options.width,
        height: options.height,
        left: options.left,
        position: 'relative',
        ...(options.style || {})
      }}
    >
      {/* 左侧调整手柄 */}
      {!options.disableWithResize && (
        <div
          className="absolute left-0 top-0 bottom-0 cursor-col-resize bg-transparent z-[99]"
          style={{ width: `${HANDLER_WIDTH}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'left')}
        />
      )}

      {/* 右侧调整手柄 */}
      {!options.disableWithResize && (
        <div
          className="absolute right-0 top-0 bottom-0 cursor-col-resize bg-transparent z-[99]"
          style={{ width: `${HANDLER_WIDTH}px` }}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />
      )}

      {/* 底部调整手柄 */}
      {!options.disableHeightResize && (
        <div
          className="absolute left-0 right-0 bottom-0 cursor-col-resize bg-transparent z-[99]"
          style={{ height: `${HANDLER_HEIGHT}px` }}
          onMouseDown={(e) => {
            setIsResizing(true)
            setStartPos({ x: e.clientX, y: e.clientY })
            setStartDim(options)
            document.body.style.userSelect = 'none'
          }}
        />
      )}

      {/* 右下角调整手柄 */}
      {!options.disableWithResize && !options.disableHeightResize && (
        <div
          style={{
            width: `${HANDLER_WIDTH_BOTTOM_RIGHT}px`,
            height: `${HANDLER_WIDTH_BOTTOM_RIGHT}px`
          }}
          className="absolute right-0 bottom-0 cursor-nwse-resize bg-transparent z-[99]"
          onMouseDown={(e) => {
            setIsResizing(true)
            setStartPos({ x: e.clientX, y: e.clientY })
            setStartDim(options)
            document.body.style.userSelect = 'none'
          }}
        />
      )}
      {children}
    </div>
  )
}

export default ResizableDiv

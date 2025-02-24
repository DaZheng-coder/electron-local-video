// filepath: /Users/zhengjunqin/electron-local-video/src/renderer/src/containers/clip/containers/TracksDomain/components/Timeline.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  drawTimeLine,
  getSelectFrame,
  UserConfig,
  CanvasConfig,
  getGridFrame
} from '@renderer/src/utils/timelineUtils'
import { TIMELINE_HEIGHT } from '@renderer/src/constants'
import clipStore from '@renderer/src/stores/clipStore'
import dragStore from '@renderer/src/stores/dragStore'

interface TimelineProps {
  start?: number
  step?: number
  focusPosition?: {
    start: number
    end: number
  }
  onSelectFrame?: (val: number) => void
}

const Timeline: React.FC<TimelineProps> = ({
  step = 30,
  focusPosition = { start: 0, end: 0 },
  onSelectFrame
}) => {
  const scale = clipStore((state) => state.timelineScale) // 缩放比例 0 ～ 100
  const start = dragStore((state) => state.tracksScrollLeft)

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLCanvasElement>(null)
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null)
  const initSizeRef = useRef<boolean>(true)
  const [canvasAttr, setCanvasAttr] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const visible = clipStore((state) => state.frameCount > 0)

  const canvasConfigs = useMemo(() => {
    const isDark = true
    return {
      bgColor: isDark ? '#303030' : '#E5E7EB',
      ratio: window.devicePixelRatio || 1,
      textSize: 12,
      textScale: 0.83,
      lineWidth: 1,
      textBaseline: 'middle' as CanvasTextBaseline,
      textAlign: 'center' as CanvasTextAlign,
      longColor: isDark ? '#E5E7EB' : '#374151',
      shortColor: isDark ? '#9CA3AF' : '#6B7280',
      textColor: isDark ? '#E5E7EB' : '#374151',
      subTextColor: isDark ? '#9CA3AF' : '#6B7280',
      focusColor: isDark ? '#6D28D9' : '#C4B5FD'
    }
  }, [])

  const canvasStyle = {
    width: `${canvasAttr.width / canvasConfigs.ratio}px`,
    height: `${canvasAttr.height / canvasConfigs.ratio}px`
  }

  const setCanvasContext = useCallback(() => {
    const ctx = timelineRef.current?.getContext('2d')
    if (ctx) {
      canvasContextRef.current = ctx
      ctx.font = `${canvasConfigs.textSize * canvasConfigs.ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`
      ctx.lineWidth = canvasConfigs.lineWidth
      ctx.textBaseline = canvasConfigs.textBaseline
      ctx.textAlign = canvasConfigs.textAlign
    }
  }, [canvasConfigs])

  const updateTimeLine = useCallback(() => {
    if (canvasContextRef.current) {
      drawTimeLine(
        canvasContextRef.current,
        { start, step, scale, focusPosition } as UserConfig,
        { ...canvasAttr, ...canvasConfigs } as CanvasConfig
      )
    }
  }, [start, step, scale, focusPosition, canvasAttr, canvasConfigs])

  const setCanvasRect = useCallback(() => {
    if (canvasContainerRef.current) {
      const { width, height } = canvasContainerRef.current.getBoundingClientRect()
      setCanvasAttr({
        width: width * canvasConfigs.ratio,
        height: height * canvasConfigs.ratio
      })
      initSizeRef.current = false
    }
  }, [canvasConfigs.ratio])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = event.nativeEvent.offsetX
    const frameIndex = getSelectFrame(start + offset, scale, step)
    if (onSelectFrame) {
      onSelectFrame(frameIndex)
    }
  }

  // 窗口变化时，重新计算画布尺寸
  useEffect(() => {
    setCanvasRect()
    window.addEventListener('resize', setCanvasRect)
    return () => {
      window.removeEventListener('resize', setCanvasRect)
    }
  }, [setCanvasRect])

  // 画布参数变化时，重新绘制画布
  useEffect(() => {
    updateTimeLine()
  }, [canvasConfigs, updateTimeLine])

  // 初始化时，设置画布参数
  useEffect(() => {
    if (initSizeRef.current) {
      setTimeout(() => {
        setCanvasRect()
      }, 300)
    } else {
      setCanvasContext()
      updateTimeLine()
    }
  }, [setCanvasRect, setCanvasContext, updateTimeLine])

  const handleSeek = useCallback(
    (e) => {
      const offset = e.nativeEvent.offsetX
      clipStore.setState({ currentFrame: getGridFrame(scale, start + offset) })
      // const frameIndex = getSelectFrame(start + offset, scale, step)
      // if (onSelectFrame) {
      //   onSelectFrame(frameIndex)
      // }
    },
    [scale, start]
  )

  return (
    <div
      ref={canvasContainerRef}
      style={{ height: TIMELINE_HEIGHT, visibility: visible ? 'visible' : 'hidden' }}
      className="text-center leading-5 text-sm"
      onClick={handleSeek}
    >
      <canvas
        ref={timelineRef}
        style={canvasStyle}
        width={canvasAttr.width}
        height={canvasAttr.height}
        onClick={handleClick}
      />
    </div>
  )
}

export default Timeline

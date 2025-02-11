import React, { useRef, useEffect } from 'react'

const CanvasRuler = ({ width = 800, height = 40, start = 0, end = 100 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // 处理高清屏显示
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // 绘制函数
    const drawRuler = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // 刻度参数
      const mainStep = 10 // 主刻度间隔
      const subStep = 2 // 次刻度间隔
      const mainHeight = 20 // 主刻度高度
      const subHeight = 10 // 次刻度高度

      // 绘制刻度
      for (let value = start; value <= end; value += subStep) {
        const isMain = value % mainStep === 0
        const x = ((value - start) / (end - start)) * width

        ctx.beginPath()
        ctx.strokeStyle = '#666'
        ctx.lineWidth = 1

        // 绘制刻度线
        ctx.moveTo(x, height)
        ctx.lineTo(x, height - (isMain ? mainHeight : subHeight))
        ctx.stroke()

        // 绘制主刻度数字
        if (isMain) {
          ctx.textAlign = 'center'
          ctx.font = '10px Arial'
          ctx.fillStyle = '#333'
          ctx.fillText(value, x, height - mainHeight - 5)
        }
      }
    }

    drawRuler()
  }, [width, height, start, end])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    />
  )
}

export default CanvasRuler

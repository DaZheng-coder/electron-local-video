// import React, { useRef, useEffect, useState } from 'react'

// interface TimelineProps {
//   duration: number // 总时长（秒）
//   currentTime: number // 当前播放时间
// }

// const Timeline: React.FC<TimelineProps> = ({ duration, currentTime }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [zoomLevel, setZoomLevel] = useState(1) // 缩放级别（1像素=1秒）
//   const [panOffset, setPanOffset] = useState(0) // 横向平移量（像素）

//   // 绘制时间轴
//   const drawTimeline = () => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext('2d')
//     if (!ctx) return

//     const width = canvas.width
//     const height = canvas.height

//     // 清空画布
//     ctx.clearRect(0, 0, width, height)

//     // 计算可见时间范围
//     const visibleStartTime = -panOffset / zoomLevel
//     const visibleEndTime = visibleStartTime + width / zoomLevel

//     // 绘制时间刻度
//     const timeStep = calculateTimeStep(visibleEndTime - visibleStartTime, width)
//     for (
//       let time = Math.floor(visibleStartTime / timeStep) * timeStep;
//       time <= visibleEndTime;
//       time += timeStep
//     ) {
//       const x = (time - visibleStartTime) * zoomLevel

//       // 主刻度线
//       ctx.strokeStyle = '#999'
//       ctx.beginPath()
//       ctx.moveTo(x, height - 20)
//       ctx.lineTo(x, height)
//       ctx.stroke()

//       // 时间标签
//       ctx.fillStyle = '#fff'
//       ctx.font = '12px Arial'
//       ctx.fillText(formatTime(time), x + 2, height - 5)
//     }

//     // 绘制当前时间指针
//     const pointerX = (currentTime - visibleStartTime) * zoomLevel
//     ctx.strokeStyle = '#ff0000'
//     ctx.beginPath()
//     ctx.moveTo(pointerX, 0)
//     ctx.lineTo(pointerX, height)
//     ctx.stroke()
//   }

//   // 自动计算合适的时间间隔
//   const calculateTimeStep = (visibleDuration: number, width: number) => {
//     const targetSteps = 10 // 理想刻度数量
//     const roughStep = visibleDuration / targetSteps

//     // 寻找最接近的10的幂次方倍数
//     const power = Math.pow(10, Math.floor(Math.log10(roughStep)))
//     let step = power
//     if (roughStep / power > 5) step = power * 10
//     else if (roughStep / power > 2) step = power * 5

//     return step
//   }

//   // 时间格式化（hh:mm:ss）
//   const formatTime = (seconds: number) => {
//     const h = Math.floor(seconds / 3600)
//     const m = Math.floor((seconds % 3600) / 60)
//     const s = Math.floor(seconds % 60)
//     return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
//   }

//   useEffect(() => {
//     // 处理窗口大小变化
//     const resizeHandler = () => {
//       if (!canvasRef.current) return
//       canvasRef.current.width = canvasRef.current.offsetWidth
//       canvasRef.current.height = 80 // 固定高度
//       drawTimeline()
//     }

//     // 初始化画布
//     resizeHandler()
//     window.addEventListener('resize', resizeHandler)

//     return () => window.removeEventListener('resize', resizeHandler)
//   }, [])

//   useEffect(() => {
//     // 交互事件处理
//     const canvas = canvasRef.current
//     if (!canvas) return

//     let isDragging = false
//     let lastX = 0

//     // 鼠标滚轮缩放
//     const wheelHandler = (e: WheelEvent) => {
//       e.preventDefault()
//       const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
//       const mouseX = e.offsetX
//       const oldTime = (mouseX - panOffset) / zoomLevel

//       setZoomLevel((prev) => Math.min(Math.max(prev * zoomFactor, 0.1), 10))
//       setPanOffset((prev) => mouseX - oldTime * zoomLevel * zoomFactor)
//     }

//     // 鼠标拖拽平移
//     const mouseDownHandler = (e: MouseEvent) => {
//       isDragging = true
//       lastX = e.clientX
//     }

//     const mouseMoveHandler = (e: MouseEvent) => {
//       if (!isDragging) return
//       const deltaX = e.clientX - lastX
//       lastX = e.clientX
//       setPanOffset((prev) => prev + deltaX)
//     }

//     const mouseUpHandler = () => {
//       isDragging = false
//     }

//     canvas.addEventListener('wheel', wheelHandler)
//     canvas.addEventListener('mousedown', mouseDownHandler)
//     window.addEventListener('mousemove', mouseMoveHandler)
//     window.addEventListener('mouseup', mouseUpHandler)

//     return () => {
//       canvas.removeEventListener('wheel', wheelHandler)
//       canvas.removeEventListener('mousedown', mouseDownHandler)
//       window.removeEventListener('mousemove', mouseMoveHandler)
//       window.removeEventListener('mouseup', mouseUpHandler)
//     }
//   }, [zoomLevel])

//   useEffect(() => {
//     drawTimeline()
//   }, [zoomLevel, panOffset, currentTime, duration])

//   return (
//     <div className="timeline-container">
//       <canvas
//         ref={canvasRef}
//         style={{
//           width: '100%',
//           height: 80,
//           backgroundColor: '#333',
//           cursor: 'grab'
//         }}
//       />
//     </div>
//   )
// }

// export default Timeline

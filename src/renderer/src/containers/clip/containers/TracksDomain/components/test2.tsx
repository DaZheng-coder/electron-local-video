// import { FC, useCallback, useEffect, useRef, useState } from 'react'
// import CanvasRuler from './test'

// interface ITimelineProps {}
// /**
//  *
//  * @returns
//  */

// const Timeline: FC<ITimelineProps> = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const canvasRef = useRef<HTMLCanvasElement | null>(null)
//   const timelineStyleRef = useRef<{
//     width: number
//     height: number
//     bgColor: string
//     shortColor: string
//     longColor: string
//   }>({
//     width: 0, // 时间轴宽度
//     height: 30, // 时间轴高度
//     bgColor: '#E5E7EB', // 背景颜色
//     shortColor: '#6B7280', // 短线段颜色
//     longColor: '#374151' // 长线段颜色
//   })

//   const timelineConfigRef = useRef<{ totalDuration: number; frames: number }>({
//     totalDuration: 5, // 总时长，单位秒
//     frames: 30 // 每秒帧数
//   })

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas?.getContext('2d')
//     if (!ctx) return

//     // 处理高清屏显示
//     const dpr = window.devicePixelRatio || 1
//     const containerRect = containerRef.current?.getBoundingClientRect()
//     const rectW = containerRect?.width || 0
//     const rectH = containerRect?.height || 0
//     const width = rectW * dpr
//     const height = rectH * dpr
//     canvas.width = width
//     canvas.height = height
//     ctx.scale(dpr, dpr)

//     // 绘制函数
//     const draw = () => {
//       const style = timelineStyleRef.current
//       const config = timelineConfigRef.current
//       // 绘制背景
//       ctx.clearRect(0, 0, width, height)
//       ctx.fillStyle = style.bgColor
//       ctx.fillRect(0, 0, width, height)

//       const totalFrames = config.totalDuration * config.frames // 总帧数
//       const frameWidth = width / totalFrames // 计算帧宽度

//       console.log('*** frameWidth', frameWidth)

//       // 刻度参数
//       const mainStep = frameWidth * 10 // 主刻度间隔
//       const subStep = frameWidth // 次刻度间隔
//       const mainHeight = 20 // 主刻度高度
//       const subHeight = 10 // 次刻度高度

//       // 绘制主刻度
//       for (let value = 0; value <= width; value += mainStep) {
//         ctx.beginPath()
//         ctx.strokeStyle = style.longColor
//         ctx.lineWidth = 1

//         ctx.moveTo(value, 0)
//         ctx.lineTo(value, mainHeight)
//         ctx.stroke()
//       }

//       // 绘制次刻度
//       for (let value = 0, count = 0; value <= width; value += subStep, count++) {
//         if (count % 10 === 0) continue // 跳过主刻度线
//         ctx.beginPath()
//         ctx.strokeStyle = style.shortColor
//         ctx.lineWidth = 1

//         ctx.moveTo(value, 0)
//         ctx.lineTo(value, subHeight)
//         ctx.stroke()
//       }
//     }

//     draw()
//   }, [])

//   const height = timelineStyleRef.current.height

//   return (
//     <div
//       ref={containerRef}
//       style={{ height }}
//       className="sticky top-0 left-0 right-0 text-center leading-5 text-sm z-20"
//     >
//       <canvas style={{ width: '100%', height }} ref={canvasRef}></canvas>
//     </div>
//   )
// }

// export default Timeline

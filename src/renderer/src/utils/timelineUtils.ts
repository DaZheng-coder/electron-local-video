import { formatTime } from './index'
import { Decimal } from 'decimal.js'

export const getTimelineCanvasConfig = (isDark: boolean = false): CanvasConfig => {
  return {
    width: 0, // 画布宽度
    height: 0, // 画布高度
    bgColor: isDark ? '#374151' : '#E5E7EB', // 背景颜色
    ratio: window.devicePixelRatio || 1, // 设备像素比
    textSize: 12, // 字号
    textScale: 0.83, // 支持更小号字： 10 / 12
    lineWidth: 1, // 线宽
    // eslint-disable-next-line
    textBaseline: 'middle' as 'middle', // 文字对齐基线 (ts 中定义的textBaseLine是一个联合类型)
    // eslint-disable-next-line
    textAlign: 'center' as 'center', // 文字对齐方式
    longColor: isDark ? '#E5E7EB' : '#374151', // 长线段颜色
    shortColor: isDark ? '#9CA3AF' : '#6B7280', // 短线段颜色
    textColor: isDark ? '#E5E7EB' : '#374151', // 文字颜色
    subTextColor: isDark ? '#9CA3AF' : '#6B7280', // 小文字颜色
    focusColor: isDark ? '#6D28D9' : '#C4B5FD', // 选中元素区间
    lineColor: isDark ? '#374151' : '#E5E7EB' // 底线颜色
  }
}

export interface CanvasConfig {
  width: number
  height: number
  bgColor: string // 背景颜色
  ratio: number // 设备像素比
  textSize: number // 字号
  textScale: number // 支持更小号字： 10 / 12
  lineWidth: number // 线宽
  textBaseline: CanvasTextBaseline // 文字对齐基线 (ts 中定义的textBaseLine是一个联合类型)
  textAlign: CanvasTextAlign // 文字对齐方式
  longColor: string // 长线段颜色
  shortColor: string // 短线段颜色
  textColor: string // 文字颜色
  subTextColor: string // 小文字颜色
  focusColor: string // 选中元素区间
  lineColor: string // 底线颜色
}
export interface UserConfig {
  start: number // 开始坐标
  step: number // 步进，与视频fps同步
  scale: number // 时间轴缩放比例
  focusPosition: {
    // 选中元素时在时间轴中高亮显示
    start: number // 起始帧数
    end: number // 结束帧数
    frameCount: number // 总帧数
  }
}
// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number): number => {
  const ScaleNum = [
    // 切换比例：最小单位为帧
    [100, 100],
    [90, 50],
    [80, 20],
    [70, 10],
    // 切换比例：最小单位为秒
    [69, 119],
    [60, 80],
    [50, 40],
    [40, 20],
    [30, 10],
    // 切换比例：最小单位为6秒 一大格为 1分钟
    [29, 55],
    [20, 40],
    [10, 25],
    [0, 10]
  ]

  // 边界处理
  if (scale >= ScaleNum[0][0]) return ScaleNum[0][1]
  if (scale <= ScaleNum[ScaleNum.length - 1][0]) return ScaleNum[ScaleNum.length - 1][1]

  // 查找相邻刻度点
  let prevIndex = 0
  for (let i = 0; i < ScaleNum.length - 1; i++) {
    if (scale <= ScaleNum[i][0] && scale > ScaleNum[i + 1][0]) {
      prevIndex = i
      break
    }
  }

  // 获取相邻两个刻度点
  const [x0, y0] = ScaleNum[prevIndex]
  const [x1, y1] = ScaleNum[prevIndex + 1]

  // 线性插值计算
  const ratio = (x0 - scale) / (x0 - x1)
  return y0 + (y1 - y0) * ratio
}

// 根据时间获取帧数,目前默认是30fps
export const getFrameCountByDuration = (duration: number, fps: number = 30): number => {
  return Math.floor(duration * fps)
}
// 获取当前scale下的单元格像素
export const getGridPixel = (scale: number, frameCount: number) => {
  const gridPixel = getGridSize(scale)
  let trackWidth = new Decimal(gridPixel).times(frameCount)
  if (scale < 70) {
    // 1秒一格
    trackWidth = trackWidth.dividedBy(30)
  }
  if (scale < 30) {
    // 6秒一格
    trackWidth = trackWidth.dividedBy(6)
  }
  return trackWidth.toNumber()
}
// 获取当前scale下的单元格帧数
export const getGridFrame = (scale: number, width: number) => {
  const gridPixel = new Decimal(getGridSize(scale))
  let factor = new Decimal(1)

  // 逆向还原除法操作
  if (scale < 70) {
    factor = factor.times(30)
  }
  if (scale < 30) {
    factor = factor.times(6)
  }

  return new Decimal(width).times(factor).dividedBy(gridPixel).toNumber()
}
// 根据缩放比调整 step
const getStep = (scale: number, frameStep: number): number => {
  return scale > 60 ? frameStep : 10
}
// 转换时间格式
export const getLongText = (count: number, scale: number) => {
  let time = count // 一个大单元格为 1 秒
  if (scale < 30) {
    // 一个单元格为 1 分钟
    time *= 60
  } else if (scale < 70) {
    // 一个大单元格为 10 秒
    time *= 10
  }
  return formatTime(time * 1000).str
}
const getShortText = (count: number, step: number, scale: number) => {
  const index = count % step
  let text = ''
  if (scale < 70) {
    // 一个单元格为 1 秒钟
    return ''
  } else {
    // 一个单元格为 1 帧
    text = scale > 80 ? (index === 0 ? '' : `${index < 10 ? '0' : ''}${index}f`) : ''
  }
  return text
}
const lineWidth = 0.5 // 线条宽度

// 获取选中点的帧坐标
export const getSelectFrame = (offsetX: number, scale: number, frameStep: number) => {
  const size = getGridSize(scale)
  if (scale < 70) {
    // 一个单元格为 1 秒
    offsetX *= frameStep
  }
  if (scale < 30) {
    // 一个单元格为 6 秒
    offsetX *= 6
  }
  return Math.floor(offsetX / size) + (scale < 70 ? 0 : 1)
}
/**
 * 时间轴画线
 * */
export const drawTimeLine = (
  context: CanvasRenderingContext2D,
  userConfigs: UserConfig,
  canvasConfigs: CanvasConfig
) => {
  const { start, scale, step: frameStep, focusPosition } = userConfigs
  const {
    ratio,
    bgColor,
    width,
    height,
    textColor,
    subTextColor,
    textSize,
    textScale,
    focusColor,
    longColor,
    shortColor
  } = canvasConfigs
  const step = getStep(scale, frameStep)

  // 初始化画布
  context.scale(ratio, ratio)
  context.clearRect(0, 0, width, height)

  // 1. 时间轴底色
  context.fillStyle = bgColor
  context.fillRect(0, 0, width, height)

  // 2. 计算网格
  const gridSizeS = getGridSize(scale) // 匹配当前缩放下每小格的宽度
  const gridSizeB = gridSizeS * step // 根据步进计算每大格的宽度

  const startValueS = Math.floor(start / gridSizeS) * gridSizeS // 小格绘制起点的刻度(start 向下取 gridSizeS 的整数倍)
  const startValueB = Math.floor(start / gridSizeB) * gridSizeB // 大格绘制起点的刻度(start 向下取 gridSizeB 的整数倍)

  const offsetXS = startValueS - start // 小格起点刻度距离原点(start)的px距离
  const offsetXB = startValueB - start // 大格起点刻度距离原点(start)的px距离
  const endValue = start + Math.ceil(width) // 终点刻度(略超出标尺宽度即可)

  // 3. 时间轴聚焦元素
  if (focusPosition) {
    let fStart = focusPosition.start
    let fCount = focusPosition.end - focusPosition.start
    if (scale < 70) {
      // 一个单元格为 1 秒
      fStart = fStart / 30
      fCount = fCount / 30
    }
    if (scale < 30) {
      // 一个单元格为 6 秒
      fStart = fStart / 6
      fCount = fCount / 6
    }
    const focusS = fStart * gridSizeS + lineWidth - start // 选中起点坐标
    const focusW = fCount * gridSizeS - lineWidth // 选中宽度
    if (focusW > gridSizeS) {
      // 小于一个小格的元素就不提示了
      context.fillStyle = focusColor
      context.fillRect(focusS, 0, focusW, (height * 3) / 8)
    }
  }

  // 4. 初始化刻度和文字画笔
  context.beginPath() // 一定要记得开关路径
  context.fillStyle = textColor
  context.strokeStyle = longColor

  /**
   * 5. 长间隔和文字
   * 长间隔和短间隔需分开两次绘制，才可以完成不同颜色的设置；
   * 分开放到两个for循环是为了节省性能，因为如果放到一个for循环的话，每次循环都会重新绘制操作dom
   *
   * */
  for (let value = startValueB, count = 0; value < endValue; value += gridSizeB, count++) {
    const x = offsetXB + count * gridSizeB + lineWidth // prevent canvas 1px line blurry
    context.moveTo(x, 0)
    context.save()
    context.translate(x, height * 0.4)
    context.scale(textScale / ratio, textScale / ratio)
    const text = getLongText(value / gridSizeB, scale)
    const textPositionX = text.length * 5 * textScale * ratio // 文字长度的一半
    const textPositionY = ((textSize / ratio) * textScale) / ratio / 2 // 文字高度的一半
    context.fillText(text, textPositionX, textPositionY)
    context.restore()
    context.lineTo(x, (height * 10) / 16 / ratio)
  }
  context.stroke()
  context.closePath()

  // 6. 短间隔和文字 只在特殊放大倍数下显示文字
  context.beginPath()
  context.fillStyle = subTextColor
  context.strokeStyle = shortColor
  for (let value = startValueS, count = 0; value < endValue; value += gridSizeS, count++) {
    const x = offsetXS + count * gridSizeS + lineWidth // prevent canvas 1px line blurry
    context.moveTo(x, 0)
    const text = getShortText(value / gridSizeS, step, scale)
    if (text) {
      context.save()
      context.translate(x, height * 0.4)
      context.scale(textScale / ratio, textScale / ratio)
      const textPositionX = text.length * 5 * textScale * ratio // 文字长度的一半
      const textPositionY = ((textSize / ratio) * textScale) / ratio / 2 // 文字高度的一半
      context.fillText(text, textPositionX, textPositionY)
      context.restore()
    }
    if (value % gridSizeB !== 0) {
      context.lineTo(x, height / 3 / ratio)
    }
  }
  context.stroke()
  context.closePath()

  // 恢复ctx matrix
  context.setTransform(1, 0, 0, 1, 0, 0)
}

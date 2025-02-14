/**
 * rgb转换成16进制字符串
 * @param rgb
 * @returns
 */
export const rgbToHex = (rgb: string): string => {
  if (!rgb || rgb.length === 0) {
    return ''
  }
  if (rgb.indexOf('#') === 0) {
    return rgb
  }
  const rgbArr = rgb.replace(/[^\d,]/g, '').split(',')
  const r = parseInt(rgbArr[0])
  const g = parseInt(rgbArr[1])
  const b = parseInt(rgbArr[2])
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}

/**
 *  时间格式化
 * */
export function formatTime(time: number) {
  let second = Math.ceil(time / 1000)
  const s = second % 60
  second = Math.floor(second / 60)
  const m = second % 60
  second = Math.floor(second / 60)
  const h = second % 60
  return {
    s,
    m,
    h,
    str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}:`}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }
}

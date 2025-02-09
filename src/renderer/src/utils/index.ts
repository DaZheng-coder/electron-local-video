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

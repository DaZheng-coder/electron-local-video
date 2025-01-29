import { FC, useCallback, useEffect, useState } from 'react'

// *** todo 优化：图片缓存

const LocalImage: FC<{
  className?: string
  src: string
  alt?: string
}> = ({ className = '', src, alt = '' }) => {
  const [imgSrc, setImgSrc] = useState<string | null>('')

  const getBase64LocalImage = useCallback(async (imagePath: string) => {
    if (!imagePath) return
    const localImagePath = await window.api.fileApis.loadLocalImage(imagePath)
    setImgSrc(localImagePath)
  }, [])

  useEffect(() => {
    getBase64LocalImage(src)
  }, [src, getBase64LocalImage])

  return <img className={className} alt={alt} src={imgSrc || ''} />
}

export default LocalImage

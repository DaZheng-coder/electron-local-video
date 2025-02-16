import { DragEvent } from 'react'

export interface IUseDropperProps {
  onDrop: (e: DragEvent) => void
}

const useNativeDrop = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  props: IUseDropperProps
) => {
  const setOverStyle = () => {
    if (ref.current) {
      ref.current.style.backgroundColor = '#f0f0f0 rounded-xl'
    }
  }
  const removeOverStyle = () => {
    if (ref.current) {
      ref.current.style.backgroundColor = ''
    }
  }

  const onDragOver = (e: DragEvent) => {
    setOverStyle()
  }

  const onDragLeave = (e: DragEvent) => {}

  const onDrop = (e: DragEvent) => {
    removeOverStyle()
    props.onDrop(e)
  }

  return {
    onDragOver,
    onDragLeave,
    onDrop
  }
}
export default useNativeDrop

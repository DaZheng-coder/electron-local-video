import { DragEvent } from 'react'

export interface IUseDropperProps {
  onDrop: (e: DragEvent) => void
}

const useDropper = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  props: IUseDropperProps
) => {
  const setOverStyle = () => {
    if (ref.current) {
      ref.current.style.backgroundColor = '#f0f0f0'
    }
  }
  const removeOverStyle = () => {
    if (ref.current) {
      ref.current.style.backgroundColor = ''
    }
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOverStyle()
  }

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeOverStyle()
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeOverStyle()
    props.onDrop(e)
  }

  return {
    onDragOver,
    onDragLeave,
    onDrop
  }
}
export default useDropper

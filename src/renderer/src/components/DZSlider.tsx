import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons'
import { Button, Slider, SliderSingleProps } from 'antd'
import { FC, useCallback } from 'react'

interface IDZSliderProps extends SliderSingleProps {
  value: number
  step: number
  onChange: (value: number) => void
}

/**
 * 两侧带增删的滑动条
 * @param props
 * @returns
 */
const DZSlider: FC<IDZSliderProps> = (props) => {
  const onAdd = useCallback(() => {
    props.onChange(props.value + props.step)
  }, [props])
  const onSub = useCallback(() => {
    props.onChange(props.value - props.step)
  }, [props])
  return (
    <div className="flex gap-1 items-center">
      <Button
        type="text"
        icon={<MinusCircleTwoTone disabled={props.value === props.min} />}
        onClick={onSub}
        // disabled={props.value === props.min}
      />
      <Slider {...props} />
      <Button
        type="text"
        icon={<PlusCircleTwoTone disabled={props.value === props.max} />}
        onClick={onAdd}
        // disabled={props.value === props.max}
      />
    </div>
  )
}

export default DZSlider

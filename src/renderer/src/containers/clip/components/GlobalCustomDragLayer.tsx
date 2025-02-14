import BaseCustomDragLayer from '@renderer/src/components/BaseCustomDragLayer'
import { EDragType } from '@renderer/src/utils/trackUtils'
import { memo, useCallback } from 'react'
import MediaCardItemUI from '../containers/ResourcePool/components/MediaCardItemUI'
import { IDragMediaItem } from '@renderer/src/types'

const GlobalCustomDragLayer = () => {
  const renderDragLayer = useCallback(({ itemType, item }) => {
    switch (itemType) {
      case EDragType.MEDIA_CARD:
        return <MediaCardItemUI title={item.title} thumbnail={item.thumbnail} />
      default:
        return null
    }
  }, [])

  const getDraggedElementStyle = useCallback(({ itemType, item, computedStyle }) => {
    switch (itemType) {
      case EDragType.MEDIA_CARD:
        return {
          width: computedStyle.width,
          fontSize: computedStyle.fontSize,
          opacity: 1,
          color: computedStyle.color
        }
      default:
        return null
    }
  }, [])

  return (
    <BaseCustomDragLayer<IDragMediaItem>
      renderDragLayer={renderDragLayer}
      getDraggedElementStyle={getDraggedElementStyle}
    />
  )
}

export default memo(GlobalCustomDragLayer)

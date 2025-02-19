import { useEffect } from 'react'
import ClipLayout from './containers/ClipLayout'
import RenderStoresCenter from '@renderer/src/stores/renderStoresCenter'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import clipStore from '@renderer/src/stores/clipStore'
import { ConfigProvider } from 'antd'

function App(): JSX.Element {
  useEffect(() => {
    RenderStoresCenter.getInstance()
    clipStore.getState().init()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <ConfigProvider
        theme={{
          components: {
            Splitter: {
              splitTriggerSize: 4
            }
          }
        }}
      >
        <ClipLayout />
      </ConfigProvider>
    </DndProvider>
  )
}

export default App

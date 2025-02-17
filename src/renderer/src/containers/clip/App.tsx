import { useEffect } from 'react'
import ClipLayout from './containers/ClipLayout'
import RenderStoresCenter from '@renderer/src/stores/renderStoresCenter'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import clipStore from '@renderer/src/stores/clipStore'

function App(): JSX.Element {
  useEffect(() => {
    RenderStoresCenter.getInstance()
    clipStore.getState().init()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <ClipLayout />
    </DndProvider>
  )
}

export default App

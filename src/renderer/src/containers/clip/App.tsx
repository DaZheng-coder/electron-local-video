import { useEffect } from 'react'
import ClipLayout from './containers/ClipLayout'
import RenderStoresCenter from '@renderer/src/stores/renderStoresCenter'

function App(): JSX.Element {
  useEffect(() => {
    RenderStoresCenter.getInstance()
  }, [])

  return <ClipLayout />
}

export default App

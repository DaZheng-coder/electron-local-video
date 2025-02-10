import ResourceStore from '../electronStores/ResourceStore'
import WindowCenter from '../windowCenter'

function setup() {
  if (!global.windowCenter) {
    global.windowCenter = new WindowCenter()
  }
  if (!global.electronStore) {
    global.electronStore = {
      resourceStore: new ResourceStore()
    }
  }
  global.windowCenter.windows.clip.open()
  global.env = {
    mode: import.meta.env.MODE // development, production
  }
  console.log('mode:', global.env.mode)
}

export default setup

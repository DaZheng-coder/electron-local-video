import ResourceStore from '../electronStores/ResourceStore'
import { registerResourceProtocol } from '../protocol/resourcesAccess'
import WindowCenter from '../windowCenter'

function setup() {
  // 1. 初始化窗口管理中心
  if (!global.windowCenter) {
    global.windowCenter = new WindowCenter()
  }

  // 2. 初始化本地存储
  if (!global.electronStore) {
    global.electronStore = {
      resourceStore: new ResourceStore()
    }
  }

  // 3. 默认打开剪辑窗口
  global.windowCenter.windows.clip.open()

  // 4. 设置环境变量
  global.env = {
    mode: import.meta.env.MODE // development, production
  }
  console.log('mode:', global.env.mode)

  // 5.注册资源访问协议
  registerResourceProtocol()
}

export default setup

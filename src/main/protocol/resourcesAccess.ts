import { protocol } from 'electron'
const fs = require('node:fs').promises

// 注册本地文件通行证
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-resource',
    privileges: {
      secure: true, // 让谷歌核心像信任https一样信任 local-resource 协议
      supportFetchAPI: true, // 允许渲染进程请求本地资源
      standard: true, // 让这种方式的网址看起来像普通的网址
      bypassCSP: true, // 允许绕过一些安全限制
      stream: true // 允许以流的形式读取文件，这对于大文件很有用
    }
  }
])

// 辅助函数，用于处理不同操作系统的文件路径问题
function convertPath(originalPath) {
  const match = originalPath.match(/^\/([a-zA-Z])\/(.*)$/)
  if (match) {
    // 为 Windows 系统转换路径格式
    return `${match[1]}:/${match[2]}`
  } else {
    return originalPath // 其他系统直接使用原始路径
  }
}

export const registerResourceProtocol = () => {
  // 响应自定义协议请求
  protocol.handle('local-resource', async (request) => {
    const decodedUrl = decodeURIComponent(
      request.url.replace(new RegExp(`^local-resource:/`, 'i'), '')
    )

    const fullPath = process.platform === 'win32' ? convertPath(decodedUrl) : decodedUrl

    const data = await fs.readFile(fullPath) // 异步读取文件内容
    return new Response(data) // 将文件内容作为响应返回
  })
}

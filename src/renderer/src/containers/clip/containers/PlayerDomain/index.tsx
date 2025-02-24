import { getResourcePath } from '@renderer/src/utils/common'
import { useEffect, useRef, useState } from 'react'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import ResourcePlayer from './ResourcePlayer'
// import ResourcePlayer from './ResourcePlayer'

const test1 = getResourcePath('/Users/zhengjunqin/Downloads/飞书20250128-160020.mp4')
const test2 = getResourcePath('/Users/zhengjunqin/Downloads/7691d7440d16836d310d5bd78a3d3583.mp4')

const PlayerDomain: React.FC = () => {
  return (
    <div className="rounded-xl flex flex-col bg-[#303030] w-full h-full text-white">
      <div className="p-2 border-b-[#141414] border-b-1">播放器</div>
      <div className="p-2 flex-1 overflow-hidden relative">
        {/* <ResourcePlayer wrapCls="absolute left-0 top-0" /> */}
      </div>
      <div>播放</div>
    </div>
  )
}

export default PlayerDomain

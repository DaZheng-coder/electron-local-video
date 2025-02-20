const PlayerDomain: React.FC<IDualPlayer> = () => {
  return (
    <div className="rounded-xl flex flex-col bg-[#303030] w-full h-full text-white">
      <div className="p-2 border-b-[#141414] border-b-1">播放器</div>
      <div className="p-2 flex-1 overflow-hidden"></div>
    </div>
  )
}

export default PlayerDomain

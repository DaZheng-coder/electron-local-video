import ResourcePlayer from './components/ResourcePlayer'

interface IPlayerDomain {}

const PlayerDomain: React.FC<IPlayerDomain> = () => {
  return (
    <div className="rounded-xl bg-[#303030] w-full h-full text-white">
      <ResourcePlayer />
    </div>
  )
}

export default PlayerDomain

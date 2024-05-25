import { WaveLoading } from "../WaveLoading";

export function PlayerSkeleton() {
  return (<div className="w-full animate-pulse h-100">
    <WaveLoading childClass="bg-black w-1" />
  </div>
  )
}
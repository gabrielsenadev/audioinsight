interface WaveLoadingProps {
  bg?: string;
}

export function WaveLoading({ bg = 'bg-white' }: WaveLoadingProps) {
  return (
    <div className="flex gap-1">
      <div className={`w-2 h-10 rounded-sm animate-wave-quiet ${bg}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-normal ${bg}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-loud ${bg}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-quiet ${bg}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-loud ${bg}`}></div>
    </div>
  )
}
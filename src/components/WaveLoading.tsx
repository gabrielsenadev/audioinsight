import React, { HTMLAttributes } from "react";
interface WaveLoadingProps extends HTMLAttributes<HTMLDivElement> {
  bg?: string;
  childClass?: string;
}

export function WaveLoading({ childClass = 'bg-white', className, ...props }: WaveLoadingProps) {
  return (
    <div className={`flex gap-1 ${className ?? ''}`} {...props}>
      <div className={`w-2 h-10 rounded-sm animate-wave-quiet ${childClass}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-normal ${childClass}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-loud ${childClass}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-quiet ${childClass}`}></div>
      <div className={`w-2 h-10 rounded-sm animate-wave-loud ${childClass}`}></div>
    </div>
  )
}
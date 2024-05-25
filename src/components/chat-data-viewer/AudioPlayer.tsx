"use client";

import { IconChevronLeft, IconPlayerPause, IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-react";
import WavesurferPlayer from "@wavesurfer/react";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayerSkeleton } from "./PlayerSkeleton";

interface AudioPlayerProps extends HTMLAttributes<HTMLElement> {
  audioURL: string;
}

export function AudioPlayer({ className, audioURL, ...props }: AudioPlayerProps) {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onReady = (ws: WaveSurfer) => {
    setWaveSurfer(ws);
    setIsPlaying(false);
    setIsLoading(false);
  }

  const onPlayPause = () => {
    waveSurfer?.playPause();
  };

  return (
    <section className={`w-full max-w-[90%] my-6 flex gap-4 items-center ${className}`} {...props}>
      <button onClick={onPlayPause} className={`hover:bg-primary text-white rounded-full p-2 transition-colors ${isPlaying ? 'bg-primary' : 'bg-black/80'}`}>
        {isPlaying ? <IconPlayerPauseFilled size={60} /> :
          <IconPlayerPlayFilled size={60}/>
        }
      </button>
      <div className="w-full relative flex items-center min-h-[100px]">
        {isLoading && <PlayerSkeleton />}
        <div className="absolute w-full">
          <WavesurferPlayer
            height={100}
            width="100%"
            waveColor="#172554"
            cursorColor="#0466c8"
            progressColor="#0466c8"
            url={audioURL}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            barWidth={2}
          />
        </div>
      </div>
    </section>
  )
}
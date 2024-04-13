"use client"

import { UserMessage } from "@/components/UserMessage";
import WavesurferPlayer from "@wavesurfer/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdArrowBackIos, MdOutlinePauseCircleFilled, MdOutlinePlayCircleFilled, MdSend } from "react-icons/md";
import WaveSurfer from 'wavesurfer.js'

export default function Home() {
  const router = useRouter();
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onClickBack = () => {
    router.push('/');
  };

  const onReady = (ws: WaveSurfer) => {
    setWaveSurfer(ws);
    setIsPlaying(false);
  }


  const onPlayPause = () => {
    waveSurfer?.playPause()
  }

  return (
    <main className="bg-[#111111] h-full justify-center flex p-2 flex-col items-center">
      <section className="w-[90%] h-[90%] bg-slate-100 rounded-3xl p-10 flex justify-between flex-col transition-all items-center">
        <header className="self-start">
          <button className="flex items-center hover:underline transition-all hover:text-sky-700" onClick={onClickBack}><MdArrowBackIos /> Go back</button>
          <h1 className="text-4xl font-bold mb-2">Chat title</h1>
        </header>
        <section className="w-full max-w-[90%] mb-6 flex gap-4">
          <button onClick={onPlayPause}>
            {isPlaying ? <MdOutlinePauseCircleFilled fontSize={80} className={'text-sky-800'} /> :
              <MdOutlinePlayCircleFilled fontSize={80} className={`hover:text-sky-700 text-black transition-colors`} />
            }
          </button>
          <div className="w-full">
            <WavesurferPlayer
              height={100}
              width="100%"
              waveColor="#172554"
              cursorColor="#075985"
              progressColor="#075985"
              url="/curios.mp3"
              onReady={onReady}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              barWidth={2}
            />
          </div>
        </section>
        <section className="h-full w-[750px] max-w-full gap-2 flex flex-col">
          <UserMessage isAssistant messages={["mensagem 1", "mensagem 2"]} />
          <UserMessage isAssistant={false} messages={["mensagem 1", "mensagem 2"]} />
        </section>
        <section className="flex flex-col items-center max-w-full">
          <form className="w-[750px] max-w-full flex gap-1">
            <input
              type="text"
              className="w-full rounded-md p-2 bg-black text-white placeholder:text-white/95 hover:bg-black/90 transition-colors"
              placeholder="Ask questions here"
            />
            <button
              type="submit"
              className="p-2 bg-black text-white rounded-md px-4 hover:bg-black/80 transition-colors"
            >
              <MdSend />
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

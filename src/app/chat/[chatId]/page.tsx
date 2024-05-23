"use client"

import { UserMessage } from "@/components/UserMessage";
import { WaveLoading } from "@/components/WaveLoading";
import { readStream } from "@/utils/readStream";
import WavesurferPlayer from "@wavesurfer/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIos, MdOutlinePauseCircleFilled, MdOutlinePlayCircleFilled, MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

export const runtime = 'edge';

type ChatMessage = {
  content: string;
  role: string;
  timeStamp: number;
};

type ChatData = {
  content: string;
  title: string;
  vtt: string;
  messages: ChatMessage[];
}

type LoadingType = 'full' | 'soft' | 'none';

export default function Home() {
  const router = useRouter();
  const { chatId } = useParams<{ chatId: string }>();
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingType, setLoadingType] = useState<LoadingType>('none');
  const [data, setData] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [audioURL, setAudioURL] = useState<string>('');
  const [showTranscription, setShowTranscription] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [streamMessage, setStreamMessage] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const isFullLoading = loadingType === 'full';
  const isSoftLoading = loadingType === 'soft';
  const isLoading = loadingType !== 'none';

  const showMainContent = !isFullLoading && !!data;

  useEffect(() => {
    const fetchData = () => {
      setLoadingType('full');
      setError('');
      fetch(`/api/chats/${chatId}`)
        .then(async (response) => {
          if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`Request Error: ${responseText}`);
          }
          const data = (await response.json()) as ChatData;
          setData(data);
          setMessages(data.messages);
          setAudioURL(`/api/chats/${chatId}/audio`);
        })
        .catch((error: Error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoadingType('none');
        });
    };

    fetchData();
  }, [chatId]);


  const onClickBack = () => {
    router.push('/');
  };

  const onReady = (ws: WaveSurfer) => {
    setWaveSurfer(ws);
    setIsPlaying(false);
  }

  const onPlayPause = () => {
    waveSurfer?.playPause();
  };

  const onSubmit = (formData: FormData) => {
    const userMessage = formData.get('message') as string;
    if (!userMessage) {
      return;
    }
    setLoadingType('soft');
    setError('');
    const userMessageData = {
      content: userMessage,
      role: 'user',
    } as ChatMessage;

    setMessages([...messages, userMessageData]);

    fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: formData.get('message'),
      }),
    })
      .then(async (response) => {
        if (!response.ok || !response.body) {
          const responseText = await response.text();
          throw new Error(`Request Error: ${responseText}`);
        }

        let lastStreamMessage = streamMessage;

        readStream(response.body, (value) => {
          lastStreamMessage = `${lastStreamMessage}${value}`;
          setStreamMessage(lastStreamMessage);
        }, (value) => {
          setMessages([...messages, userMessageData, {
            content: value,
            role: 'assistant',
            timeStamp: Date.now(), 
          }]);
          setStreamMessage('');
          formRef.current?.reset();
      });
        
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoadingType('none');
      });
  };

  const onClickShowTranscription = () => {
    setShowTranscription(!showTranscription);
  };

  return (
    <main className="bg-[#111111] h-full justify-center flex p-2 flex-col items-center animate-wave-width2">
    
      {error && (<section className="w-[90%] px-8 py-4 rounded-xl mb-4 bg-slate-100 text-red-600">
        <p>Error: {error}</p>
      </section>)}
      {showMainContent && <section className="w-[90%] max-w-full h-[90%] bg-slate-100 rounded-3xl p-10 flex justify-between flex-col transition-all items-center">
        <header className="self-start max-w-full">
          <button className="flex items-center hover:underline transition-all hover:text-sky-700" onClick={onClickBack}><MdArrowBackIos /> Go back</button>
          <h1 className="text-[1.75rem] font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{data.title}</h1>
        </header>
        {audioURL && <section className="w-full max-w-[90%] my-6 flex gap-4">
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
              url={audioURL}
              onReady={onReady}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              barWidth={2}
            />
          </div>
        </section>}
        <section className={`${showTranscription ? 'min-h-36' : 'min-h-10'} max-h-36 w-[750px] max-w-full gap-2 flex flex-col overflow-auto`}>
          <button
            onClick={onClickShowTranscription}
            className="text-white p-2 bg-black rounded-lg hover:bg-black/90 transition-colors"
            >
              {showTranscription ? 'Hide content transcription' : 'View content transcription'}
          </button>
          {showTranscription && <div className="max-h-32 overflow-auto">
            <h4 className="text-black font-bold text-lg">Content Transcription</h4>
            <p className="text-black/95">{data.content}</p>
            </div>}
        </section>
        <section className="h-full w-[750px] max-w-full gap-2 flex flex-col overflow-auto mb-8 mt-2">
          {messages.map((message, index) => <UserMessage key={index} isAssistant={message.role === 'assistant'} messages={message.content.split('\n')} />)}
          { streamMessage && <UserMessage isAssistant messages={streamMessage.split('\n')} />}
        </section>
        <section className="flex flex-col items-center max-w-full">
          <form className="w-[750px] max-w-full flex gap-1 mb-4" action={onSubmit} ref={formRef}>
            <input
              type="text"
              className="w-full rounded-md p-2 bg-black text-white placeholder:text-white/95 hover:bg-black/90 transition-colors"
              placeholder="Ask questions here"
              name="message"
            />
            <button
              type="submit"
              className="p-2 bg-black text-white rounded-md px-4 hover:bg-black/80 transition-colors"
              disabled={isSoftLoading}
            >
              <MdSend />
            </button>
          </form>
          {isSoftLoading && <WaveLoading bg="bg-black" />}
        </section>
      </section>}
      {isFullLoading && <WaveLoading />}
      {!showMainContent && !isLoading && <p className="text-white">Chat not found.</p>}
    </main>
  )
}

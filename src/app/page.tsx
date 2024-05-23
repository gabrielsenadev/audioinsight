"use client";

import { WaveLoading } from "@/components/WaveLoading";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    const audio = formData.get('audio');

    fetch('/api/chats/create', {
      method: 'POST',
      body: audio,
    })
    .then(async (response) => {
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Request Error: ${responseText}`);
      }
      const text = await response.text();
      router.push(`/chat/${text}`);
    })
    .catch(error => {
      setError(error.message);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <main className="bg-[#111111] h-full justify-center flex p-2 flex-col items-center">
      <section className="text-white flex flex-col items-center text-center justify-center gap-5">
        <header>
          <h1 className="text-6xl font-bold mb-2">Start with a audio.</h1>
          <p className="text-white/95">Upload a file and use the power of AI to transcribe, summarize, and ask questions about related audio.</p>
        </header>
        <form className="flex gap-3 w-full" action={onSubmit}>
          <input
            type="file"
            accept="audio/*"
            className="bg-white py-2 px-6 rounded-md text-black w-full hover:bg-gray-100"
            required
            name="audio"
          />
          <button type="submit" className="bg-sky-400 py-2 px-6 rounded-md text-black hover:bg-sky-400/95">Upload</button>
        </form>
        {isLoading && <WaveLoading />}
      {error && (<section className="px-4 py-2 rounded-xl mt-2 bg-slate-100 text-red-600 w-full">
        <p>Error: {error}</p>
      </section>)}
      </section>
    </main>
  )
}

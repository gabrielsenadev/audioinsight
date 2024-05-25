"use client";

import { WaveLoading } from "@/components/WaveLoading";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useError } from "./context/ErrorContext";

export default function Home() {
  const router = useRouter();
  const { setError } = useError();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setError("");
    setIsLoading(true);

    const audio = formData.get("audio");

    fetch("/api/chats/create", {
      method: "POST",
      body: audio,
    })
      .then(async (response) => {
        const chatId = await response.text();
        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="flex flex-col items-center justify-center p-2 h-full">
      <section className="text-white flex flex-col items-center text-center justify-center gap-5">
        <header>
          <h1 className="text-6xl font-bold mb-2">Start with a audio.</h1>
          <p className="text-white/95">
            Upload a file and use the power of AI to transcribe, summarize, and
            ask questions about related audio.
          </p>
        </header>
        <form className="flex gap-3 w-full" action={onSubmit}>
          <input
            type="file"
            accept="audio/*"
            className="bg-white py-2 px-6 rounded-md text-black w-full hover:bg-gray-100 disabled:cursor-not-allowed"
            required
            name="audio"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/95 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Upload
          </button>
        </form>
        <div className="min-h-10">{isLoading && <WaveLoading />}</div>
      </section>
    </main>
  );
}

"use client"

import { useError } from "@/app/context/ErrorContext";
import { ChatData } from "@/app/type/chat";
import { ChatDataViewer } from "@/components/chat-data-viewer/ChatDataViewer";
import { WaveLoading } from "@/components/WaveLoading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const runtime = 'edge';

export default function Home() {
  const { chatId } = useParams<{ chatId: string }>();
  const { clearError, setError } = useError();
  const [isRouteLoading, setIsRouteLoading] = useState(true);
  const [data, setData] = useState<ChatData | null>(null);

  function fetchData() {

    clearError();

    fetch(`/api/chats/${chatId}`)
      .then(async (response) => {
        const data = (await response.json()) as ChatData;
        setData({
          ...data,
          audioURL: `/api/chats/${chatId}/audio`,
        });
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsRouteLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const isInvalidChat = !isRouteLoading && !data;
  const showChat = !isRouteLoading && !isInvalidChat;

  return (
    <main className="flex justify-center items-center h-full p-2">
      {isRouteLoading && <WaveLoading className="h-full items-center justify-center" />}
      {isInvalidChat && <div className="flex items-center justify-center h-full text-white">Chat not found.</div>}
      {showChat && <ChatDataViewer data={data!} chatId={chatId} />}
    </main>
  )
}

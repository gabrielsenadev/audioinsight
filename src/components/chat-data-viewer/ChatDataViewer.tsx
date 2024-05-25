"use client";

import { ChatData } from "@/app/type/chat";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes, useState } from "react";
import { Header } from "./Header";
import { AudioPlayer } from "./AudioPlayer";
import { Chat } from "./Chat";

interface ChatDataViewerProps extends HTMLAttributes<HTMLElement> {
  data: ChatData;
  chatId: string;
}

export function ChatDataViewer({ className, chatId, data, ...props }: ChatDataViewerProps) {
  return (
    <section className={`flex gap-1 w-[90%] max-w-full h-[90%] bg-slate-100 rounded-3xl p-10 justify-between flex-col transition-all items-center ${className}`} {...props}>
      <Header title={data.title} />
      <AudioPlayer audioURL={data.audioURL}/>
      <Chat messages={data.messages} chatId={chatId}/>
    </section>
  )
}
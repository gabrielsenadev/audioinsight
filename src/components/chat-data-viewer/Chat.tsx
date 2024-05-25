"use client";

import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/app/type/chat";
import { UserMessage } from "../UserMessage";
import { IconSend2 } from "@tabler/icons-react";
import { WaveLoading } from "../WaveLoading";
import { useError } from "@/app/context/ErrorContext";
import { readStream } from "@/utils/readStream";

interface ChatProps extends HTMLAttributes<HTMLElement> {
  messages: ChatMessage[];
  chatId: string;
}

export function Chat({ className = '', chatId, messages, ...props }: ChatProps) {
  const { setError, clearError } = useError();
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const [localMessages, setLocalMessages] = useState(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages])

  const sendMessage = (formData: FormData) => {
    const userMessage = formData.get('message') as string;

    if (!userMessage) {
      return;
    }

    setIsLoading(true);
    clearError();

    const userMessageData = {
      content: userMessage,
      role: 'user',
    } as ChatMessage;

    setLocalMessages([...localMessages, userMessageData]);

    fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        message: formData.get('message'),
      }),
    })
      .then(async (response) => {
        if (!response.body) {
          const responseText = await response.text();
          throw new Error(`Request Error: ${responseText}`);
        }

        let lastStreamMessage = streamingMessage;

        readStream(response.body, (value) => {
          lastStreamMessage = `${lastStreamMessage}${value}`;
          setStreamingMessage(lastStreamMessage);
        }, (value) => {

          setLocalMessages([...localMessages, userMessageData, {
            content: value,
            role: 'assistant',
            timeStamp: Date.now(),
          }]);

          setStreamingMessage('');
          form.current?.reset();
        });
      })
      .catch((error: Error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <section className={`h-full w-[750px] max-w-full gap-2 flex flex-col overflow-auto mb-8 mt-2 ${className}`} {...props}>
        {localMessages.map((message, index) => <UserMessage key={index} isAssistant={message.role === 'assistant'} messages={message.content.split('\n')} />)}
        {streamingMessage && <UserMessage isAssistant messages={streamingMessage.split('\n')} />}
      </section>
      <section className="flex flex-col items-center max-w-full min-h-16">
        <form className="w-[750px] max-w-full flex gap-1 mb-4" ref={form} action={sendMessage}>
          <input
            type="text"
            className="w-full rounded-md p-2 bg-black text-white placeholder:text-white/95 hover:bg-black/90 transition-colors disabled:cursor-wait"
            placeholder="Ask questions here"
            name="message"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 bg-primary text-white rounded-md px-4 hover:bg-primary/80 transition-colors disabled:cursor-wait`}
            disabled={isLoading}
          >
            <IconSend2 />
          </button>
        </form>
        {isLoading && <WaveLoading childClass="bg-black" />}
      </section>
    </>
  )
}
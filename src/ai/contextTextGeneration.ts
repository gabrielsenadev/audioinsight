import { ChatMessageData } from "@/types";
import { Ai } from "@cloudflare/ai";

export async function contextTextGeneration(
  ai: Ai,
  content: string,
  context: string,
  chatHistory: Omit<ChatMessageData, 'chatId'>[],
  role: 'user' | 'assistant' = 'user',
) {
  const messages = [
    {
      role: 'system',
      content: 'When answering the question or responding, use the context provided.'
    },
    {
      role: 'system',
      content: `Context:${context}`
    },
    ...chatHistory,
    {
      role,
      content,
    }
  ];

  return ai.run(
    "@cf/meta/llama-2-7b-chat-fp16",
    {
      messages,
      max_tokens: 512,
    }
  );
}

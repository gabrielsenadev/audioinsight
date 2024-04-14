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
    "@hf/thebloke/neural-chat-7b-v3-1-awq",
    {
      messages,
      max_tokens: 512,
    }
  );
}

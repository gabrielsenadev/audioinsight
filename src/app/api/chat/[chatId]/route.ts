import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { Ai } from '@cloudflare/ai';
import { DatabaseController } from '@/database/DatabaseController';

export const runtime = 'edge'
const dbController = DatabaseController.getInstance();

type SendMessageRequest = {
  chatId: number;
  message: string;
}

type Params = {
  chatId: string;
};

export async function POST(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  const data = await request.json<SendMessageRequest>();
  if (!data?.message) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }
  const { message } = data;
  const { DB: db } = getRequestContext().env;

  const chat = await dbController.getChat(db, id);

  if (!chat) {
    return new Response('Chat not found.', {
      status: 404,
    });
  }

  const ai = new Ai(getRequestContext().env.AI);

  const firstChatMessage = await dbController.getFirstChatMessage(db, id);

  const messages = [
    {
      role: 'system',
      content: 'When answering the question or responding, use the context provided.'
    },
    {
      role: 'system',
      content: `Context:${chat.vtt}`
    },
  ];

  if (firstChatMessage) {
    messages.push(firstChatMessage);
  }

  messages.push({
    role: 'user',
    content: message,
  });

  const chatBotResponse = (await ai.run(
    "@cf/meta/llama-2-7b-chat-fp16",
    {
      messages,
    }
  )) as { response: string };

  const aiResponseMessage = {
    chatId: id,
    content: chatBotResponse.response,
    role: 'assistance',
  };

  dbController.addChatMessages(db, [
    {
      chatId: id,
      content: message,
      role: 'user',
    },
    aiResponseMessage,
  ])

  return new Response(JSON.stringify({
    role: aiResponseMessage.role,
    message: aiResponseMessage.content,
  }), {
    status: 200,
  });
}

export async function GET(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  if (!id) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }

  const { DB: db } = getRequestContext().env;

  const chat = await dbController.getChat(db, id);

  if (!chat) {
    return new Response('Chat not found.', {
      status: 404,
    });
  }

  const chatMessages = (await dbController.getChatMessages(db, id)).results ?? [];

  return new Response(JSON.stringify({
    id,
    title: chat.title,
    vtt: chat.vtt,
    content: chat.content,
    messages: chatMessages,
  }), {
    status: 200,
  })
}

import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { Ai } from '@cloudflare/ai';
import { DatabaseController } from '@/database/DatabaseController';
import { contextTextGeneration } from '@/ai';

export const runtime = 'edge';
const dbController = DatabaseController.getInstance();

type Params = {
  chatId: string;
};

export async function POST(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  const formData = await request.formData();
  const message = formData.get('message') as string;

  if (!message) {
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

  const ai = new Ai(getRequestContext().env.AI);

  const firstChatMessage = (await dbController.getFirstChatMessage(db, id)) ?? { role: 'assistant', content: ' '};
  const { response: content } = (await contextTextGeneration(ai, message, chat.vtt, [firstChatMessage])) as { response: string };

  dbController.addChatMessages(db, [
    {
      chatId: id,
      content: message,
      role: 'user',
    },
    {
      chatId: id,
      content,
      role: 'assistance',
    },
  ])
 
  return new Response(JSON.stringify({
    role: 'assistance',
    content: content,
  }));
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

import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { v4 as uuidv4 } from 'uuid';
import { Ai } from '@cloudflare/ai';
import { RoleScopedChatInput } from '@cloudflare/ai/dist/ai/tasks/text-generation';

export const runtime = 'edge'

type SendMessageRequest = {
  chatId: number;
  message: string;
}

export async function POST(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  const data = await request.json<SendMessageRequest>();
  if (!data?.message) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }
  const { message } = data;
  const stmt = getRequestContext().env.DB.prepare(`
    SELECT * FROM chats
    WHERE id=?
  `);

  const result = await stmt.bind(id).first();

  if (!result) {
    return new Response('Chat not found.', {
      status: 404,
    });
  }

  const ai = new Ai(getRequestContext().env.AI);

  const chatHistoryStmt = getRequestContext().env.DB.prepare(`
    SELECT role, content FROM chat_messages
    WHERE chat_id=?
  `);

  const resultHistory = await chatHistoryStmt.bind(id).first() as { role: string, content: string };
  const messages = [
    {
      role: 'system',
      content: 'When answering the question or responding, use the context provided.'
    },
    {
      role: 'system',
      content: `Context:${result.vtt}`
    },
    resultHistory,
    {
      role: 'user',
      content: message,
    }
  ];

  console.log('dt', messages);

  const chatBotResponse = (await ai.run(
    "@cf/meta/llama-2-7b-chat-fp16",
    {
      messages,
    }
  )) as { response: string };

  const addChatHistoryStmt = getRequestContext().env.DB.prepare(`INSERT INTO chat_messages (chat_id, role, content) VALUES (?, ?, ?)`);
  addChatHistoryStmt.bind(id, 'user', message).run();
  addChatHistoryStmt.bind(id, 'assistance', chatBotResponse.response).run();

  return new Response(JSON.stringify({
    role: 'assistance',
    message: chatBotResponse.response,
  }), {
    status: 200,
  })
}

export async function GET(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  if (!id) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }

  const stmt = getRequestContext().env.DB.prepare(`
    SELECT * FROM chats
    WHERE id=?
  `);

  const result = await stmt.bind(id).first();

  if (!result) {
    return new Response('Chat not found.', {
      status: 404,
    });
  }

  const chatHistoryStmt = getRequestContext().env.DB.prepare(`
    SELECT role, content FROM chat_messages
    WHERE chat_id=?
  `);

  const resultHistory = await chatHistoryStmt.bind(id).all();

  return new Response(JSON.stringify({
    id,
    title: result.title,
    vtt: result.vtt,
    content: result.content,
    messages: resultHistory.results ?? [],
  }), {
    status: 200,
  })
}

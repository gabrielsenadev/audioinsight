import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { v4 as uuidv4 } from 'uuid';
import { Ai } from '@cloudflare/ai';
import { DatabaseController } from '@/database/DatabaseController';
import { audioToText, contentSummarization, contentToTitle } from '@/ai';

export const runtime = 'edge';
const dbController = DatabaseController.getInstance();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const { DB: db } = getRequestContext().env;
  
  const audio = formData.get('audio') as File;

  if (!audio) {
    return new Response('Audio not found.', {
      status: 400,
    });
  }

  const ai = new Ai(getRequestContext().env.AI);

  const audioData = (await audioToText(ai, audio)) as { text: string, vtt: string };

  if (!audioData) {
    return new Response('Internal Server Error.', {
      status: 500,
    });
  }

  const { text, vtt } = audioData;

  const summary = await contentSummarization(ai, text);

  const title = await contentToTitle(ai, summary);

  const id = uuidv4().substring(0, 32);

  const chat = await dbController.createChat(db, {
    id,
    content: text,
    vtt,
    title
  });

  if (chat.success) {
    dbController.addChatMessage(db, {
      chatId: id,
      content: summary,
      role: 'assistance',
    });

    return new Response(JSON.stringify({
      id,
      title,
      vtt,
      content: text,
      messages: [
        {
          role: 'assistance',
          message: summary,
        },
      ],
    }), {
      status: 200,
    })
  }

  return new Response('Internal Server Error.', {
    status: 500,
  })
}

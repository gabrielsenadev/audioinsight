import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { v4 as uuidv4 } from 'uuid';
import { Ai } from '@cloudflare/ai';
import { DatabaseController } from '@/database/DatabaseController';

export const runtime = 'edge'
const dbController = DatabaseController.getInstance();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const { DB: db } = getRequestContext().env;
  
  const audio = formData.get('audio') as File;

  if (!audio) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }

  const ai = new Ai(getRequestContext().env.AI);

  const buffer = await audio.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const whisperResponse = await ai.run('@cf/openai/whisper', {
    audio: [...bytes],
  });

  if (whisperResponse) {
    const { text, vtt } = whisperResponse as { text: string, vtt: string };
    const summarizationResponse = await ai.run(
      "@cf/facebook/bart-large-cnn",
      {
        input_text: text
      }
    );

    const titleResponse = (await ai.run(
      "@cf/meta/llama-2-7b-chat-fp16",
      {
        prompt: `<s>[INST]<<SYS>>Generate a title of the user content. Only one.<</SYS>>${summarizationResponse.summary}[/INST]</s>`,
        raw: true,
      }
    )) as { response: string };

    const title = titleResponse.response.replaceAll('"', '').replace('titled', '').trim();

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
        content: summarizationResponse.summary,
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
            message: summarizationResponse.summary,
          },
        ],
      }), {
        status: 200,
      })
    }
  }

  return new Response('Internal Server Error.', {
    status: 500,
  })
}

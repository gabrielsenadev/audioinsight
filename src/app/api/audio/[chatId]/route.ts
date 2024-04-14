import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest } from "next/server";

export const runtime = 'edge';

export async function GET(request: NextRequest, context: { params: Params }) {
  const id = context.params.chatId;
  if (!id) {
    return new Response('Bad Request.', {
      status: 400,
    });
  }

  const { R2 } = getRequestContext().env;

  const audio = await R2.get(`audio-${id}`);

  if (!audio) {
    return new Response('Audio not found.', {
      status: 404,
    });
  }

  const headers = new Headers();
  audio.writeHttpMetadata(headers);
  headers.set('etag', audio.httpEtag);

  return new Response(audio.body, {
    status: 200,
    headers,
  })
}

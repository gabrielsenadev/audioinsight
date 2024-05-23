import { ChatsService } from '@/server/services'
import { NextResponse, type NextRequest } from 'next/server'

type Params = {
  chatId: string;
};

export const runtime = 'edge';

export async function GET(_request: NextRequest, { params: { chatId }}: { params: Params }) {
  const audio = await ChatsService.getInstance().getChatAudio(chatId);
  return new NextResponse(audio);
}

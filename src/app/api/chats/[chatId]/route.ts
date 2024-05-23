import { ChatsService } from '@/server/services'
import { NextResponse, type NextRequest } from 'next/server'

type Params = {
  chatId: string;
};

export const runtime = 'edge';

export async function GET(_request: NextRequest, { params: { chatId }}: { params: Params }) {
  const chat = await ChatsService.getInstance().getChat(chatId);
  return new NextResponse(JSON.stringify(chat));
}
import { ChatsService } from '@/services/ChatsService'
import { NextResponse, type NextRequest } from 'next/server'

type Params = {
  chatId: string;
};

export async function GET(request: NextRequest, { params: { chatId }}: { params: Params }) {
  const chat = await ChatsService.getInstance().getChat(chatId);
  return new NextResponse(JSON.stringify(chat));
}
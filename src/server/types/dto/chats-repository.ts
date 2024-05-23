export type CreateChatInput = {
  title: string;
  vtt: string;
  content: string;
  audio: Blob;
  id: string;
}

export type GetChatInput = {
  id: string;
}

export type AddChatMessageInput = {
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
}

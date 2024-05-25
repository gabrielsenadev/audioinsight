import { MessageRole } from "../shared";

export type Chat = {
  title: string;
  vtt: string;
  content: string;
}

export type ChatMessage = {
  content: string;
  role: MessageRole;
  timeStamp: number;
}

import { MessageRole } from "../shared";

export type GenerateTextStreamMessageInput = {
  content: string;
  role: MessageRole;
};

export type GenerateTextStreamInput = {
  messages: GenerateTextStreamMessageInput[];
};

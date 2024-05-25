export type ChatMessage = {
  content: string;
  role: string;
  timeStamp: number;
};

export type ChatData = {
  content: string;
  title: string;
  vtt: string;
  messages: ChatMessage[];
  audioURL: string;
};

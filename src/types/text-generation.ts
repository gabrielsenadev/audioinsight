export type TextGenerationResponse = Promise<Response> | {
  content: string;
};

export type TextGenerationMessageInput = {
  role: string;
  content: string;
};

export type TextGenerationExecutorOptions = {
  stream: boolean;
  max_tokens: number;
}


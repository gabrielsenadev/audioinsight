export type TextGenerationResponse = {
  content: string;
};

export type TextGenerationStreamResponse = Response;

export type TextGenerationMessageInput = {
  role: string;
  content: string;
};

export type TextGenerationExecutorOptions = {
  stream?: boolean;
  max_tokens?: number;
}

export type TextGenerationStreamExecutorOptions = {
  stream: true;
  max_tokens?: number;
}


import { TextGenerationExecutorOptions, TextGenerationMessageInput, TextGenerationResponse, TextGenerationStreamExecutorOptions, TextGenerationStreamResponse } from "@/server/types/provider";

export abstract class TextGenerationProviderImpl {
  abstract execute(messages: TextGenerationMessageInput[], options?: TextGenerationExecutorOptions & { stream?: true }): Promise<TextGenerationStreamResponse>;

  abstract execute(messages: TextGenerationMessageInput[], options?: TextGenerationExecutorOptions & { stream?: false }): Promise<TextGenerationResponse>;

  abstract execute(messages: TextGenerationMessageInput[], options?: TextGenerationExecutorOptions): Promise<TextGenerationStreamResponse | TextGenerationResponse>;
}

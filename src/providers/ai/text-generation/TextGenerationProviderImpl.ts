import { TextGenerationExecutorOptions, TextGenerationMessageInput, TextGenerationResponse } from "@/types/";

export abstract class TextGenerationProviderImpl {
  abstract execute(messages: TextGenerationMessageInput[], options: TextGenerationExecutorOptions): Promise<TextGenerationResponse>
}

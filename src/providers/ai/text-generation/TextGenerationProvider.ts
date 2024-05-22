import { TextGenerationExecutorOptions, TextGenerationMessageInput, TextGenerationResponse } from "@/types";
import { CloudflareOpenChatOpenChat } from "./providers";
import { TextGenerationProviderImpl } from "./TextGenerationProviderImpl";

export class TextGenerationProvider {
  private providers: TextGenerationProviderImpl[];
  private static instance: TextGenerationProvider;

  private constructor() {
    this.providers = [new CloudflareOpenChatOpenChat()];
  }

  public static getInstance() {
    if (!TextGenerationProvider.instance) {
      TextGenerationProvider.instance = new TextGenerationProvider();
    }

    return TextGenerationProvider.instance;
  }

  public async execute(messages: TextGenerationMessageInput[], options: TextGenerationExecutorOptions): Promise<TextGenerationResponse> {
    let lastError = null;

    for (let provider of this.providers) {
      try {
        if (options.stream) {
          return provider.execute(messages, options);
        }

        return await provider.execute(messages, options);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
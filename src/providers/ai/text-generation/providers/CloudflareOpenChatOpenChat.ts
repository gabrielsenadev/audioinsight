import { TextGenerationExecutorOptions, TextGenerationMessageInput, TextGenerationResponse, TextGenerationStreamResponse } from "@/types";
import { TextGenerationProviderImpl } from "../TextGenerationProviderImpl";

export class CloudflareOpenChatOpenChat extends TextGenerationProviderImpl {
  async execute(messages: TextGenerationMessageInput[], options: TextGenerationExecutorOptions & { stream: true }): Promise<TextGenerationStreamResponse>;
  async execute(messages: TextGenerationMessageInput[], options?: TextGenerationExecutorOptions & { stream?: false }): Promise<TextGenerationResponse>;
  async execute(messages: TextGenerationMessageInput[], options?: TextGenerationExecutorOptions): Promise<TextGenerationStreamResponse | TextGenerationResponse> {
    const API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/openchat/openchat-3.5-0106`;
    
    const headers = {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    };
    
    const request = fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        messages,
        ...options,
      }),
      headers,
    });

    if (options?.stream) {
      return request;
    }

    const response = await request;

    const { success, errors, result } = await response.json();

    if (!success) {
      throw new Error('Cloudflare OpenChat OpenChat-3.5 error', {
        cause: errors,
      });
    }

    return {
      content: result.response,
    }
  }
}
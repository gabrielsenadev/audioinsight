import { AudioToTextResponse } from "@/types/audio-to-text";
import { AudioToTextProviderImpl } from "./AudioToTextProviderImpl";

export class CloudflareWhisper extends AudioToTextProviderImpl {
  async execute(audio: Blob): Promise<AudioToTextResponse> {
    const API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/openai/whisper`;

    const headers = {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      body: audio,
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('Cloudflare Whisper error', {
        cause: data.errors,
      });
    }

    const { text, vtt } = data.result;

    return {
      content: text,
      vtt,
    }
  }
}
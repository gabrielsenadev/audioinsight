import { AudioToTextResponse } from "../../../../types/provider";
import { AudioToTextProviderImpl } from "../AudioToTextProviderImpl";

export class CloudflareWhisperTinyEn extends AudioToTextProviderImpl {
  async execute(audio: Blob): Promise<AudioToTextResponse> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/openai/whisper-tiny-en`;
    const headers = {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    };
    const response = await fetch(url, {
      method: 'POST',
      body: audio,
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('Cloudflare Whisper Tiny En error', {
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
import { AudioToTextResponse } from "@/types/audio-to-text";
import { AudioToTextProviderImpl } from "./AudioToTextProviderImpl";
import { CloudflareWhisperTinyEn, CloudflareWhisper } from "./providers";

export class AudioToTextProvider {
  private providers: AudioToTextProviderImpl[];
  private static instance: AudioToTextProvider;

  private constructor() {
    this.providers = [new CloudflareWhisperTinyEn(), new CloudflareWhisper()];
  }

  public static getInstance() {
    if (!AudioToTextProvider.instance) {
      AudioToTextProvider.instance = new AudioToTextProvider();
    }

    return AudioToTextProvider.instance;
  }

  public async execute(audio: Blob): Promise<AudioToTextResponse> {
    let lastError = null;

    for (let provider of this.providers) {
      try {
        return await provider.execute(audio);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
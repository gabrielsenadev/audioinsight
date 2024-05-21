import { AudioToTextResponse } from "@/types/audio-to-text";

export abstract class AudioToTextProviderImpl {
  abstract execute(audio: Blob): Promise<AudioToTextResponse>
}
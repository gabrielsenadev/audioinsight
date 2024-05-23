import { AudioToTextResponse } from "@/server/types/provider";

export abstract class AudioToTextProviderImpl {
  abstract execute(audio: Blob): Promise<AudioToTextResponse>
}
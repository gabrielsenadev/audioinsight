import { AudioToTextResponse } from "../../../types/provider";

export abstract class AudioToTextProviderImpl {
  abstract execute(audio: Blob): Promise<AudioToTextResponse>
}
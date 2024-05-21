import { AudioToTextProvider } from "@/providers/";

class AIService {
  private static instance: AIService;
  private audioToTextProvider: AudioToTextProvider;

  private constructor() {
    this.audioToTextProvider = AudioToTextProvider.getInstance();
  }

  public static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }

    return AIService.instance;
  }

  public convertAudioToText(audio: Blob) {
    return this.audioToTextProvider.execute(audio);
  }
}

export default AIService;

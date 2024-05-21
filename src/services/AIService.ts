import { AudioToTextProvider } from "@/providers/";
import { ContentSummaryProvider } from "@/providers/ai/content-summary/ContentSummaryProvider";

class AIService {
  private static instance: AIService;
  private audioToTextProvider: AudioToTextProvider;
  private contentSummaryProvider: ContentSummaryProvider;

  private constructor() {
    this.audioToTextProvider = AudioToTextProvider.getInstance();
    this.contentSummaryProvider = ContentSummaryProvider.getInstance();
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

  public summaryContent(content: string) {
    return this.contentSummaryProvider.execute(content);
  }
}

export default AIService;

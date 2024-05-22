import { AudioToTextProvider } from "@/providers/";
import { ContentSummaryProvider } from "@/providers/ai/content-summary/ContentSummaryProvider";
import { TextGenerationProvider } from "@/providers/ai/text-generation/TextGenerationProvider";

class AIService {
  private static instance: AIService;
  private audioToTextProvider: AudioToTextProvider;
  private contentSummaryProvider: ContentSummaryProvider;
  private textGenerationProvider: TextGenerationProvider;

  private constructor() {
    this.audioToTextProvider = AudioToTextProvider.getInstance();
    this.contentSummaryProvider = ContentSummaryProvider.getInstance();
    this.textGenerationProvider = TextGenerationProvider.getInstance();
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

  public askQuestion(content: string) {
    return this.textGenerationProvider.execute([{
      content,
      role: 'user',
    }], {
      max_tokens: 1024,
      stream: true,
    });
  }
}

export default AIService;

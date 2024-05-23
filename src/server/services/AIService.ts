import { AudioToTextProvider } from "@/server/providers/";
import { ContentSummaryProvider } from "@/server/providers/ai/content-summary/ContentSummaryProvider";
import { TextGenerationProvider } from "@/server/providers/ai/text-generation/TextGenerationProvider";

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

  public async createTitle(content: string) {
    const PROMPTS = [{
      content: 'Generate a captivating title based on the following user content. The title should be engaging, relevant to the content, and intriguing enough to draw attention.',
      role: 'system',
    },
    {
      content,
      role: 'user',
    }];

    const result = await this.textGenerationProvider.execute(PROMPTS, {
      stream: false,
      max_tokens: 256,
    });

    return result.content.trim();
  }
}

export default AIService;

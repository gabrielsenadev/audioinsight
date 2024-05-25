import { AudioToTextProvider } from "../providers";
import { ContentSummaryProvider } from "../providers/ai/content-summary/ContentSummaryProvider";
import { TextGenerationProvider } from "../providers/ai/text-generation/TextGenerationProvider";
import { GenerateTextStreamInput } from "../types/dto/ai-service";

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
      content: 'You will be provided with a content, and your task is to generate one title. Maximum 30 characters.',
      role: 'system',
    },
    {
      content: `Content:${content}`,
      role: 'user',
    }];

    const result = await this.textGenerationProvider.execute(PROMPTS, {
      stream: false,
      max_tokens: 256,
    });

    return result.content.trim().replaceAll("\"", "");
  }

  public async generateTextStream({ messages }: GenerateTextStreamInput) {
    return this.textGenerationProvider.execute(messages, {
      stream: true,
    });
  }
}

export default AIService;

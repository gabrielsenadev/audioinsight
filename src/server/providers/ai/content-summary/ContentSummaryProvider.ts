import { ContentSummaryResponse } from "@/server/types/provider";
import { CloudflareBartLarge } from "./providers";
import { ContentSummaryProviderImpl } from "./ContentSummaryProviderImpl";

export class ContentSummaryProvider {
  private providers: ContentSummaryProviderImpl[];
  private static instance: ContentSummaryProvider;

  private constructor() {
    this.providers = [new CloudflareBartLarge()];
  }

  public static getInstance() {
    if (!ContentSummaryProvider.instance) {
      ContentSummaryProvider.instance = new ContentSummaryProvider();
    }

    return ContentSummaryProvider.instance;
  }

  public async execute(content: string): Promise<ContentSummaryResponse> {
    let lastError = null;

    for (let provider of this.providers) {
      try {
        return await provider.execute(content);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
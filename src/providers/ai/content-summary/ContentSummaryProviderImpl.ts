import { ContentSummaryResponse } from "@/types/";

export abstract class ContentSummaryProviderImpl {
  abstract execute(content: string): Promise<ContentSummaryResponse>
}
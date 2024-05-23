import { ContentSummaryResponse } from "@/server/types/provider";

export abstract class ContentSummaryProviderImpl {
  abstract execute(content: string): Promise<ContentSummaryResponse>
}
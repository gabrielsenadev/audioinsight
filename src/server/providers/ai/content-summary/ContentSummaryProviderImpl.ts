import { ContentSummaryResponse } from "../../../types/provider";

export abstract class ContentSummaryProviderImpl {
  abstract execute(content: string): Promise<ContentSummaryResponse>
}
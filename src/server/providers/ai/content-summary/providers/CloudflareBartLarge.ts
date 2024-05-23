import { ContentSummaryResponse } from "@/server/types/provider";
import { ContentSummaryProviderImpl } from "../ContentSummaryProviderImpl";

export class CloudflareBartLarge extends ContentSummaryProviderImpl {
  async execute(content: string): Promise<ContentSummaryResponse> {
    const API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/facebook/bart-large-cnn`;

    const headers = {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        input_text: content,
      }),
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('Cloudflare Bart Large Cnn error', {
        cause: data.errors,
      });
    }

    const { summary } = data.result;

    return {
      content: summary,
    }
  }
}
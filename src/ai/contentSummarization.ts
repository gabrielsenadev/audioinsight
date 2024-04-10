import { Ai } from "@cloudflare/ai";

export async function contentSummarization(ai: Ai, content: string) {
  const response = await ai.run(
    "@cf/facebook/bart-large-cnn",
    {
      input_text: content,
    }
  );
  return response.summary;
}

import { Ai } from "@cloudflare/ai";
import { AiTextGenerationOutput } from "@cloudflare/ai/dist/ai/tasks/text-generation";

export async function contentToTitle(ai: Ai, content: string) {
  const generated = await ai.run(
    "@hf/thebloke/neural-chat-7b-v3-1-awq",
    {
      max_tokens: 50,
      messages: [
        {
          content: 'You will be provided with a content, and your task is to generate one title. Maximum 30 characters.',
          role: 'system'
        },
        {
          content: `Content: ${content}`,
          role: 'user'
        },
      ]
    }
  ) as { response: string };
  return generated.response.replaceAll('"', '').replace('titled', '').trim();
}

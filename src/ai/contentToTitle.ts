import { Ai } from "@cloudflare/ai";
import { AiTextGenerationOutput } from "@cloudflare/ai/dist/ai/tasks/text-generation";

export async function contentToTitle(ai: Ai, content: string) {
  const generated = await ai.run(
    "@hf/thebloke/neural-chat-7b-v3-1-awq",
    {
      max_tokens: 50,
      messages: [
        {
          content: 'When receive a input, generate a title of this input.',
          role: 'system'
        },
        {
          content: 'Generate only one title.',
          role: 'system'
        },
        {
          content: content,
          role: 'user'
        },
      ]
    }
  ) as { response: string };
  return generated.response.replaceAll('"', '').replace('titled', '').trim();
}

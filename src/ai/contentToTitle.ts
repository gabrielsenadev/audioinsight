import { Ai } from "@cloudflare/ai";
import { AiTextGenerationOutput } from "@cloudflare/ai/dist/ai/tasks/text-generation";

export async function contentToTitle(ai: Ai, content: string) {
  const generated = await ai.run(
    "@cf/meta/llama-2-7b-chat-fp16",
    {
      prompt: `<s>[INST]<<SYS>>Generate a title of the user content. Only one.<</SYS>>${content}[/INST]</s>`,
      raw: true,
    }
  ) as { response: string };
  return generated.response.replaceAll('"', '').replace('titled', '').trim();
}

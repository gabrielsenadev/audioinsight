import { Ai } from "@cloudflare/ai";

export async function audioToText(ai: Ai, audio: File) {
  const buffer = await audio.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return ai.run('@cf/openai/whisper', {
    audio: [...bytes],
  });
};

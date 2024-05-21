import AIService from "@/services/AIService";
import audioSchema from "@/validators/audio-schema";
import { NextRequest } from "next/server";

/*
[binary audio] > created chat -> response chat data: title, messages
*/
export async function POST(request: NextRequest) {
  try {
    const dirtyData = await request.blob();
    const { success, data, error } = audioSchema.safeParse(dirtyData);

    if (!success) {
      return new Response(JSON.stringify(error.format()), {
        status: 400,
      });
    }

    const { content, vtt } = await AIService.getInstance().convertAudioToText(data);
    const summary = await AIService.getInstance().summaryContent(content);
    console.log('result', summary);

  } catch (error) {
    if (error instanceof Error) {
      console.log('Unhandled error', error);
      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  }
}

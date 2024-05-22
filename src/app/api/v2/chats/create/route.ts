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

    // const { content, vtt } = await AIService.getInstance().convertAudioToText(data);
    // const summary = await AIService.getInstance().summaryContent(content);
    // const data2 = await AIService.getInstance().askQuestion('Como você se chama');
    // const response = new Response(data2.body);
    // return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Unhandled error', error);
      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  }
}

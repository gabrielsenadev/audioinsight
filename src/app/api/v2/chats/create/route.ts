import AIService from "@/services/AIService";
import audioSchema from "@/validators/audio-schema";
import { NextRequest, NextResponse } from "next/server";

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
    // only making tests
    const data2 = await AIService.getInstance().askQuestion(
      "hello"
    );
    // if (!data2.body) {
    //   return new Response("API Problem", {
    //     status: 500,
    //   });
    // }
    // const [userStream, appStream] = data2.body.tee();
    // const reader = appStream.pipeThrough(new TextDecoderStream()).getReader();
    // let text = "";

    // reader.read().then(function processData({ done, value }) {
    //   if (done) {
    //     console.log(text);
    //     return;
    //   }

    //   try {
    //     const parsedData = JSON.parse(value.replace('data: ', ''));
    //     text += parsedData.response;
    //   } catch (error) {}

    //   reader.read().then(processData);
    // });

    // return new NextResponse(userStream);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unhandled error", error);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  }
}

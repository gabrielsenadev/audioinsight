import { ChatsService } from "@/server/services/ChatsService";
import audioSchema from "@/server/validators/audio-schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const dirtyData = await request.blob();
    const { success, data: audioBlob, error } = audioSchema.safeParse(dirtyData);

    if (!success) {
      return new Response(JSON.stringify(error.format()), {
        status: 400,
      });
    }

    const result = await ChatsService.getInstance().createChat({ audio: audioBlob });
    return new NextResponse(result);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unhandled error", error);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  }
}

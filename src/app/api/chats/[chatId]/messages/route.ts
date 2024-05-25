import { ChatsService } from "../../../../../server/services/ChatsService";
import messageSchema from "../../../../../server/validators/message-schema";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  chatId: string;
};

export async function POST(request: NextRequest, { params: { chatId }}: { params: Params }) {
  try {
    const dirtyData = await request.json();
    const { success, data, error } = messageSchema.safeParse(dirtyData);

    if (!success) {
      return new Response(JSON.stringify(error.format()), {
        status: 400,
      });
    }

    const stream = await ChatsService.getInstance().sendMessage(chatId, data.message);

    return new NextResponse(stream);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unhandled error", error);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  }
}

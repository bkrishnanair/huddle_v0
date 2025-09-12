import { type NextRequest, NextResponse } from "next/server";
import { verifySession, SessionVerificationError } from "@/lib/auth-server";
import { sendMessage, getChatMessages } from "@/lib/db";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(500, "Message too long (max 500 characters)"),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifySession(request);
    const { id } = params;

    const body = await request.json();
    const validationResult = chatSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const { message } = validationResult.data;
    // `name` is a standard claim in the decoded token
    const displayName = user.name || "Anonymous";

    await sendMessage(id, user.uid, displayName, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SessionVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    console.error("Chat message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Session verification is required to view chat messages.
    await verifySession(request);
    const { id } = params;

    const messages = await getChatMessages(id);

    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof SessionVerificationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Get chat messages error:", error);
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 });
  }
}

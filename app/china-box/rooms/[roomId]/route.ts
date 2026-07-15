import { NextResponse } from "next/server";
import { ensureChinaBoxRoom } from "@/lib/china-box-rooms";

export async function GET(
  _request: Request,
  context: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await context.params;
  const room = await ensureChinaBoxRoom(roomId);

  return NextResponse.json(room, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

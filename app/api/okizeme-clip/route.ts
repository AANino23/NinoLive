import { NextRequest, NextResponse } from "next/server";

import { fetchOkizemePresignedUrl } from "@/lib/okizeme-clips";

export async function GET(request: NextRequest) {
  const character = request.nextUrl.searchParams.get("character");
  const move = request.nextUrl.searchParams.get("move");

  if (!character || !move) {
    return NextResponse.json(
      { error: "Missing character or move" },
      { status: 400 },
    );
  }

  const presignedUrl = await fetchOkizemePresignedUrl(character, move);

  if (!presignedUrl) {
    return NextResponse.json({ error: "Clip unavailable" }, { status: 404 });
  }

  return NextResponse.json(
    { presignedUrl },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}

import { NextRequest, NextResponse } from "next/server";

import {
  fetchOkizemePresignedUrl,
  resolveOkizemeCandidates,
} from "@/lib/okizeme-clips";

export async function GET(request: NextRequest) {
  const character = request.nextUrl.searchParams.get("character");
  const move = request.nextUrl.searchParams.get("move");

  if (!character || !move) {
    return NextResponse.json(
      { error: "Missing character or move" },
      { status: 400 },
    );
  }

  const candidates = await resolveOkizemeCandidates(character, move);

  // A move key can match the notation and still have no clip filmed for it, so keep
  // walking the candidates instead of reporting the whole lookup as unavailable.
  let resolvedMove = move;
  let presignedUrl: string | null = null;

  for (const candidate of [...candidates, move]) {
    presignedUrl = await fetchOkizemePresignedUrl(character, candidate);

    if (presignedUrl) {
      resolvedMove = candidate;
      break;
    }
  }

  if (!presignedUrl) {
    return NextResponse.json(
      { error: "Clip unavailable" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  // The signed CDN token in this response expires an hour after okizeme issues it, so a
  // cached copy hands out a dead link. Only the move-name lookup behind it is cacheable.
  return NextResponse.json(
    { presignedUrl, command: resolvedMove },
    { headers: { "Cache-Control": "no-store" } },
  );
}

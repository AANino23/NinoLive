type OkizemeClipResponse = {
  presignedUrl?: string;
};

export async function fetchOkizemePresignedUrl(
  character: string,
  move: string,
): Promise<string | null> {
  const encodedMove = encodeURIComponent(move);
  const response = await fetch(
    `https://okizeme.gg/api/${character}/${encodedMove}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OkizemeClipResponse;
  return data.presignedUrl ?? null;
}

export function getOkizemeDatabaseUrl(character: string, search: string) {
  return `https://okizeme.gg/database/${character}?search=${encodeURIComponent(search)}`;
}

type OkizemeClipResponse = {
  presignedUrl?: string;
};

type OkizemeMove = {
  command?: string;
};

/**
 * Guides write notation the way players say it out loud, which is not always the exact
 * key okizeme.gg stores a clip under. Normalising both sides lets "ws2" find "ws+2",
 * "CD.df+2" find "f,n,d,df+2", and "wr4" find "(2 steps or more) wr4".
 */
function normalizeCommand(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\([^)]*\)\s*/u, "")
    .replace(/^cd\./u, "f,n,d,")
    .replace(/\s+/gu, "")
    .replace(/\*+$/u, "");
}

function looseCommand(value: string) {
  return normalizeCommand(value).replace(/[+,.~:]/gu, "");
}

async function fetchCharacterCommands(character: string): Promise<string[]> {
  const response = await fetch(`https://okizeme.gg/api/${character}`, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as OkizemeMove[];

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((move) => move.command)
    .filter((command): command is string => Boolean(command));
}

/** Maps a guide's notation onto the exact move key okizeme.gg has a clip for. */
export async function resolveOkizemeMove(
  character: string,
  query: string,
): Promise<string | null> {
  const wanted = normalizeCommand(query);
  const wantedLoose = looseCommand(query);

  if (!wantedLoose) {
    return null;
  }

  const commands = await fetchCharacterCommands(character);

  const exact = commands.find((command) => normalizeCommand(command) === wanted);
  if (exact) {
    return exact;
  }

  const loose = commands.find((command) => looseCommand(command) === wantedLoose);
  if (loose) {
    return loose;
  }

  const prefixed = commands.filter((command) =>
    looseCommand(command).startsWith(wantedLoose),
  );

  if (prefixed.length) {
    return prefixed.reduce((shortest, command) =>
      command.length < shortest.length ? command : shortest,
    );
  }

  return null;
}

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

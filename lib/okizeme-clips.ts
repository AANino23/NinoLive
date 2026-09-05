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

/**
 * Separator characters carry no lookup meaning, so "u/f+2" can find "uf+2" and
 * "f,n,d,df+2" can find "f,n,d,df:2".
 *
 * Exported for `scripts/audit-clips.ts`, which uses it to tell a punctuation-only match
 * apart from the prefix fallback below — the latter plays a different move than the
 * guide named, and is the only silent failure a clip request cannot report.
 */
export function looseCommand(value: string) {
  return normalizeCommand(value).replace(/[+,.~:/]/gu, "");
}

/** Enough to cover notation collisions without turning one lookup into a crawl. */
const MAX_CANDIDATES = 4;

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

/**
 * Ranks the move keys okizeme.gg might have filed a guide's notation under, best first.
 * More than one can match — Reina's `f,n,d,df+2` normalises the same as `f,n,d,DF+2`, and
 * only one of those pair has a clip — so the caller walks the list rather than betting on
 * the first hit.
 */
export async function resolveOkizemeCandidates(
  character: string,
  query: string,
): Promise<string[]> {
  const wanted = normalizeCommand(query);
  const wantedLoose = looseCommand(query);

  if (!wantedLoose) {
    return [];
  }

  const commands = await fetchCharacterCommands(character);
  const ranked: string[] = [];
  const push = (command: string) => {
    if (!ranked.includes(command)) {
      ranked.push(command);
    }
  };

  for (const command of commands) {
    if (normalizeCommand(command) === wanted) {
      push(command);
    }
  }

  for (const command of commands) {
    if (looseCommand(command) === wantedLoose) {
      push(command);
    }
  }

  const prefixed = commands
    .filter((command) => looseCommand(command).startsWith(wantedLoose))
    .sort((a, b) => a.length - b.length);

  for (const command of prefixed) {
    push(command);
  }

  // The loose form drops separators, so "b+1+2" and "b+1,2" collapse together. That is
  // fine for picking a single best guess, but a fallback must not quietly hand back a
  // different move: past the top pick, only keep longer spellings of the same command.
  const [primary, ...rest] = ranked;

  if (!primary) {
    return [];
  }

  return [
    primary,
    ...rest.filter((command) => normalizeCommand(command).startsWith(wanted)),
  ].slice(0, MAX_CANDIDATES);
}

/** Maps a guide's notation onto the exact move key okizeme.gg has a clip for. */
export async function resolveOkizemeMove(
  character: string,
  query: string,
): Promise<string | null> {
  const [best] = await resolveOkizemeCandidates(character, query);
  return best ?? null;
}

export async function fetchOkizemePresignedUrl(
  character: string,
  move: string,
): Promise<string | null> {
  const encodedMove = encodeURIComponent(move);
  const response = await fetch(
    `https://okizeme.gg/api/${character}/${encodedMove}`,
    { cache: "no-store" },
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

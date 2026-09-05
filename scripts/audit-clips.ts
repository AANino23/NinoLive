/**
 * Audits every okizeme.gg clip the ten Tekken guides can open.
 *
 * Guides write notation the way players say a move out loud, while okizeme files its
 * clips under its own move keys. That gap is bridged at request time by
 * `resolveOkizemeCandidates`, so a typo in a freshly added guide entry — or a rename on
 * okizeme's side — leaves a clip button that silently 404s until somebody happens to tap
 * that exact move. This walks every reference the guides can play, resolves each one
 * through the same function the `/api/okizeme-clip` route uses, confirms okizeme really
 * has a clip behind the key it lands on, and exits non-zero on anything that would 404.
 *
 * Usage:
 *   npm run audit:clips
 *   npm run audit:clips -- --fast   only checks that the notation resolves to a move
 *                                   key, skipping the ~500 clip requests behind that
 */

import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { GuideCharacterId } from "../app/tekken/punishment-data.ts";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OKIZEME_API = "https://okizeme.gg/api";

/**
 * Next bundles the app, so its modules import each other without file extensions. Node's
 * own TypeScript loader wants them, so put the extension back here rather than reshaping
 * app code around this script.
 */
registerHooks({
  resolve(specifier, context, next) {
    if (
      context.parentURL &&
      specifier.startsWith(".") &&
      !/\.[cm]?[jt]sx?$/u.test(specifier) &&
      existsSync(fileURLToPath(new URL(`${specifier}.ts`, context.parentURL)))
    ) {
      return next(`${specifier}.ts`, context);
    }

    return next(specifier, context);
  },
});

const responseCache = new Map<string, Promise<Response>>();
const upstreamFetch = globalThis.fetch;

/**
 * `resolveOkizemeCandidates` refetches a character's whole move list on every call and
 * leans on Next's fetch cache to make that free. Nothing caches for us out here, and the
 * audit resolves hundreds of moves across ~40 characters, so memoise by URL for the run.
 */
globalThis.fetch = ((input: Parameters<typeof upstreamFetch>[0], init?: RequestInit) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

  let pending = responseCache.get(url);

  if (!pending) {
    pending = upstreamFetch(input, init);
    responseCache.set(url, pending);
  }

  // A response body can only be read once, so hand every caller its own copy.
  return pending.then((response) => response.clone());
}) as typeof globalThis.fetch;

// Imported after the hooks above are installed, which is why these are dynamic.
const { GUIDE_OKIZEME_SLUGS, getMoveClipSearch, getOkizemeDatabaseUrl, getOpponentSlug, isSingleCommand } =
  await import("../app/tekken/opponent-clips.ts");
const { getOpponentProfile } = await import("../app/tekken/opponent-profiles.ts");
const { getMatchupPunishment } = await import("../app/tekken/punishment-data.ts");
const { fetchOkizemePresignedUrl, looseCommand, resolveOkizemeCandidates } = await import(
  "../lib/okizeme-clips.ts"
);

type ClipReference = {
  characterSlug: string;
  search: string;
  /** Every place in the repo that can play this clip, so a break points at its source. */
  origins: string[];
};

const references = new Map<string, ClipReference>();

function addReference(characterSlug: string, notation: string, origin: string) {
  const search = getMoveClipSearch(notation);

  if (!search) {
    return;
  }

  const key = `${characterSlug}::${search}`;
  const existing = references.get(key);

  if (existing) {
    if (!existing.origins.includes(origin)) {
      existing.origins.push(origin);
    }

    return;
  }

  references.set(key, { characterSlug, search, origins: [origin] });
}

/**
 * Guide clips live in `.tsx` files that cannot be imported outside a JSX pipeline, so
 * their `search: "…"` literals are read straight off the source. Line numbers come along
 * because a broken clip is only useful if you can open the line that declares it.
 */
function collectGuideClips(guideFile: string, source: string, characterSlug: string) {
  let found = 0;

  source.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(/\bsearch:\s*"((?:[^"\\]|\\.)*)"/gu)) {
      addReference(characterSlug, match[1], `${guideFile}:${index + 1}`);
      found += 1;
    }
  });

  return found;
}

/**
 * Five guides build their matchup list from a `matchupNames` array; Steve still spells
 * every matchup out longhand. Both shapes have to be read to cover all six.
 */
function collectMatchupNames(source: string): string[] {
  const nameList = source.match(/const matchupNames = \[([^\]]*)\]/u);

  if (nameList) {
    return [...nameList[1].matchAll(/"((?:[^"\\]|\\.)*)"/gu)].map((match) => match[1]);
  }

  const literalList = source.match(/const matchups: Matchup\[\] = \[([\s\S]*?)\n\];/u);

  if (literalList) {
    return [...literalList[1].matchAll(/^ {4}name: "((?:[^"\\]|\\.)*)",$/gmu)].map(
      (match) => match[1],
    );
  }

  return [];
}

const setupErrors: string[] = [];

for (const [guideId, characterSlug] of Object.entries(GUIDE_OKIZEME_SLUGS) as Array<
  [GuideCharacterId, string]
>) {
  const guideFile = `app/${guideId}/${guideId}-guide.tsx`;
  const guidePath = join(REPO_ROOT, guideFile);

  if (!existsSync(guidePath)) {
    setupErrors.push(`${guideFile} is missing — GUIDE_OKIZEME_SLUGS lists "${guideId}".`);
    continue;
  }

  const source = readFileSync(guidePath, "utf8");
  const declaredSlug = source.match(/const OKIZEME_CHARACTER = "([^"]+)"/u)?.[1];

  if (declaredSlug && declaredSlug !== characterSlug) {
    setupErrors.push(
      `${guideFile} plays clips as "${declaredSlug}" but GUIDE_OKIZEME_SLUGS says "${characterSlug}".`,
    );
  }

  if (collectGuideClips(guideFile, source, characterSlug) === 0) {
    setupErrors.push(`${guideFile} declared no clips — has the guide's clip shape changed?`);
  }

  const matchupNames = collectMatchupNames(source);

  if (matchupNames.length === 0) {
    setupErrors.push(`${guideFile} declared no matchups — has the matchup shape changed?`);
  }

  for (const opponentName of matchupNames) {
    const punishment = getMatchupPunishment(guideId, opponentName);
    const opponentSlug = getOpponentSlug(opponentName);
    const ladderOrigin = `app/tekken/punishment-data.ts › ${guideId} punish ladder`;

    // Your own punishes render through ClipNotation, which only offers a clip when the
    // notation is a single lookup-able command. Mirror that gate so the audit reports
    // what the guides can actually open.
    for (const tier of [...punishment.ladder, ...punishment.crouchLadder]) {
      if (isSingleCommand(tier.move)) {
        addReference(characterSlug, tier.move, ladderOrigin);
      }
    }

    for (const option of punishment.whiffPunish.split("/")) {
      if (isSingleCommand(option.trim())) {
        addReference(characterSlug, option.trim(), ladderOrigin);
      }
    }

    for (const entry of punishment.opponentPunishes) {
      if (isSingleCommand(entry.punish)) {
        addReference(characterSlug, entry.punish, ladderOrigin);
      }

      // Their moves are not gated in the UI, so anything listed here is a live button.
      if (opponentSlug) {
        addReference(
          opponentSlug,
          entry.move,
          `app/tekken/punishment-data.ts › ${opponentName} punish chart`,
        );
      }
    }

    const profile = getOpponentProfile(opponentName);

    for (const threat of profile?.threats ?? []) {
      addReference(
        profile!.slug,
        threat.search,
        `app/tekken/opponent-profiles.ts › ${opponentName} signature moves`,
      );
    }
  }
}

async function mapWithConcurrency<Item, Result>(
  items: Item[],
  limit: number,
  worker: (item: Item) => Promise<Result>,
): Promise<Result[]> {
  const results = new Array<Result>(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index]);
      }
    }),
  );

  return results;
}

/**
 * Warms the memoised fetch with each character's move list before anything is resolved.
 * Without this a flaky roster request would read as "every move on this character is
 * broken" — the exact false alarm that would teach people to ignore the audit.
 */
async function loadMoveList(characterSlug: string): Promise<number> {
  try {
    // Same URL `resolveOkizemeCandidates` builds, so this populates the cache it reads.
    const response = await fetch(`${OKIZEME_API}/${characterSlug}`);

    if (!response.ok) {
      return 0;
    }

    const data: unknown = await response.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

type Finding = ClipReference & {
  reason: string;
  /** "gap" means correct notation okizeme has no video for, which is nobody's bug. */
  kind: "break" | "gap";
};

/**
 * Correct notation that okizeme simply has never filmed. These already degrade to the
 * guide's "Clip unavailable" card with a link to the move, so the audit lists them but
 * does not fail on them — a run that is red every time is a run nobody reads. Confirmed
 * 2026-09-05; delete an entry once okizeme films the clip and the audit says so.
 */
const KNOWN_MISSING_CLIPS = new Set([
  "clive::uf+2",
  "dragunov::PGR.2",
  "dragunov::PGR.3",
  "feng::ub+3",
  "king::b+1+2",
]);

function referenceKey(reference: ClipReference) {
  return `${reference.characterSlug}::${reference.search}`;
}

const args = process.argv.slice(2);
const verifyClips = !args.includes("--fast");

if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: npm run audit:clips [-- --fast]");
  process.exit(0);
}

for (const arg of args) {
  if (!["--fast", "--help", "-h"].includes(arg)) {
    setupErrors.push(`Unknown argument "${arg}".`);
  }
}

const allReferences = [...references.values()];
const characterSlugs = [...new Set(allReferences.map((reference) => reference.characterSlug))].sort();

console.log(
  `Auditing ${allReferences.length} clip references across ${characterSlugs.length} characters` +
    `${verifyClips ? "" : " (--fast: move keys only)"}…`,
);

const moveListSizes = new Map(
  (await mapWithConcurrency(characterSlugs, 6, async (slug) => [slug, await loadMoveList(slug)] as const)),
);

const unreachable = characterSlugs.filter((slug) => (moveListSizes.get(slug) ?? 0) === 0);
const auditable = allReferences.filter(
  (reference) => !unreachable.includes(reference.characterSlug),
);

const results = (
  await mapWithConcurrency(auditable, 6, async (reference): Promise<Finding | null> => {
    let candidates: string[] = [];

    try {
      candidates = await resolveOkizemeCandidates(reference.characterSlug, reference.search);
    } catch (error) {
      return { ...reference, kind: "break", reason: `lookup failed: ${(error as Error).message}` };
    }

    if (candidates.length === 0) {
      return { ...reference, kind: "break", reason: "no move on okizeme matches this notation" };
    }

    // Resolution ignores punctuation, so "ws2" landing on "ws+2" is the system working.
    // Falling back to a longer command is not: the clip plays, the guide looks fine, and
    // you are watching a different move — this is how Xiaoyu's "HYP.1" played "HYP.1+2".
    if (looseCommand(candidates[0]) !== looseCommand(reference.search)) {
      return {
        ...reference,
        kind: "break",
        reason: `plays "${candidates[0]}" instead — a different move`,
      };
    }

    if (!verifyClips) {
      return null;
    }

    // A key can match the notation and still have no clip filmed for it, and the route
    // walks past those, so the audit has to walk the same list before calling a break.
    for (const candidate of [...candidates, reference.search]) {
      if (await fetchOkizemePresignedUrl(reference.characterSlug, candidate)) {
        return null;
      }
    }

    return {
      ...reference,
      kind: "gap",
      reason: `resolves to "${candidates[0]}" but okizeme has no clip filmed for it`,
    };
  })
).filter((finding): finding is Finding => finding !== null);

const knownGaps = results.filter(
  (finding) => finding.kind === "gap" && KNOWN_MISSING_CLIPS.has(referenceKey(finding)),
);
const findings = results.filter((finding) => !knownGaps.includes(finding));

// An allowlist nobody prunes turns back into noise, so say when okizeme has caught up.
const auditedKeys = new Set(auditable.map(referenceKey));
const filledGaps = verifyClips
  ? [...KNOWN_MISSING_CLIPS].filter(
      (key) => auditedKeys.has(key) && !knownGaps.some((gap) => referenceKey(gap) === key),
    )
  : [];

console.log(
  `\n${allReferences.length} references · ${characterSlugs.length} characters · ` +
    `${findings.length} broken · ${knownGaps.length} known gaps`,
);

if (unreachable.length > 0) {
  console.log(`\nCould not load okizeme move lists for: ${unreachable.join(", ")}`);
  console.log(
    `Skipped ${allReferences.length - auditable.length} references on those characters — rerun before trusting this result.`,
  );
}

function report(title: string, group: Finding[]) {
  if (group.length === 0) {
    return;
  }

  console.log(`\n${title}`);

  for (const slug of characterSlugs) {
    const entries = group
      .filter((finding) => finding.characterSlug === slug)
      .sort((a, b) => a.search.localeCompare(b.search));

    if (entries.length === 0) {
      continue;
    }

    console.log(`\n  ${slug} (${entries.length})`);

    for (const finding of entries) {
      console.log(`    ${finding.search} — ${finding.reason}`);
      console.log(`      ${getOkizemeDatabaseUrl(slug, finding.search)}`);

      for (const origin of finding.origins.slice(0, 4)) {
        console.log(`      ${origin}`);
      }

      if (finding.origins.length > 4) {
        console.log(`      …and ${finding.origins.length - 4} more`);
      }
    }
  }

  console.log("");
}

report("BROKEN", findings);
report("KNOWN GAPS (okizeme has no clip; the guide shows its fallback card)", knownGaps);

if (filledGaps.length > 0) {
  console.log(
    `okizeme now has clips for ${filledGaps.join(", ")} — drop them from KNOWN_MISSING_CLIPS.\n`,
  );
}

if (setupErrors.length > 0) {
  console.log("Audit setup problems:");

  for (const problem of setupErrors) {
    console.log(`  ${problem}`);
  }

  console.log("");
}

if (findings.length === 0 && setupErrors.length === 0 && unreachable.length === 0) {
  console.log(
    knownGaps.length === 0
      ? "Every clip reference resolves."
      : "No new breaks — every reference resolves apart from the known gaps above.",
  );
}

process.exit(findings.length + setupErrors.length + unreachable.length > 0 ? 1 : 0);

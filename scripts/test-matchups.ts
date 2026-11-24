import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import type { GuideCharacterId } from "../app/tekken/punishment-data.ts";

registerHooks({ resolve(specifier, context, next) {
  if (context.parentURL && specifier.startsWith(".") && !specifier.endsWith(".ts") && existsSync(fileURLToPath(new URL(`${specifier}.ts`, context.parentURL)))) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });

const { TEKKEN_ROSTER, GUIDE_FIGHTERS, getMatchupNames } = await import("../app/tekken/matchup-roster.ts");
const { getOpponentProfile } = await import("../app/tekken/opponent-profiles.ts");
const { getOpponentSlug } = await import("../app/tekken/opponent-clips.ts");
const { getMatchupPunishment } = await import("../app/tekken/punishment-data.ts");

assert.equal(TEKKEN_ROSTER.length, 43, "Official playable roster snapshot: 2026-11-24");
assert.equal(new Set(TEKKEN_ROSTER).size, TEKKEN_ROSTER.length);
for (const guide of Object.keys(GUIDE_FIGHTERS) as GuideCharacterId[]) {
  const names = getMatchupNames(guide);
  const bases = names.map(name => name.replace(/ \(mirror\)$/u, ""));
  assert.deepEqual(bases, [...TEKKEN_ROSTER], `${guide}: missing/duplicated opponent`);
  assert.deepEqual(names.filter(name => name.endsWith(" (mirror)")), [`${GUIDE_FIGHTERS[guide]} (mirror)`]);
  assert.ok(names.includes(guide === "feng" ? "Feng (mirror)" : "Feng"), `${guide}: Feng regression`);
  const source = readFileSync(new URL(`../app/${guide}/${guide}-guide.tsx`, import.meta.url), "utf8");
  assert.ok(source.includes(`getMatchupNames("${guide}")`), `${guide}: must render the shared roster`);
  for (const name of names) {
    const profile = getOpponentProfile(name);
    assert.ok(profile?.gamePlan && profile.threats.length >= 3, `${guide}/${name}: missing briefing`);
    assert.equal(profile.slug, getOpponentSlug(name), `${guide}/${name}: wrong opponent clips`);
    const rows = getMatchupPunishment(guide, name).opponentPunishes;
    assert.ok(rows.length >= 4, `${guide}/${name}: missing punish data`);
    assert.ok(!rows.some(row => ["Blocked sweep", "Blocked launcher", "String ender"].includes(row.move)), `${name}: silently used generic fallback`);
  }
}
assert.equal(getOpponentSlug("Kuma"), "kuma");
assert.equal(getOpponentSlug("Panda"), "panda");
const roger = getMatchupPunishment("lars", "Roger Jr.").opponentPunishes;
assert.equal(roger.find(row => row.move === "db+4")?.crouching, undefined, "Roger db+4 is a mid");
assert.equal(roger.find(row => row.move === "db+3")?.crouching, true);
assert.equal(roger.find(row => row.move === "db+4")?.minus, 19);
assert.equal(getMatchupPunishment("lars", "Bob").opponentPunishes.find(row => row.move === "f,n,d,DF+4")?.minus, 28);
console.log(`Matchup coverage passed: ${Object.keys(GUIDE_FIGHTERS).length} guides × ${TEKKEN_ROSTER.length} fighters; one mirror each, correct clips and no generic punish fallback.`);

// Existing matchup clips must survive the provider spelling motions explicitly.
const { looseCommand, resolveOkizemeCandidates, fetchOkizemePresignedUrl } = await import("../lib/okizeme-clips.ts");
assert.equal(looseCommand("qcf+2"), looseCommand("d,df,f+2"));
assert.equal(looseCommand("qcb+2"), looseCommand("d,db,b+2"));
const savedFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => new Response(JSON.stringify([
    {command:"d,df,f+2"}, {command:"d,db,b+2"}, {command:"b+1,2"}, {command:"b+1+2"},
  ]));
  assert.deepEqual(await resolveOkizemeCandidates("fixture", "qcf+2"), ["d,df,f+2"]);
  assert.deepEqual(await resolveOkizemeCandidates("fixture", "qcb+2"), ["d,db,b+2"]);
  assert.deepEqual(await resolveOkizemeCandidates("fixture", "b+1+2"), ["b+1+2"]);
  const requested: string[] = [];
  globalThis.fetch = async (input, init) => {
    requested.push(String(input));
    assert.equal(init?.cache, "no-store", "Signed URLs must never be cached");
    return new Response(JSON.stringify(String(input).endsWith("qcb%2B3") ? {presignedUrl:"https://example.com/test-clip"} : {}));
  };
  assert.equal(await fetchOkizemePresignedUrl("fixture", "d,db,b+3"), "https://example.com/test-clip");
  assert.equal(requested.length, 2, "Only the equivalent quarter-circle storage alias may be tried");
} finally { globalThis.fetch = savedFetch; }

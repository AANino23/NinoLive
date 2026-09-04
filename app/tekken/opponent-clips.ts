import type { GuideCharacterId } from "./punishment-data";

/** okizeme.gg database slugs for every character the guides list as a matchup. */
export const OPPONENT_OKIZEME_SLUGS: Record<string, string> = {
  Alisa: "alisa",
  Anna: "anna",
  "Armor King": "armor-king",
  Asuka: "asuka",
  Azucena: "azucena",
  Bryan: "bryan",
  Claudio: "claudio",
  Clive: "clive",
  "Devil Jin": "devil-jin",
  Dragunov: "dragunov",
  Eddy: "eddy",
  Fahkumram: "fahkumram",
  Feng: "feng",
  Heihachi: "heihachi",
  Hwoarang: "hwoarang",
  "Jack-8": "jack-8",
  Jin: "jin",
  Jun: "jun",
  Kazuya: "kazuya",
  King: "king",
  "Kuma / Panda": "kuma",
  Kunimitsu: "kunimitsu",
  Lars: "lars",
  Law: "law",
  Lee: "lee",
  Leo: "leo",
  Leroy: "leroy",
  Lidia: "lidia",
  Lili: "lili",
  "Miary Zo": "miary-zo",
  Nina: "nina",
  Paul: "paul",
  Raven: "raven",
  Reina: "reina",
  Shaheen: "shaheen",
  Steve: "steve",
  Victor: "victor",
  Xiaoyu: "xiaoyu",
  Yoshimitsu: "yoshimitsu",
  Zafina: "zafina",
};

/** okizeme.gg slug for the character each guide is written for. */
export const GUIDE_OKIZEME_SLUGS: Record<GuideCharacterId, string> = {
  steve: "steve",
  feng: "feng",
  ling: "xiaoyu",
  dragunov: "dragunov",
  fahkumram: "fahkumram",
  kazuya: "kazuya",
};

/** Matchup lists label the player's own character "X (mirror)". */
function baseOpponentName(name: string) {
  return name.replace(/\s*\(mirror\)$/u, "").trim();
}

export function getOpponentSlug(name: string): string | null {
  return OPPONENT_OKIZEME_SLUGS[baseOpponentName(name)] ?? null;
}

/**
 * Move labels carry a readable move name — "db+4 (Deep Web)" — but a clip lookup only
 * wants the notation.
 */
export function getMoveClipSearch(move: string): string {
  return move.replace(/\s*\([^)]*\)\s*$/u, "").trim();
}

/** True when a notation string is a single command a clip can be looked up for. */
export function isSingleCommand(notation: string): boolean {
  const search = getMoveClipSearch(notation);
  return search.length > 0 && !/[/]|\s/u.test(search);
}

export function getOkizemeDatabaseUrl(slug: string, search: string) {
  return `https://okizeme.gg/database/${slug}?search=${encodeURIComponent(search)}`;
}

/** Reverse lookup for the clip player header, so it can say whose move is on screen. */
const OKIZEME_DISPLAY_NAMES: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(OPPONENT_OKIZEME_SLUGS).map(([name, slug]) => [slug, name]),
  ),
  kuma: "Kuma",
};

export function getOkizemeDisplayName(slug: string): string | null {
  return OKIZEME_DISPLAY_NAMES[slug] ?? null;
}

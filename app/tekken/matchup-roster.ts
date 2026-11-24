import type { GuideCharacterId } from "./punishment-data";

/** Official playable roster checked 2026-11-24, including Roger Jr.
 * https://tekken.com/fighters — Yujiro Hanma is scheduled for 2027.
 * Keep Kuma and Panda separate so either opponent can be found by name.
 */
export const TEKKEN_ROSTER = [
  "Alisa", "Anna", "Armor King", "Asuka", "Azucena", "Bob", "Bryan",
  "Claudio", "Clive", "Devil Jin", "Dragunov", "Eddy", "Fahkumram", "Feng",
  "Heihachi", "Hwoarang", "Jack-8", "Jin", "Jun", "Kazuya", "King", "Kuma",
  "Kunimitsu", "Lars", "Law", "Lee", "Leo", "Leroy", "Lidia", "Lili",
  "Miary Zo", "Nina", "Panda", "Paul", "Raven", "Reina", "Roger Jr.",
  "Shaheen", "Steve", "Victor", "Xiaoyu", "Yoshimitsu", "Zafina",
] as const;

export const GUIDE_FIGHTERS: Record<GuideCharacterId, string> = {
  alisa: "Alisa", bryan: "Bryan", dragunov: "Dragunov", fahkumram: "Fahkumram",
  feng: "Feng", kazuya: "Kazuya", lars: "Lars", law: "Law", ling: "Xiaoyu",
  steve: "Steve", victor: "Victor",
  roger: "Roger Jr.",
};

export function getMatchupNames(guide: GuideCharacterId): string[] {
  return TEKKEN_ROSTER.map(name => name === GUIDE_FIGHTERS[guide] ? `${name} (mirror)` : name);
}

/** Existing bear notes remain shared; clips use each bear's own database. */
export function getMatchupDataName(name: string): string {
  const base = name.replace(/\s*\(mirror\)$/u, "").trim();
  return base === "Kuma" || base === "Panda" ? "Kuma / Panda" : base;
}

type MatchupBriefing = {
  briefing: string; doThis: string[]; dodge: string[]; utilise: string[]; avoid: string[];
};

/** Shared opponent plans for newly filled slots; existing tailored notes win.
 * Bob/Roger commands and block frames: okizeme.gg/api/{bob,roger-jr},
 * checked 2026-11-24. These are baseline plans, not matchup-tested guarantees.
 */
export function getAdditionalMatchupBriefing(name: string): MatchupBriefing | null {
  switch (getMatchupDataName(name)) {
    case "Feng": return {
      briefing: "Make Feng commit before spending your turn. His evasive movement can make short attacks miss; approach behind guard, stop your string when he retreats, and punish the recovery you actually see.",
      doThis: ["Use short, controlled pressure instead of chasing his evasive retreat.", "Recognise the blocked move, then use your character's matching punish below."],
      dodge: ["Backdash to make committed attacks fall short, then punish their recovery.", "Check the specific move's tracking in practice before relying on a sidestep direction."],
      utilise: ["Mid checks when he tries to evade highs.", "Your whiff-punish tool after a confirmed miss, with wall position in mind."],
      avoid: ["Swinging a long string into a back-sway read.", "Treating every evasive move or stance entry as punishable."],
    };
    case "Bob": return {
      briefing: "Bob combines fast strings with crouch-dash approaches. Separate his safe mids from his punishable lows: df+2 is safe at -8, while the crouch-dash low f,n,d,DF+4 is -28 on block.",
      doThis: ["Block the whole df+1,2 elbow string, then take your i10 punish.", "On a blocked crouch-dash low, use the crouching punish ladder; do not try a standing launcher while still crouched."],
      dodge: ["Use movement to make an approach whiff, then confirm the miss before attacking.", "Identify the string before ducking; df+1,2 is mid-mid."],
      utilise: ["Reliable i12 crouching punishment against blocked db+3 or db+4.", "Short pressure and spacing rather than assuming his size makes him slow."],
      avoid: ["Trying to block-punish safe df+2 or uf+4.", "Guessing low every time he crouch-dashes toward you."],
    };
    case "Roger Jr.": return {
      briefing: "Roger Jr. mixes kicks and wrestling throws. Start by distinguishing his safe mid df+2 (-7) and plus-on-block headbutt b+1+2 (+1) from commitments such as uf+4 and 3,4 (both -13).",
      doThis: ["Take a fitting i13 standing punish after blocking uf+4 or the completed 3,4 string.", "Practise throw recognition and breaks separately from blocking the kick mixups."],
      dodge: ["Move outside the kick's reach before whiff-punishing; do not assume all kicks track the same way.", "Stand block the db+4 high-crushing mid; its low-looking animation is not a low."],
      utilise: ["Your crouching launch punish after the blocked db+3 low (-27).", "Your standing launch punish after blocked db+4 (-19), subject to range."],
      avoid: ["Mashing after the plus-on-block b+1+2 headbutt.", "Trying to block-punish safe df+2 or ducking every string."],
    };
    default: return null;
  }
}

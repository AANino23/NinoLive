"use client";

import { useMemo, useState } from "react";

type Clip = {
  label: string;
  search: string;
};

type Drill = {
  title: string;
  summary: string;
  why: string;
  drill: string;
  cues: string[];
  clips: Clip[];
};

type ToolCard = {
  move: string;
  role: string;
  when: string;
  risk: string;
  clip: Clip;
};

type ClipPack = {
  title: string;
  notes: string;
  clips: Clip[];
};

type Secret = {
  title: string;
  tag: string;
  copy: string;
  route: string;
  counter: string;
  clips: Clip[];
};

type Matchup = {
  name: string;
  briefing: string;
  doThis: string[];
  dodge: string[];
  utilise: string[];
  avoid: string[];
};

const tabs = [
  { id: "dojo", label: "Dojo", icon: "GF" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "Build the long-leg neutral",
    summary: "Fahkumram wins by making range 2 feel like range 0.",
    why: "His best fast checks are not normal Tekken jab tools. You need to own the space where 3, df+4, b+3, and uf+4 touch but most characters cannot comfortably answer.",
    drill:
      "For five minutes, play neutral using only 3, df+4, b+3, backdash, and sidestep. Your goal is to touch the opponent without entering jab range.",
    cues: [
      "Use standing 3 as the main 13-frame poke, not df+1.",
      "Use df+4 when you need reach and a Heat Engager threat.",
      "Use side step, not side walk; Fahkumram's sidewalk is weak.",
    ],
    clips: [
      { label: "Watch 3", search: "3" },
      { label: "Watch df+4", search: "df+4" },
      { label: "Watch b+3", search: "b+3" },
    ],
  },
  {
    title: "Garuda Force routing",
    summary: "The install is the difference between scary Fahkumram and honest Fahkumram.",
    why: "Garuda Force unlocks the Rama stance threat from charged kicks and makes the opponent respect guard-break routing instead of simply sidestepping every string.",
    drill:
      "Practice gaining Garuda from df+1,2, b+4,3,2, and f+3+4. After each install, immediately run one charged kick route into Rama, then back off and repeat.",
    cues: [
      "df+1,2 is the simple install route.",
      "b+4,3,2 rewards wall carries and heat routes.",
      "f+3+4 doubles as a panic tool and install check.",
    ],
    clips: [
      { label: "Watch df+1,2", search: "df+1,2" },
      { label: "Watch b+4,3,2", search: "b+4,3,2" },
      { label: "Watch f+3+4", search: "f+3+4" },
    ],
  },
  {
    title: "Rama stance mix discipline",
    summary: "Rama is not a random blender. It is a loaded guessing game.",
    why: "Once Garuda makes charged Tornado Kick or Erupting Knee force Rama on block, the opponent has to guess between mids, low, throw, and unblockable. The win comes from showing the boring answers first.",
    drill:
      "After entering Rama, rotate RAM 1, RAM 3,4, RAM 4, and RAM 1+3. Do not repeat the same option twice until you can explain what the opponent did last time.",
    cues: [
      "RAM 1 is the quick check.",
      "RAM 3,4 punishes crouchers and wall splats.",
      "RAM 1+3 is for opponents who freeze and wait.",
    ],
    clips: [
      { label: "Watch RAM 1", search: "RAM.1" },
      { label: "Watch RAM 3,4", search: "RAM.3,4" },
      { label: "Watch RAM 1+3", search: "RAM.1+3" },
    ],
  },
  {
    title: "Low risk audit",
    summary: "Fahkumram's lows are useful, but none of them are free.",
    why: "Every important low is at least -13 on block, with d+4 being launch-punishable. You use lows to make them stand still for mids, not as autopilot openers.",
    drill:
      "Play three rounds where each low must be preceded by two mid checks. Track whether the low landed because of conditioning or because you gambled.",
    cues: [
      "ff+3 is the chunky low idea, but it is punishable.",
      "d+4 is fast and annoying, but can get you killed.",
      "db+4 is a useful low poke when you have earned hesitation.",
    ],
    clips: [
      { label: "Watch d+4", search: "d+4" },
      { label: "Watch db+4", search: "db+4" },
      { label: "Watch 3+4", search: "3+4" },
    ],
  },
  {
    title: "Anti-step conditioning",
    summary: "Your strongest routes are linear until the opponent is trained not to move.",
    why: "Fahkumram's power comes with a movement tax: his best pressure can be stepped before they respect the tracking checks, lows, and delay timing.",
    drill:
      "Run 3,4~3 and 3,4~4 against a sidestepping dummy, then rotate b,f+4, 3+4, and delayed df+4 when they try to move.",
    cues: [
      "Do not run GRF f+2,1,2 into people already stepping.",
      "Use b,f+4 to scare armor and linear panic buttons.",
      "Delay your strings once they start stepping on rhythm.",
    ],
    clips: [
      { label: "Watch 3,4~3", search: "3,4~3" },
      { label: "Watch 3,4~4", search: "3,4~4" },
      { label: "Watch b,f+4", search: "b,f+4" },
    ],
  },
];

const gameplan = [
  {
    title: "Win the pre-fight before range 0 happens",
    copy:
      "Fahkumram does not need to stand next to people to start offense. Treat standing 3, df+4, b+3, and uf+4 as a wall of limbs. If they swing at the end of your range, their whiff should become your Heat Engager or install route.",
  },
  {
    title: "Install Garuda before forcing the casino",
    copy:
      "Without Garuda Force, your pressure is more honest and more steppable. With Garuda, charged Tornado Kick and Erupting Knee can force Rama stance on block, turning block pressure into a real 50/50. Earn the install first, then spend it deliberately.",
  },
  {
    title: "Make step scary before using linear pressure",
    copy:
      "Fahkumram has big tracking tools, but his famous power strings are still vulnerable if the opponent is already looking for them. Show b,f+4, 3+4, lows, and delayed timing before you lean on GRF f+2,1,2 or charged kick routes.",
  },
  {
    title: "Play turn-based unless the frames are real",
    copy:
      "Many of Fahkumram's safe mids give up the turn. That is fine if you are at the right range. Do not mash like a plus-frame character after every blocked poke; reset the spacing, let them whiff, then crush the next choice.",
  },
  {
    title: "Spend heat on momentum, not panic",
    copy:
      "Heat gives Garuda access and makes your guard-break pressure much harder to ignore. Use it to force Rama decisions near the wall or after a read, not as a panic burst after you have already lost the spacing battle.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "3",
    role: "Main fast poke",
    when: "Use it as your default range poke and string starter. This replaces the normal df+1 role for Fahkumram.",
    risk: "The follow-ups can be ducked or stepped if you become robotic.",
    clip: { label: "Play 3", search: "3" },
  },
  {
    move: "df+4",
    role: "Long-range Heat Engager",
    when: "Use it to catch whiffs and make opponents respect your reach.",
    risk: "Linear timing gets stepped if you throw it without conditioning.",
    clip: { label: "Play df+4", search: "df+4" },
  },
  {
    move: "df+1,2",
    role: "Simple Garuda route",
    when: "Use it when you need a straightforward way into Garuda Force.",
    risk: "df+1 is slower than normal; do not treat it like a universal jab-range poke.",
    clip: { label: "Play df+1,2", search: "df+1,2" },
  },
  {
    move: "b,f+4",
    role: "Armor-break wall threat",
    when: "Use it to punish armor habits, catch people standing still, and threaten huge momentum.",
    risk: "It is a high. Strong players will duck-launch it if you telegraph it.",
    clip: { label: "Play b,f+4", search: "b,f+4" },
  },
  {
    move: "f+3+4",
    role: "Power-crush install check",
    when: "Use it as a panic layer and a way to make people respect your turn under pressure.",
    risk: "Worse frames and slower startup mean it loses hard to patience and punishment.",
    clip: { label: "Play f+3+4", search: "f+3+4" },
  },
  {
    move: "3,4~3 / 3,4~4",
    role: "Charged kick pressure",
    when: "Use after Garuda to threaten guard-break routing into Rama.",
    risk: "The sequence is steppable if they have not been conditioned.",
    clip: { label: "Play 3,4~3", search: "3,4~3" },
  },
  {
    move: "RAM 1 / RAM 3,4",
    role: "Rama stance core",
    when: "Use RAM 1 to check impatience and RAM 3,4 to beat crouchers or wall-splat.",
    risk: "Rama loses value if you always pick the biggest-looking option.",
    clip: { label: "Play RAM 3,4", search: "RAM.3,4" },
  },
  {
    move: "RAM 1+3",
    role: "Freeze punish",
    when: "Use when the opponent has stopped pressing after charged-kick pressure.",
    risk: "Throws lose hard to ducks and jumpy panic if overused.",
    clip: { label: "Play RAM 1+3", search: "RAM.1+3" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Neutral limb pack",
    notes:
      "The buttons that teach opponents they cannot casually walk into Fahkumram's range.",
    clips: [
      { label: "3", search: "3" },
      { label: "df+4", search: "df+4" },
      { label: "b+3", search: "b+3" },
      { label: "uf+4", search: "uf+4" },
    ],
  },
  {
    title: "Garuda install pack",
    notes:
      "Review these when your offense feels honest and you are not reaching the scary part of the character often enough.",
    clips: [
      { label: "df+1,2", search: "df+1,2" },
      { label: "b+4,3,2", search: "b+4,3,2" },
      { label: "f+3+4", search: "f+3+4" },
    ],
  },
  {
    title: "Rama mix pack",
    notes:
      "Once Garuda forces Rama, these are the options the opponent is actually afraid of.",
    clips: [
      { label: "RAM 1", search: "RAM.1" },
      { label: "RAM 2", search: "RAM.2" },
      { label: "RAM 3,4", search: "RAM.3,4" },
      { label: "RAM 4", search: "RAM.4" },
      { label: "RAM 1+3", search: "RAM.1+3" },
    ],
  },
  {
    title: "Risk reminder pack",
    notes:
      "These tools are powerful, but they are also where good opponents start taking rounds from bad Fahkumrams.",
    clips: [
      { label: "d+4", search: "d+4" },
      { label: "db+4", search: "db+4" },
      { label: "b,f+4", search: "b,f+4" },
      { label: "df+2,3", search: "df+2,3" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Standing 3 is your real df+1",
    tag: "Core identity",
    copy:
      "Most characters build neutral around df+1. Fahkumram's df+1 is slower, so standing 3 becomes the real fast-range check. The follow-ups force the opponent to decide whether to stand, duck, challenge, or step.",
    route:
      "Use raw 3 first. Then rotate 3,1 for the mid-high check, 3,4 if they duck, and charged 3,4 routes once Garuda is active.",
    counter:
      "If they start stepping the follow-ups, stop finishing strings and check them with b,f+4, 3+4, or delayed df+4.",
    clips: [
      { label: "3", search: "3" },
      { label: "3,1", search: "3,1" },
      { label: "3,4", search: "3,4" },
    ],
  },
  {
    title: "Garuda makes block pressure real",
    tag: "Install rule",
    copy:
      "The scary Fahkumram is the Garuda Fahkumram. With Garuda, fully charged Tornado Kick or Erupting Knee routes can force Rama even on block, which means your opponent is no longer simply blocking a string; they are entering a stance mix.",
    route:
      "Gain Garuda with df+1,2, b+4,3,2, f+3+4, a successful parry route, or heat. Then threaten charged kick into RAM 1, RAM 3,4, RAM 4, RAM 1+3, or RAM 2.",
    counter:
      "If they step before the charge completes, shorten the string and punish the movement instead of insisting on the full route.",
    clips: [
      { label: "df+1,2", search: "df+1,2" },
      { label: "3,4~3", search: "3,4~3" },
      { label: "RAM 4", search: "RAM.4" },
    ],
  },
  {
    title: "GRF f+2,1,2 is a privilege, not a habit",
    tag: "Frame trap",
    copy:
      "The final hit of the Garuda f+2,1,2 route is plus if they sit still, which makes it a nasty frame trap. The catch is simple: players who know the matchup will sidestep before the privilege arrives.",
    route:
      "Use it after you have already shown tracking and delayed checks. If they block all three hits, take the +2 and play small with 3 or movement instead of swinging huge.",
    counter:
      "If they step it once, believe them. Rebuild with neutral checks before running it again.",
    clips: [
      { label: "f+2,1", search: "2,3" },
      { label: "3+4", search: "3+4" },
      { label: "df+4", search: "df+4" },
    ],
  },
  {
    title: "Your lows are for discipline, not robbery",
    tag: "Risk control",
    copy:
      "Fahkumram's low game is scarier because of his mids, not because the lows are safe. Every meaningful low is punishable, and d+4 can get you launched.",
    route:
      "Use lows after the opponent has stood still for 3, df+4, or Rama mids. The low should be the bill they pay for respecting your limbs.",
    counter:
      "If they start blocking low, stop immediately and cash out with mids or Rama 3,4.",
    clips: [
      { label: "d+4", search: "d+4" },
      { label: "db+4", search: "db+4" },
      { label: "RAM 3,4", search: "RAM.3,4" },
    ],
  },
];

const matchupNames = [
  "Alisa",
  "Anna",
  "Armor King",
  "Asuka",
  "Azucena",
  "Bryan",
  "Claudio",
  "Clive",
  "Devil Jin",
  "Dragunov",
  "Eddy",
  "Fahkumram (mirror)",
  "Feng",
  "Heihachi",
  "Hwoarang",
  "Jack-8",
  "Jin",
  "Jun",
  "Kazuya",
  "King",
  "Kuma / Panda",
  "Kunimitsu",
  "Lars",
  "Law",
  "Lee",
  "Leo",
  "Leroy",
  "Lidia",
  "Lili",
  "Miary Zo",
  "Nina",
  "Paul",
  "Raven",
  "Reina",
  "Shaheen",
  "Steve",
  "Victor",
  "Xiaoyu",
  "Yoshimitsu",
  "Zafina",
] as const;

const matchupOverrides: Partial<Record<(typeof matchupNames)[number], Partial<Matchup>>> = {
  Alisa: {
    briefing:
      "She wants to move, poke, and then cash out with chainsaws. Keep her at the end of your limbs and do not press blindly into DES.",
    dodge: [
      "Step her linear rocket approaches and punish the landing.",
      "Block chainsaws first; challenge only after the sequence is identified.",
    ],
    avoid: [
      "Do not chase her backdash with slow lows.",
      "Do not jab into chainsaw pressure without knowing the gap.",
    ],
  },
  Asuka: {
    briefing:
      "Her parries are built to annoy strike-heavy characters, but Fahkumram can lean on kicks, knees, lows, throws, and delayed timing.",
    utilise: [
      "Use b,f+4 and knee/kick-heavy pressure to make parry attempts look foolish.",
      "Throw once she starts waiting for parry timings.",
    ],
    avoid: [
      "Do not run predictable punch strings into reversal.",
      "Do not swing after her panic buttons unless you have checked the frames.",
    ],
  },
  Bryan: {
    briefing:
      "Do not fight Bryan from his ideal kick range. Either outrange him with clean limb checks or force him to block Garuda pressure at the wall.",
    doThis: [
      "Punish snake edge and hatchet-style lows hard on block.",
      "Make him whiff keepout, then answer with df+4 or b+3.",
    ],
    avoid: [
      "Do not trade counter-hit buttons at his range.",
      "Do not press after his obvious plus-frame tools.",
    ],
  },
  Clive: {
    briefing:
      "This is a range war, and he owns the sword range. Win by staying just outside his committed swings, then forcing him to defend once you are in.",
    doThis: [
      "Advance behind block and make his sword pokes whiff with small steps.",
      "Use heat/Garuda to skip neutral once you get a chance.",
    ],
    avoid: [
      "Do not poke at sword tip range.",
      "Do not spend Garuda too early before you have him cornered.",
    ],
  },
  Dragunov: {
    briefing:
      "He wants plus frames and repeated turns. Fahkumram wins by respecting real plus frames, then making Dragunov walk back into range 3.",
    doThis: [
      "Step running approaches and punish the recovery.",
      "Use 3 and df+4 after his turn actually ends.",
    ],
    avoid: [
      "Do not mash after wr pressure.",
      "Do not let him push you to the wall for free.",
    ],
  },
  Eddy: {
    briefing:
      "Treat Eddy stances with mids and patience. Your range is good enough to hit him out of transitions, but highs and lazy strings will whiff.",
    doThis: [
      "Use df+4, 3+4, and Rama mids against low stances.",
      "Punish stance lows when blocked instead of freezing.",
    ],
    avoid: [
      "Do not high-check negativa or handstand habits.",
      "Do not panic at movement; let him finish and punish.",
    ],
  },
  "Fahkumram (mirror)": {
    briefing:
      "The mirror is a range and Garuda discipline test. The worse Fahkumram spends lows and charged routes early; the better one makes step scary first, then forces Rama when the wall is close.",
    doThis: [
      "Side step, not sidewalk, against obvious 3 and df+4 timings.",
      "Punish lows hard; every meaningful low is at least -13.",
    ],
    dodge: [
      "Step before charged routes complete if he has not conditioned you.",
      "Duck b,f+4 only on a read, then launch the high.",
    ],
    utilise: [
      "3, df+4, and b+3 to keep him from freely installing.",
      "Rama 1 and RAM 3,4 before showing throw in the mirror.",
    ],
    avoid: [
      "Do not run GRF pressure on autopilot into step.",
      "Do not low check out of fear; the mirror punishes bad lows brutally.",
    ],
  },
  Feng: {
    briefing:
      "Feng is the anti-overextension character. Play shorter than usual, punish his big risks, and do not let kenpo bait your linear power moves.",
    doThis: [
      "Use single-hit pokes and delayed checks.",
      "Punish shoulder/sweep risks every time.",
    ],
    avoid: [
      "Do not autopilot charged routes into kenpo.",
      "Do not whiff b,f+4 where he can duck-launch.",
    ],
  },
  Hwoarang: {
    briefing:
      "His pressure is real until you label the high kick routes. Fahkumram's long mids interrupt him well, but panic pressing feeds flamingo.",
    dodge: [
      "Duck known high kick strings and launch.",
      "Backdash out of flamingo range when your turn is unclear.",
    ],
    utilise: [
      "Use f+3+4 to call out over-eager kick pressure.",
      "Use 3 and df+4 to interrupt stance entries.",
    ],
  },
  "Jack-8": {
    briefing:
      "Big body versus big body. Your range is excellent, but Jack's punishment and long arms make sloppy limb swings expensive.",
    doThis: [
      "Step his linear arm pokes and punish the recovery.",
      "Force Rama at the wall; he cannot sidestep well there.",
    ],
    avoid: [
      "Do not trade single hits from his best range.",
      "Do not crouch without a read; his mids hurt too much.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. Fahkumram can make the approach miserable, but one knockdown turns the round into a coin flip.",
    doThis: [
      "Tax crouch dash with 3, df+4, and b+3.",
      "Launch blocked hellsweep without hesitation.",
    ],
    avoid: [
      "Do not freeze at wavedash range.",
      "Do not spend all your time backing up; eventually the wall gives him the mix.",
    ],
  },
  King: {
    briefing:
      "Your limbs beat his approach, but throws beat blocking. Make King walk through range 3, then prove you can break throws.",
    dodge: [
      "Duck command grabs on hard reads, not randomly.",
      "Step Jaguar Sprint approaches and punish.",
    ],
    utilise: [
      "Use long mids to stop him entering throw range.",
      "Use lows sparingly once he over-stands for throw breaks.",
    ],
  },
  Kunimitsu: {
    briefing:
      "Season 3 Kunimitsu is a speed and misdirection test. Do not chase teleports or kunai movement; hold space, block first, then make her run into long mids.",
    doThis: [
      "Hold centre stage and let her re-enter your 3/df+4 range.",
      "Punish blocked flip and teleport follow-ups once identified.",
    ],
    dodge: [
      "Step linear dash-ins, but do not chase after teleports.",
      "Use fast mids when she tries to scramble low-profile movement.",
    ],
    utilise: [
      "3, df+4, and 3+4 to occupy the space she wants to dart through.",
      "Rama pressure at the wall; her mobility matters much less there.",
    ],
    avoid: [
      "Do not swing at where she was.",
      "Do not overuse slow charged routes before she is pinned.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants you to become predictable into parry. Fahkumram can make this awkward with kicks, knees, throws, and staggered strings.",
    utilise: [
      "Use b,f+4, lows, throws, and delayed kick strings to attack parry timing.",
      "Force him to block charged Garuda routes instead of letting him wait.",
    ],
    avoid: [
      "Do not repeat the same string timing.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with limbs, then smother her back when she finally has to defend.",
    doThis: [
      "Use 3 and df+4 to stop sidestep approach.",
      "Fight hard for centre stage; her wall pressure is the danger.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her sidestep around your linear strings for free.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block long mids, punish his lows, and do not give him predictable high timings.",
    doThis: [
      "Use df+4, 3+4, and Rama mids to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Step-left duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    avoid: [
      "Do not feed b+1 with predictable retaliation.",
      "Do not throw b,f+4 on autopilot; he will duck-launch highs.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Fahkumram must play mid-first and use his long legs to tag her before the scramble starts.",
    doThis: [
      "Use df+4, 3+4, and Rama mids against AOP.",
      "Keep her at range 1-2, where your legs hit and her scramble is slower.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not chase backturn; wait for the return option.",
    ],
  },
  Zafina: {
    briefing:
      "Like Xiaoyu, Zafina low-profiles highs and wins with stance unfamiliarity. Mid discipline and block punishment carry the matchup.",
    doThis: [
      "Use mids and lows that touch mantis/tarantula positions.",
      "Punish stance lows on block every time.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not chase her stance retreats with slow linear moves.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> = Object.fromEntries(
  matchupNames.map((name) => [
    name,
    {
      name,
      briefing: `${name} is a loading-screen fundamentals check for Fahkumram: hold the long range, make them respect 3 and df+4, then spend Garuda only once they are blocking instead of moving.`,
      doThis: [
        "Start with range control before forcing Rama.",
        "Use standing 3 and df+4 to stop approach attempts.",
      ],
      dodge: [
        "Side step committed linear pressure, but avoid long sidewalks.",
        "Backdash after your safe mids instead of stealing turns blindly.",
      ],
      utilise: [
        "Garuda Force near the wall where movement is worse.",
        "Rama 1 and Rama 3,4 before showing throw or unblockable.",
      ],
      avoid: [
        "Do not autopilot charged routes before conditioning step.",
        "Do not rely on lows; every important low is punishable.",
      ],
    },
  ]),
) as Record<(typeof matchupNames)[number], Matchup>;

const matchups: Matchup[] = matchupNames.map((name) => ({
  ...defaultMatchups[name],
  ...(matchupOverrides[name] ?? {}),
  name,
}));

function getOkizemeUrl(search: string) {
  return `https://okizeme.gg/database/fahkumram?search=${encodeURIComponent(search)}`;
}

function getClipUrl(search: string) {
  return `https://okizeme.b-cdn.net/fahkumram/${encodeURIComponent(search)}.mp4`;
}

function getClipTitle(label: string) {
  return label.replace(/^Watch\s+/u, "").replace(/^Play\s+/u, "");
}

function ClipButton({
  clip,
  clipKey,
  activeClipKey,
  onPlay,
}: {
  clip: Clip;
  clipKey: string;
  activeClipKey: string | null;
  onPlay: (clipKey: string, clip: Clip) => void;
}) {
  const isActive = activeClipKey === clipKey;

  return (
    <button
      type="button"
      onClick={() => onPlay(clipKey, clip)}
      className={`rounded-full border px-3 py-2 text-sm transition ${
        isActive
          ? "border-orange-300 bg-orange-300 text-slate-950"
          : "border-orange-400/35 text-orange-200 hover:border-orange-300 hover:text-white"
      }`}
    >
      {clip.label}
    </button>
  );
}

function ClipPlayer({
  activeClip,
}: {
  activeClip: { clipKey: string; clip: Clip } | null;
}) {
  if (!activeClip) {
    return (
      <aside className="sticky top-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm leading-7 text-slate-400">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
          Video player
        </p>
        <p className="mt-3">
          Pick any clip button and the okizeme.gg video will open here.
        </p>
      </aside>
    );
  }

  return (
    <aside className="sticky top-6 overflow-hidden rounded-3xl border border-orange-300/25 bg-black">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
            Clip
          </p>
          <h3 className="mt-1 text-sm font-semibold text-white">
            {getClipTitle(activeClip.clip.label)}
          </h3>
        </div>
        <a
          href={getOkizemeUrl(activeClip.clip.search)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-orange-400/60 hover:text-white"
        >
          Full move card
        </a>
      </div>
      <video
        key={activeClip.clipKey}
        className="aspect-video w-full"
        controls
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={getClipUrl(activeClip.clip.search)}
      >
        Your browser does not support embedded video playback.
      </video>
    </aside>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
        {copy}
      </p>
    </div>
  );
}

export function FahkumramGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("dojo");
  const [activeClip, setActiveClip] = useState<{
    clipKey: string;
    clip: Clip;
  } | null>(null);
  const [activeMatchupName, setActiveMatchupName] = useState<string | null>(
    null,
  );

  const activeClipKey = activeClip?.clipKey ?? null;
  const activeMatchup = useMemo(
    () => matchups.find((matchup) => matchup.name === activeMatchupName) ?? null,
    [activeMatchupName],
  );

  function playClip(clipKey: string, clip: Clip) {
    setActiveClip((currentClip) =>
      currentClip?.clipKey === clipKey ? null : { clipKey, clip },
    );
  }

  const activeCopy = useMemo(() => {
    switch (activeTab) {
      case "dojo":
        return "Daily drills for turning Fahkumram's range, Garuda install, and Rama stance into muscle memory.";
      case "gameplan":
        return "How the round should flow: claim space, gain Garuda, then force a real Rama decision near the wall.";
      case "toolkit":
        return "The moves that make Fahkumram function, with what they are for and how they get you punished.";
      case "clips":
        return "Embedded okizeme.gg clips for Fahkumram's key pokes, install routes, and Rama stance threats.";
      case "secrets":
        return "The high-value habits: using 3 as your real df+1, spending Garuda correctly, and not donating rounds with lows.";
      case "matchups":
        return "Pick a character for a quick Fahkumram loading-screen briefing.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-10 space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/30 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
          Tekken 8
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Fahkumram Muay Thai Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Fahkumram is a range bully with explosive install pressure. This
              guide focuses on the parts that actually win games: long-leg
              neutral, Garuda Force discipline, Rama stance routing, and knowing
              when not to gamble.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 text-sm text-orange-100">
            Focus: range, Garuda Force, Rama stance, wall pressure
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-2 shadow-inner shadow-black/30 sm:grid-cols-2 lg:grid-cols-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveClip(null);
                }}
                className={`group rounded-2xl border p-3 text-left transition ${
                  isActive
                    ? "border-orange-300/70 bg-orange-300 text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-orange-300/40 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[0.7rem] font-black tracking-[0.16em] ${
                      isActive
                        ? "border-slate-950/20 bg-slate-950/10 text-slate-950"
                        : "border-orange-300/25 bg-orange-300/10 text-orange-200"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {tab.label}
                    </span>
                    <span
                      className={`mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${
                        isActive ? "text-slate-800" : "text-slate-500"
                      }`}
                    >
                      {isActive ? "Selected" : "Open tab"}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">
          {activeCopy}
        </p>
      </section>

      {activeTab === "dojo" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Dojo"
            title="Daily Fahkumram drills"
            copy="Run these as isolated reps. Fahkumram gets much stronger when you stop treating him like a generic big-body brawler and start controlling the exact ranges his limbs own."
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5">
              {dojoDrills.map((drill) => (
                <article
                  key={drill.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {drill.summary}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    <span className="font-medium text-slate-200">Why:</span>{" "}
                    {drill.why}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    <span className="font-medium text-slate-200">Drill:</span>{" "}
                    {drill.drill}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                    {drill.cues.map((cue) => (
                      <li
                        key={cue}
                        className="rounded-2xl bg-slate-950/60 px-3 py-2"
                      >
                        {cue}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {drill.clips.map((clip) => (
                      <ClipButton
                        key={`${drill.title}-${clip.search}`}
                        clip={clip}
                        clipKey={`dojo-${drill.title}-${clip.search}`}
                        activeClipKey={activeClipKey}
                        onPlay={playClip}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <ClipPlayer activeClip={activeClip} />
          </div>
        </section>
      ) : null}

      {activeTab === "gameplan" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Gameplan"
            title="How Fahkumram should feel"
            copy="The opponent should feel like they are losing before they are close enough to play their normal Tekken. Then, once they finally respect the range, Garuda turns their block into a guessing game."
          />
          <div className="grid gap-4">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "toolkit" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Toolkit"
            title="The tools doing the real damage"
            copy="These are the moves to review when your Fahkumram feels linear, slow, or too risky. Each one has a purpose and a way it gets you killed."
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5 md:grid-cols-2">
              {toolkit.map((tool) => (
                <article
                  key={tool.move}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold text-white">
                      {tool.move}
                    </h3>
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    <span className="font-medium text-slate-200">When:</span>{" "}
                    {tool.when}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    <span className="font-medium text-slate-200">Risk:</span>{" "}
                    {tool.risk}
                  </p>
                </article>
              ))}
            </div>
            <ClipPlayer activeClip={activeClip} />
          </div>
        </section>
      ) : null}

      {activeTab === "clips" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Clips"
            title="Embedded Fahkumram clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5 lg:grid-cols-2">
              {clipPacks.map((pack) => (
                <article
                  key={pack.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {pack.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {pack.notes}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {pack.clips.map((clip) => (
                      <ClipButton
                        key={`${pack.title}-${clip.search}`}
                        clip={clip}
                        clipKey={`clips-${pack.title}-${clip.search}`}
                        activeClipKey={activeClipKey}
                        onPlay={playClip}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <ClipPlayer activeClip={activeClip} />
          </div>
        </section>
      ) : null}

      {activeTab === "secrets" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Secrets"
            title="The things that make Fahkumram unfair"
            copy="The character becomes much scarier when you understand what the opponent is trying to do against him: step early, duck highs, punish lows, and wait out fake pressure."
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5 lg:grid-cols-2">
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-orange-400/15 bg-white/5 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {secret.copy}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    <span className="font-medium text-slate-200">Route:</span>{" "}
                    {secret.route}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    <span className="font-medium text-slate-200">
                      If they adapt:
                    </span>{" "}
                    {secret.counter}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {secret.clips.map((clip) => (
                      <ClipButton
                        key={`${secret.title}-${clip.search}`}
                        clip={clip}
                        clipKey={`secrets-${secret.title}-${clip.search}`}
                        activeClipKey={activeClipKey}
                        onPlay={playClip}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <ClipPlayer activeClip={activeClip} />
          </div>
        </section>
      ) : null}

      {activeTab === "matchups" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Matchups"
            title="Loading-screen briefings"
            copy="Current playable roster through Kunimitsu. Tap a character for a fast Fahkumram-specific plan."
          />
          <div className="flex flex-wrap gap-2">
            {matchups.map((matchup) => {
              const isSelected = activeMatchupName === matchup.name;

              return (
                <button
                  key={matchup.name}
                  type="button"
                  onClick={() =>
                    setActiveMatchupName(isSelected ? null : matchup.name)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "border-orange-300 bg-orange-300 text-slate-950"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-orange-300/60 hover:text-white"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <article className="rounded-3xl border border-orange-300/20 bg-slate-950/70 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                Fahkumram vs {activeMatchup.name}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {activeMatchup.briefing}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["Do this", activeMatchup.doThis, "text-emerald-300"],
                  ["How to dodge", activeMatchup.dodge, "text-sky-300"],
                  ["Utilise", activeMatchup.utilise, "text-amber-300"],
                  ["Do not", activeMatchup.avoid, "text-rose-300"],
                ].map(([title, items, colour]) => (
                  <div
                    key={title as string}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <h3
                      className={`text-xs font-semibold uppercase tracking-[0.3em] ${colour}`}
                    >
                      {title as string}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {(items as string[]).map((item) => (
                        <li
                          key={item}
                          className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm leading-7 text-slate-400">
              Pick a character and the briefing appears here.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

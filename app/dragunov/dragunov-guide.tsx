"use client";

import { useMemo, useState } from "react";
import { GuideClipSection } from "../tekken/guide-clip-layout";
import { MatchupPunishmentSection } from "../tekken/matchup-punishment";
import {
  MatchupBeatAdviceSection,
  MatchupOpponentProfileSection,
} from "../tekken/matchup-opponent-sections";
import { getOkizemeDatabaseUrl as getOpponentOkizemeUrl } from "../tekken/opponent-clips";
import {
  ClipButtonLabel,
  GuideTabGlyph,
  MoveNotation,
  NotationLegend,
  SectionHeading,
  StepBadge,
} from "../tekken/guide-ui";

const OKIZEME_CHARACTER = "dragunov";

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
  { id: "dojo", label: "Dojo", icon: "SNK" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "Freeze them with plus mids",
    summary: "Dragunov wins when the opponent stops pressing because every blocked mid feels like your turn.",
    why: "wr2, b+1+2, and SNK 4 are the freeze buttons. If you cannot land these cleanly, the rest of the mix never gets respect.",
    drill:
      "For five minutes, play only wr2, b+1+2, df+1, and backdash. After every blocked plus mid, wait one beat before choosing jab, throw, or another mid.",
    cues: [
      "Instant wr2 is the main approach and freeze tool.",
      "b+1+2 is the close plus mid that makes them sit still.",
      "SNK 4 is the long-range plus mid that also puts you in crouch.",
    ],
    clips: [
      { label: "Watch wr2", search: "f,f,F+2" },
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch SNK.4", search: "SNK.4" },
    ],
  },
  {
    title: "Build the poke backbone",
    summary: "Most Dragunov rounds are won by chipping, not by launching.",
    why: "1, df+1, and d+2 keep you in the driver's seat. The big mix only works after these buttons have already made the opponent hesitant.",
    drill:
      "Play three rounds using only 1, df+1, d+2, and movement. Track whether they start ducking, stepping, or swinging first.",
    cues: [
      "1 is one of the best jabs in the game; use the range.",
      "df+1 is the safe mid check and the setup for CH fishing.",
      "d+2 high-crushes and tracks, but it is not plus on hit.",
    ],
    clips: [
      { label: "Watch 1", search: "1" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch d+2", search: "d+2" },
    ],
  },
  {
    title: "Crouch mix after respect",
    summary: "Once they freeze, Dragunov becomes a 50/50 character from crouch.",
    why: "b+2, SNK 4, and wr2 all leave you plus enough to threaten FC df+1,4 versus ws3. That is the real open-up layer.",
    drill:
      "After every plus mid, enter crouch and rotate FC df+1,4, ws3, and ws4. Do not repeat the same option twice.",
    cues: [
      "FC df+1,4 is the long-range crouch low into Sneak.",
      "ws3 is the matching-speed mid that knocks down.",
      "ws4 is the safe while-standing poke if you do not want to gamble.",
    ],
    clips: [
      { label: "Watch b+2", search: "b+2" },
      { label: "Watch FC.df+1,4", search: "FC.df+1,4" },
      { label: "Watch ws3", search: "ws3" },
    ],
  },
  {
    title: "Sneak routing",
    summary: "Sneak is not a random dash. It is a loaded follow-up after confirmed hits and plus frames.",
    why: "2,1 on hit, f+3~df, and FC df+1,4 all put you in SNK with a real mix. The win is showing SNK 4 first, then SNK 2 and SNK 1 when they guess wrong.",
    drill:
      "Loop 2,1~df, f+3~df, and FC df+1,4 into SNK. From Sneak, rotate SNK 4, SNK 2, SNK 1, and SNK 3.",
    cues: [
      "SNK 4 is the plus mid Heat Engager.",
      "SNK 2 is the big mid launcher; do not throw it blind.",
      "SNK 1 is the safe high launcher, aka Dragunov's electric.",
    ],
    clips: [
      { label: "Watch 2,1", search: "2,1" },
      { label: "Watch SNK.4", search: "SNK.4" },
      { label: "Watch SNK.2", search: "SNK.2" },
    ],
  },
  {
    title: "Throw and tackle layer",
    summary: "A complete grab game is why turtles still lose to Dragunov.",
    why: "Plus frames without throws become a block contest. Plus frames with 1+2, 1+4, 2+3, and Heat tackles make standing still lethal.",
    drill:
      "After every blocked wr2 or b+1+2, rotate jab, throw, and another mid. In Heat, practice wr2 into 1+2 tackle instead of mashing a third poke.",
    cues: [
      "b+1+2 on hit guarantees the crouch throw.",
      "uf+1 is the damaging i14 high that also sets up throw.",
      "Heat makes several tackles unbreakable; spend it on that, not panic.",
    ],
    clips: [
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch uf+1", search: "uf+1" },
      { label: "Watch wr2", search: "f,f,F+2" },
    ],
  },
  {
    title: "Pigeon Roll wall oki",
    summary: "At the wall, Pigeon Roll turns knockdowns into a second guessing game.",
    why: "PGR.2 hits grounded and is a safe mid. PGR.3 is the launch-punishable sweep. The mix only works if you have already shown the boring grounded hit.",
    drill:
      "At the wall, knockdown, then rotate PGR.2, PGR.3, and wait-for-tech. Repeat until the three options feel visually similar.",
    cues: [
      "3+4 is the roll itself; use it to go under linear panic buttons.",
      "PGR.2 is the safe grounded mid.",
      "PGR.3 is the sweep; only throw it after they respect PGR.2.",
    ],
    clips: [
      { label: "Watch 3+4", search: "3+4" },
      { label: "Watch PGR.2", search: "PGR.2" },
      { label: "Watch PGR.3", search: "PGR.3" },
    ],
  },
  {
    title: "Counter-hit control",
    summary: "1,2,1 and b+4,2,1 are how Dragunov punishes impatience, not how he opens turtles.",
    why: "People mash after pokes. If you can hit-confirm 1,2,1 and delay b+4,2,1, you steal rounds without ever gambling a low.",
    drill:
      "Against a dummy set to mash after block, fish 1 into 1,2,1 and b+4 into b+4,2,1. Confirm the last hit; do not autopilot it.",
    cues: [
      "1,2,1 is an i10 CH wall-splatting Heat Engager string.",
      "b+4,3 tracks his strong side and wall-splats.",
      "The last hit of b+4,2,1 is a duckable high; delay it or mix with b+4,2.",
    ],
    clips: [
      { label: "Watch 1,2,1", search: "1,2,1" },
      { label: "Watch b+4,3", search: "b+4,3" },
      { label: "Watch b+4,2,1", search: "b+4,2,1" },
    ],
  },
];

const gameplan = [
  {
    title: "Chip first, freeze second",
    copy:
      "Dragunov is not a two-interaction character. Start with 1, df+1, d+2, and movement. Once they hesitate, cash that hesitation into wr2, b+1+2, or SNK 4.",
  },
  {
    title: "Plus frames are the mix, not the mix itself",
    copy:
      "Blocked wr2 and b+1+2 should feel like a menu: jab, throw, crouch low, or another mid. If you always pick the same follow-up, good players walk you.",
  },
  {
    title: "Make sidestep right expensive",
    copy:
      "Most of Dragunov's power is linear. Show d+2, b+3, db+2, and delayed timing before you lean on wr2 or SNK 4. If they are already walking right, the freeze buttons lose.",
  },
  {
    title: "Open turtles from crouch, not from panic lows",
    copy:
      "FC df+1,4 versus ws3 is the honest 50/50. db+3+4 is a power low for people who have already frozen. Do not open rounds with launch-punishable lows.",
  },
  {
    title: "Spend Heat on tackles and chip, not on panic",
    copy:
      "Heat makes Ambush Tackle routes unbreakable and turns pokes into chip tax. Use it after you already have plus frames or a wall, not as a reset after you lost spacing.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "1 / 1,2,1",
    role: "Jab and CH wall splat",
    when: "Use 1 as your default poke and 1,2,1 when you think they will mash after it.",
    risk: "The full string is launch-punishable if they sit still. Confirm the CH; do not throw it as a block string.",
    clip: { label: "Play 1,2,1", search: "1,2,1" },
  },
  {
    move: "df+1",
    role: "Main mid poke",
    when: "Use it to check, create pushback, and threaten df+1,4 if they start ducking.",
    risk: "The high extension is duckable. If they duck once, stop finishing it.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f,f,F+2",
    role: "Signature plus mid",
    when: "Use it to approach, freeze, and CH launch mashers. Instant wr2 is the real version.",
    risk: "Linear. Sidestep right and interruption beat it if you throw it without a reason.",
    clip: { label: "Play wr2", search: "f,f,F+2" },
  },
  {
    move: "d+2",
    role: "Tracking low poke",
    when: "Use it to high-crush, catch step, and force crouch. Pair it with wr2 so they cannot walk forever.",
    risk: "It is -13 on block and not plus on hit. Take your turn if they swing after it.",
    clip: { label: "Play d+2", search: "d+2" },
  },
  {
    move: "b+1+2",
    role: "Close freeze mid",
    when: "Use it after a jab or when they are already blocking. On hit it guarantees the crouch throw.",
    risk: "Slow enough to interrupt. Do not throw it as a raw panic button from minus frames.",
    clip: { label: "Play b+1+2", search: "b+1+2" },
  },
  {
    move: "SNK.4",
    role: "Long-range plus Heat Engager",
    when: "Use it from Sneak or qcf to push them back, enter crouch plus, and threaten wall mix.",
    risk: "Still linear. If they walk it, go back to d+2 and b+3 before repeating.",
    clip: { label: "Play SNK.4", search: "SNK.4" },
  },
  {
    move: "FC.df+1,4",
    role: "Crouch low into Sneak",
    when: "Use it after plus frames to open stand-blockers and enter SNK with advantage.",
    risk: "Do not mash the 4. If they start blocking low, switch to ws3 immediately.",
    clip: { label: "Play FC.df+1,4", search: "FC.df+1,4" },
  },
  {
    move: "b+4,3 / b+4,2",
    role: "Wall splat and duck mix",
    when: "Use b+4,3 to splat and track his strong side; use b+4,2 when they duck the high.",
    risk: "b+4,3 is a high follow-up. Good players will duck-launch it on a read.",
    clip: { label: "Play b+4,3", search: "b+4,3" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Freeze pack",
    notes: "The plus mids that make Dragunov feel unfair before any mix starts.",
    clips: [
      { label: "f,f,F+2", search: "f,f,F+2" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "SNK.4", search: "SNK.4" },
      { label: "d+1", search: "d+1" },
    ],
  },
  {
    title: "Poke pack",
    notes: "Small Tekken buttons that chip, track, and set up the later 50/50.",
    clips: [
      { label: "1", search: "1" },
      { label: "df+1", search: "df+1" },
      { label: "d+2", search: "d+2" },
      { label: "b+2", search: "b+2" },
      { label: "ws4", search: "ws4" },
    ],
  },
  {
    title: "Sneak pack",
    notes: "Review these when you are entering SNK but not cashing the mix.",
    clips: [
      { label: "2,1", search: "2,1" },
      { label: "SNK.1", search: "SNK.1" },
      { label: "SNK.2", search: "SNK.2" },
      { label: "SNK.3", search: "SNK.3" },
      { label: "SNK.4", search: "SNK.4" },
    ],
  },
  {
    title: "Wall and oki pack",
    notes: "The tools that steal rounds once their back is on the wall.",
    clips: [
      { label: "1,2,1", search: "1,2,1" },
      { label: "b+4,3", search: "b+4,3" },
      { label: "PGR.2", search: "PGR.2" },
      { label: "PGR.3", search: "PGR.3" },
      { label: "ws1+2", search: "ws1+2" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Instant wr2 is the real character",
    tag: "Core identity",
    copy:
      "Delayed running wr2 is the obvious version. Instant wr2 is the one that actually freezes people, chips in Heat, and CH launches mashers. If this button is sloppy, Dragunov feels honest.",
    route:
      "Practice the fastest f,f,F+2 from mid-range after plus pokes. On block, take the +4 and choose jab, throw, or crouch mix. On CH, combo.",
    counter:
      "If they sidestep right, stop throwing it raw. Check with d+2 or b+3, then wr2 again only after they stand still.",
    clips: [
      { label: "f,f,F+2", search: "f,f,F+2" },
      { label: "d+2", search: "d+2" },
      { label: "b+3", search: "b+3" },
    ],
  },
  {
    title: "1,2,1 is a get-off-me tool, not a block string",
    tag: "CH trap",
    copy:
      "The string is an i10 CH wall splat and Heat Engager. That is elite. It is also -14 if they just block it. Strong Dragunovs fish it after 1 or df+1; weak ones throw it as offense.",
    route:
      "Jab, wait for the mash, then 1,2,1. At the wall this becomes a round-ender. In Heat, ws1+2 is the even nastier i12 crouch punish.",
    counter:
      "If they stop mashing, go back to plus mids and throws. Do not keep finishing 1,2,1 into a launch punish.",
    clips: [
      { label: "1,2,1", search: "1,2,1" },
      { label: "df+1", search: "df+1" },
      { label: "ws1+2", search: "ws1+2" },
    ],
  },
  {
    title: "Crouch-cancel Sneak into real combos",
    tag: "Hidden execution",
    copy:
      "Moves like 2,1~df, 3,1~df, and FC df+1,4 leave you in Sneak. Cancelling the crouch dash with u~n is how optimal combos stay standing and keep wall carry. This is the lab secret that separates combo-complete Dragunov from poke-only Dragunov.",
    route:
      "From 2,1~df or FC df+1,4, tap u~n during the dash, then continue the combo. Practice the timing until the cancel is available at any point in the dash.",
    counter:
      "If the cancel is messy in match, take the simpler SNK 2 tornado route. Damage now beats dropped execution later.",
    clips: [
      { label: "2,1", search: "2,1" },
      { label: "FC.df+1,4", search: "FC.df+1,4" },
      { label: "SNK.2", search: "SNK.2" },
    ],
  },
  {
    title: "Heat tackles punish blocking, not pressing",
    tag: "Heat rule",
    copy:
      "Heat makes Feint & Catch and Ambush Tackle unbreakable from extra routes: wr2 1+2, b+4,2 1+2, FC df+1 1+2, and more. That means turtles get taxed even when they guess correctly on the throw break.",
    route:
      "Activate Heat after a knockdown or plus mid. Show one poke, then wr2 into tackle or b+4,2 into tackle. Keep chip running with 1 and df+1 between attempts.",
    counter:
      "If they start ducking or walking the tackle, interrupt with mids and ws3. The unbreakable throw is a layer, not a win button.",
    clips: [
      { label: "f,f,F+2", search: "f,f,F+2" },
      { label: "b+4,2,1+2", search: "b+4,2,1+2" },
      { label: "H.2+3", search: "H.2+3" },
    ],
  },
  {
    title: "d+2 is a trap for greedy Dragunovs",
    tag: "Frame secret",
    copy:
      "Everyone knows d+2 is annoying. Fewer people remember it is -1 on hit. If you swing after it, you are the one getting counter-hit. Good opponents take their turn here.",
    route:
      "Use d+2 to crush highs and catch step, then either backdash, throw, or go into a real plus mid. Save the CH follow-up for when they actually mash.",
    counter:
      "If they start pressing after every d+2, that is your 1,2,1 or wr2 turn, not another low.",
    clips: [
      { label: "d+2", search: "d+2" },
      { label: "1,2,1", search: "1,2,1" },
      { label: "f,f,F+2", search: "f,f,F+2" },
    ],
  },
  {
    title: "Pigeon Roll is AOP with teeth at the wall",
    tag: "Oki secret",
    copy:
      "3+4 and d+3+4 go under a surprising number of panic buttons, including some of Hwoarang and Bryan's favourite answers. At the wall, PGR.2 and PGR.3 become a real okizeme pair instead of a gimmick.",
    route:
      "Knock down at the wall, roll, then show PGR.2 until they respect it. Only then throw PGR.3 or wait and throw. If they press, the roll itself is the punish.",
    counter:
      "If they delay tech or backroll consistently, stop rolling on autopilot and just take the plus mid.",
    clips: [
      { label: "3+4", search: "3+4" },
      { label: "PGR.2", search: "PGR.2" },
      { label: "PGR.3", search: "PGR.3" },
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
  "Dragunov (mirror)",
  "Eddy",
  "Fahkumram",
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

const matchupOverrides: Partial<
  Record<(typeof matchupNames)[number], Partial<Matchup>>
> = {
  Alisa: {
    briefing:
      "She wants to leave and come back with chainsaws. Dragunov wins by keeping her in poke range and not swinging into DES.",
    doThis: [
      "Use d+2 and df+1 to stop her from freely floating out.",
      "Block chainsaws first, then punish the identified ender.",
    ],
    dodge: [
      "Sidestep her linear rocket approaches and launch the landing.",
      "Backdash after blocked DESTINY sequences instead of mashing.",
    ],
    utilise: [
      "wr2 when she hesitates after a blocked poke.",
      "Throws once she starts waiting for chainsaw timing.",
    ],
    avoid: [
      "Do not chase her backdash with SNK 2.",
      "Do not jab into chainsaw pressure without knowing the gap.",
    ],
  },
  Asuka: {
    briefing:
      "Parries and panic buttons punish greedy strings. Play small Tekken, then freeze her with plus mids she cannot parry on reaction.",
    doThis: [
      "Use kicks, d+2, and delayed wr2 to make parry attempts look late.",
      "Throw when she starts holding for reversal timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "b+3 and d+1 to beat punch parry habits.",
      "FC df+1,4 after she has frozen from plus frames.",
    ],
    avoid: [
      "Do not autopilot 1,2,1 into reversal.",
      "Do not finish b+4,3 on the same timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Do not take his kick-range CH bait. Dragunov can freeze Bryan, but one taunt or hatchet mistake swings the round.",
    doThis: [
      "Punish snake edge and hatchet on block every time.",
      "Use d+2 to crush highs and keep him from walking your wr2.",
    ],
    dodge: [
      "Sidestep right against raw wr2-style linear kicks of his own.",
      "Backdash after blocked plus frames; do not mash into taunt setups.",
    ],
    utilise: [
      "1,3 for far i10 punishes on moves with pushback like b+4.",
      "Pigeon Roll under some of his big mid answers at the wall.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw wr2 into a ready sidestep.",
    ],
  },
  Clive: {
    briefing:
      "Sword range beats lazy pokes. Get in behind block, freeze him, and do not play tip-range footsies.",
    doThis: [
      "Advance with movement and wr2 after he whiffs a committed swing.",
      "Use Heat tackles once you are actually in.",
    ],
    dodge: [
      "Step linear sword pokes and punish the recovery.",
      "Do not sidewalk forever; he will track the obvious walk.",
    ],
    utilise: [
      "d+2 and df+1 once you have closed the gap.",
      "Wall wr2 / SNK 4 where his sword pushback dies.",
    ],
    avoid: [
      "Do not poke at sword tip.",
      "Do not spend Heat while still stuck outside.",
    ],
  },
  "Dragunov (mirror)": {
    briefing:
      "The mirror is a plus-frame and step-right test. The worse Dragunov throws wr2 on cooldown; the better one chips, tracks, then freezes.",
    doThis: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Take your turn after blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Duck b+4,3 and 1,2,1 only on a read, then launch.",
      "Walk Heat tackles to the right when they are not meaty.",
    ],
    utilise: [
      "d+2, b+3, and db+2 to make his step expensive.",
      "b+1+2 after he has already respected a jab.",
    ],
    avoid: [
      "Do not both throw wr2 at the same time from mid-screen.",
      "Do not finish 1,2,1 as a block string in the mirror.",
    ],
  },
  Eddy: {
    briefing:
      "Stance lows and low-profiles eat highs. Mid-check first, then freeze. Do not high-check negativa.",
    doThis: [
      "Use df+1, d+1, and wr2 against low stances.",
      "Punish blocked stance lows instead of freezing.",
    ],
    dodge: [
      "Backdash out of handstand range when the string is unclear.",
      "Duck only the known high kick routes.",
    ],
    utilise: [
      "d+2 to crush his high answers.",
      "Pigeon Roll under linear panic kicks at the wall.",
    ],
    avoid: [
      "Do not throw SNK 1 into low stance.",
      "Do not chase every transition; let him finish and punish.",
    ],
  },
  Fahkumram: {
    briefing:
      "He wants range 2 to feel like range 0. Dragunov wins by not swinging at limb tip, then taking the freeze turn once he is close.",
    doThis: [
      "Block standing 3 and df+4, then wr2 or d+2 the recovery.",
      "Step charged kick routes if he has not conditioned you.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "Plus mids at the wall where his sidestep dies.",
      "Throws after he starts waiting for Rama.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not mash after blocked Rama pressure.",
    ],
  },
  Feng: {
    briefing:
      "Feng is the anti-overextension character. Play shorter than usual and make kenpo look stupid.",
    doThis: [
      "Use single-hit pokes and delayed wr2.",
      "Punish shoulder and sweep risks every time.",
    ],
    dodge: [
      "Step his linear power mids.",
      "Backdash after blocked parry attempts before swinging.",
    ],
    utilise: [
      "d+2 to crush highs and keep him from walking.",
      "Throw when he starts waiting for kenpo timing.",
    ],
    avoid: [
      "Do not autopilot 1,2,1 into parry.",
      "Do not raw SNK 2 where he can duck or launch.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Dragunov pokes interrupt him well if you stay calm.",
    doThis: [
      "Duck known high kick strings and launch.",
      "Use d+1 and d+2 to crush his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Pigeon Roll under some of his linear mid checks at the wall.",
    ],
    utilise: [
      "1,2,1 when he mashes after your poke.",
      "ws1+2 in Heat as the i12 crouch punish.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  "Jack-8": {
    briefing:
      "Long arms versus long legs. Your freeze buttons are excellent, but his punishment makes sloppy wr2 expensive.",
    doThis: [
      "Step his linear arm pokes and punish.",
      "Force crouch mix at the wall; he sidesteps worse there.",
    ],
    dodge: [
      "Duck command grabs on a read, not randomly.",
      "Walk around his slow plus mids instead of mashing.",
    ],
    utilise: [
      "d+2 and b+3 to stop him walking your pressure.",
      "b+1+2 after he has blocked a jab.",
    ],
    avoid: [
      "Do not trade single hits from his best range.",
      "Do not crouch without a read; his mids hurt.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into a coin flip, so tax the approach.",
    doThis: [
      "Use d+2, df+1, and wr2 to tax crouch dash.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF if your character can.",
      "Backdash after blocked plus frames; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "Heat tackles after you have already pushed him to the wall.",
    ],
    avoid: [
      "Do not freeze at wavedash range.",
      "Do not give up centre stage for free; the wall is his mix.",
    ],
  },
  King: {
    briefing:
      "Your pokes beat his approach, but throws beat blocking. Prove you can break, then freeze him out of grab range.",
    doThis: [
      "Use df+1 and wr2 to stop him entering throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "d+2 to crush his high grab setups.",
      "Wall oki with Pigeon once he is knocked down.",
    ],
    avoid: [
      "Do not stand still after plus frames without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Kunimitsu: {
    briefing:
      "Season 3 Kunimitsu is speed and misdirection. Do not chase teleports; hold space, block, then freeze her on re-entry.",
    doThis: [
      "Hold centre stage and let her run into df+1 / d+2.",
      "Punish blocked flip and teleport follow-ups once identified.",
    ],
    dodge: [
      "Step linear dash-ins, but do not chase after teleports.",
      "Use fast mids when she tries to low-profile past you.",
    ],
    utilise: [
      "wr2 and SNK 4 at the wall where mobility dies.",
      "Throws after she starts waiting for your poke timing.",
    ],
    avoid: [
      "Do not swing at where she was.",
      "Do not throw slow SNK 2 before she is pinned.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Dragunov can make this awkward with delayed pokes, kicks, and throws.",
    doThis: [
      "Stagger 1 and df+1 instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "d+2, b+3, and wr2 to attack parry timing.",
      "Heat tackles so blocking still costs him.",
    ],
    avoid: [
      "Do not repeat 1,2,1 timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. Track first, freeze second. If you throw wr2 into a ready sidestep, she owns you.",
    doThis: [
      "Use d+2, b+3, and db+2 before repeating wr2.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "b+1 at plus frames to catch her advantageous movement.",
      "Wall mix; her walk matters less there.",
    ],
    avoid: [
      "Do not raw wr2 into sidestep right.",
      "Do not chase her backdash with SNK 2.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with pokes, then smother her when she finally has to defend.",
    doThis: [
      "Use df+1 and d+2 to stop sidestep approach.",
      "Fight for centre stage; her wall pressure is the danger.",
    ],
    dodge: [
      "Duck known high string enders, then launch.",
      "Backdash after blocked plus frames before swinging.",
    ],
    utilise: [
      "wr2 when she hesitates after a poke.",
      "Throws once she starts waiting for your CH traps.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear string.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and CH your timing. Make him block mids, punish his lows, and do not give him predictable high timings.",
    doThis: [
      "Use df+1, d+1, and wr2 to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "d+2 to crush highs and keep him from walking.",
      "1,2,1 when he mashes after your poke.",
    ],
    avoid: [
      "Do not feed b+1 with predictable retaliation.",
      "Do not throw SNK 1 on autopilot; he will duck-launch highs.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first and use d+2 / wr2 to tag her before the scramble starts.",
    doThis: [
      "Use df+1, d+1, and wr2 against AOP.",
      "Keep her at poke range, where your legs hit and her scramble is slower.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "Wall Pigeon oki once she is knocked down.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not throw SNK 1 into stance.",
    ],
  },
  Zafina: {
    briefing:
      "This is one of Dragunov's harder tests. Inconsistent hitboxes and low-profile stances eat linear highs. Mid discipline carries it.",
    doThis: [
      "Use df+1, d+1, d+2, and wr2 that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with SNK 2.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat tackles when she starts waiting.",
      "Plus mids at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not insist on wr2 if it is already whiffing the stance.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Dragunov: chip with 1 and df+1, make sidestep expensive with d+2, then freeze them with wr2 or b+1+2 and mix from crouch.`,
        doThis: [
          "Start with pokes before forcing wr2.",
          "Use d+2 and b+3 if they are already walking.",
        ],
        dodge: [
          "Sidestep right against linear pressure of your own only after you have seen it.",
          "Backdash after your safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "wr2, b+1+2, and SNK 4 once they stop pressing.",
          "FC df+1,4 versus ws3 after plus frames.",
        ],
        avoid: [
          "Do not throw 1,2,1 as a block string.",
          "Do not open with db+3+4 before they have frozen.",
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
  return `https://okizeme.gg/database/dragunov?search=${encodeURIComponent(search)}`;
}

function getClipDatabaseUrl(search: string, characterSlug = OKIZEME_CHARACTER) {
  if (characterSlug === OKIZEME_CHARACTER) {
    return getOkizemeUrl(search);
  }

  return getOpponentOkizemeUrl(characterSlug, search);
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
      className={`rounded-2xl border px-3 py-2 text-sm transition ${
        isActive
          ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/20"
          : "border-cyan-400/35 bg-cyan-400/5 text-cyan-700 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="cyan" active={isActive} />
    </button>
  );
}

export function DragunovGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("dojo");
  const [activeClip, setActiveClip] = useState<{
    clipKey: string;
    clip: Clip;
    characterSlug?: string;
  } | null>(null);
  const [activeMatchupName, setActiveMatchupName] = useState<string | null>(
    null,
  );

  const activeClipKey = activeClip?.clipKey ?? null;
  const activeMatchup = useMemo(
    () => matchups.find((matchup) => matchup.name === activeMatchupName) ?? null,
    [activeMatchupName],
  );

  function playClip(
    clipKey: string,
    clip: Clip,
    characterSlug = OKIZEME_CHARACTER,
  ) {
    setActiveClip((currentClip) =>
      currentClip?.clipKey === clipKey ? null : { clipKey, clip, characterSlug },
    );
  }

  const activeCopy = useMemo(() => {
    switch (activeTab) {
      case "dojo":
        return "Daily reps for plus-frame freeze, poke control, Sneak routing, and wall oki.";
      case "gameplan":
        return "A short round map: chip, freeze, then mix from crouch.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for freeze buttons, pokes, Sneak threats, and wall oki.";
      case "secrets":
        return "The habits that make Dragunov unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Dragunov Sambo Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Dragunov wins when plus frames feel obvious at a glance. This
              guide leans on visual move chips, shorter drill cards, and live
              clips instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-700">
            Focus: plus frames, pokes, Sneak, throws, wall oki
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-inner shadow-slate-200/70 sm:mt-8 sm:gap-3 lg:grid-cols-3">
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
                    ? "border-cyan-300/70 bg-cyan-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-cyan-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="cyan" active={isActive} />
                  <span>
                    <span className="block text-[0.8rem] font-semibold sm:text-sm">
                      {tab.label}
                    </span>
                    <span
                      className={`mt-1 hidden text-[0.65rem] font-semibold uppercase tracking-[0.28em] sm:block ${
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

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
          {activeCopy}
        </p>

        <NotationLegend className="mt-6" />
      </section>

      {activeTab === "dojo" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Dojo"
            title="Daily Dragunov drills"
            copy="Run these as isolated reps. Each card focuses on one freeze, poke, or mix idea so the clips can do the teaching."
            accent="cyan"
          />
          <GuideClipSection
            accent="cyan"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
          >
              {dojoDrills.map((drill) => (
                <article
                  key={drill.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                        Why it matters
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {drill.why}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/85 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
                        Run this
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {drill.drill}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
                    {drill.cues.map((cue) => (
                      <li
                        key={cue}
                        className="rounded-2xl border border-slate-200 bg-slate-100/80 px-3 py-3"
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
          </GuideClipSection>
        </section>
      ) : null}

      {activeTab === "gameplan" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Gameplan"
            title="How Dragunov should feel"
            copy="The opponent should feel behind after two blocked pokes. Once they finally respect the plus frames, crouch mix and throws finish the round."
            accent="cyan"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="cyan" />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
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
            copy="These are the moves to recognise on sight. Learn the shape, then use the clip to refresh the timing."
            accent="cyan"
          />
          <GuideClipSection
            accent="cyan"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="md:grid-cols-2"
          >
              {toolkit.map((tool) => (
                <article
                  key={tool.move}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="cyan" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                        When to use it
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {tool.when}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                        What loses
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {tool.risk}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
          </GuideClipSection>
        </section>
      ) : null}

      {activeTab === "clips" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Clips"
            title="Embedded Dragunov clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="cyan"
          />
          <GuideClipSection
            accent="cyan"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {clipPacks.map((pack) => (
                <article
                  key={pack.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-950">
                    {pack.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
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
          </GuideClipSection>
        </section>
      ) : null}

      {activeTab === "secrets" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Secrets"
            title="The things that make Dragunov unfair"
            copy="The character becomes much scarier when you can see the plus-frame routes, crouch cancels, and wall answers at a glance."
            accent="cyan"
          />
          <GuideClipSection
            accent="cyan"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-cyan-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                        Route
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {secret.route}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
                        If they adapt
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {secret.counter}
                      </p>
                    </div>
                  </div>
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
          </GuideClipSection>
        </section>
      ) : null}

      {activeTab === "matchups" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Matchups"
            title="Loading-screen briefings"
            copy="Tap a character for a fast Dragunov-specific plan with action cards you can scan between rounds."
            accent="cyan"
          />
          <div className="flex flex-wrap gap-2">
            {matchups.map((matchup) => {
              const isSelected = activeMatchupName === matchup.name;

              return (
                <button
                  key={matchup.name}
                  type="button"
                  onClick={() => {
                    setActiveMatchupName(isSelected ? null : matchup.name);
                    setActiveClip(null);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                    isSelected
                      ? "border-cyan-300 bg-cyan-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-cyan-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="cyan"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-cyan-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
                  Dragunov vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                    Quick read
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                    {activeMatchup.briefing}
                  </p>
                </div>

                <MatchupOpponentProfileSection
                  opponentName={activeMatchup.name}
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Do this", activeMatchup.doThis, "text-emerald-600"],
                    ["How to dodge", activeMatchup.dodge, "text-sky-600"],
                    ["Utilise", activeMatchup.utilise, "text-amber-600"],
                    ["Do not", activeMatchup.avoid, "text-rose-600"],
                  ].map(([title, items, colour]) => (
                    <div
                      key={title as string}
                      className="rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5"
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
                            className="rounded-xl bg-slate-100/80 px-3 py-2 text-sm leading-6 text-slate-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <MatchupPunishmentSection
                  characterId="dragunov"
                  opponentName={activeMatchup.name}
                  accent="cyan"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="dragunov"
                  opponentName={activeMatchup.name}
                  accent="cyan"
                  bullets={activeMatchup}
                />
              </article>
            </GuideClipSection>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-4 text-sm leading-7 text-slate-500 sm:p-6">
              Pick a character and the briefing appears here.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

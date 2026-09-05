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

const OKIZEME_CHARACTER = "feng";

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
  { id: "dojo", label: "Dojo", icon: "KNP" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "Back-sway makes their offense whiff",
    summary: "Feng wins neutral when opponents swing at air. Back-sway is not a gimmick; it is the default answer to committed strings and lazy highs.",
    why: "b evades linear mids and many highs on startup. If you cannot sway cleanly and punish the whiff, every kenpo trick becomes a coin flip.",
    drill:
      "For five minutes, play only df+1, b sway, and movement. After every blocked poke, sway once, then choose ub+3, qcf+1 on their swing, or cancel back to standing df+1.",
    cues: [
      "df+1 is the safe mid that buys space for the sway.",
      "ub+3 is the low that keeps you evasive after sway.",
      "Do not spam sway against players who already stopped pressing.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch ub+3", search: "ub+3" },
      { label: "Watch qcf+1", search: "qcf+1" },
    ],
  },
  {
    title: "Kenpo step routing",
    summary: "Shoulder and sweep are the approach mix once they respect the sway.",
    why: "b+1+2 and d+2 are the kenpo step buttons. The mix only works if you have already made them whiff or block a boring df+1 first.",
    drill:
      "From mid-range, rotate df+1, b+1+2, and d+2. Track whether they duck, jab, or hold low. Punish every blocked shoulder and sweep on reaction.",
    cues: [
      "b+1+2 is the shoulder that closes space fast.",
      "d+2 is the sweep; only throw it after they respect the shoulder.",
      "Know your block punishes cold before you gamble kenpo step.",
    ],
    clips: [
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch d+2", search: "d+2" },
      { label: "Watch df+1", search: "df+1" },
    ],
  },
  {
    title: "Whiff punish with qcf+1",
    summary: "Feng damage comes from punishing impatience, not from forcing mix every neutral.",
    why: "qcf+1 is the whiff punish and keepout tool after sway. If you swing it as a block string, good players launch you for the round.",
    drill:
      "Set the dummy to press after your sway whiffs. Drill qcf+1 on every recovery until the punish is automatic with no extra movement.",
    cues: [
      "Sway first, punish second; do not reverse the order.",
      "qcf+1 is also your mid-range check when they stop swinging.",
      "At the wall, confirm into your bread-and-butter combo.",
    ],
    clips: [
      { label: "Watch qcf+1", search: "qcf+1" },
      { label: "Watch qcf+1,2", search: "qcf+1,2" },
      { label: "Watch u/f+2", search: "u/f+2" },
    ],
  },
  {
    title: "Kenpo stance mix after respect",
    summary: "Once they stop pressing, KNP is where Feng stops being evasive and starts being unfair.",
    why: "KNP.d+2 and KNP follow-ups are the real open-up layer after sway has already made them block. The mix only works if you have shown the boring df+1 first.",
    drill:
      "From df+1 or b+1+2 hit, enter KNP and rotate KNP.d+2, KNP.1, and standing throw. Do not repeat the same option twice.",
    cues: [
      "KNP.d+2 is the low that catches stand-blockers.",
      "KNP.1 is the mid check that keeps kenpo alive.",
      "Throw when they start holding low forever.",
    ],
    clips: [
      { label: "Watch KNP.d+2", search: "KNP.d+2" },
      { label: "Watch KNP.1", search: "KNP.1" },
      { label: "Watch 1+2", search: "1+2" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Feng has excellent punishers, but only if you know which tier you are in before the whiff happens.",
    why: "1, ws4, and u/f+2 are the ladder. Hesitating on i10 loses the round; guessing u/f+2 when ws4 was enough loses the combo.",
    drill:
      "Set the dummy to -10, -13, and -15. Drill 1, ws4, and u/f+2 respectively until each punish is automatic.",
    cues: [
      "1 is the i10 jab punish.",
      "ws4 is the i13 standing launcher; confirm before committing.",
      "u/f+2 is the i15 whiff punish that splats and carries.",
    ],
    clips: [
      { label: "Watch 1", search: "1" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch u/f+2", search: "u/f+2" },
    ],
  },
  {
    title: "Patience drill: single-hit neutral",
    summary: "Most Feng losses come from overextension, not from missing combos.",
    why: "Long strings are what sway exists to punish on both sides. If you cannot play df+1 and movement for a full round, kenpo step never gets respect.",
    drill:
      "Play three rounds using only df+1, b sway, and one kenpo step option. Track whether they start freezing, stepping, or swinging first.",
    cues: [
      "The first player to overcommit loses.",
      "Block more than you press in unfamiliar plus-frame sequences.",
      "Whiff punish is the round-ender; kenpo step is the opener.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "Heat power on momentum",
    summary: "Heat is not a panic button. It is the phase where kenpo routes become plus and whiff punishes become guaranteed.",
    why: "Heat-enhanced shoulder and power mids extend pressure after you already won neutral. Spending Heat while losing spacing wastes Feng's best comeback tool.",
    drill:
      "Activate Heat only after a whiff punish, wall-splat, or confirmed CH. Loop H.f+1+2, b+1+2 in Heat, and one qcf+1 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced kenpo routes after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.f+1+2", search: "H.f+1+2" },
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch qcf+1", search: "qcf+1" },
    ],
  },
];

const gameplan = [
  {
    title: "Sway-first neutral, not kenpo-first",
    copy:
      "Feng is not a random stance blender. Start with df+1 and movement, sway when they swing, and only kenpo step once you have already made them whiff or block.",
  },
  {
    title: "Make their strings whiff before you mix",
    copy:
      "Most players lose to Feng because they keep throwing committed offense into back-sway. Your job is to bait those swings, not to force kenpo against someone already blocking low.",
  },
  {
    title: "Punish everything on block",
    copy:
      "Shoulder and sweep are risks for both players. Know your block punishes cold. Feng rounds get easy once opponents realise every kenpo gamble costs them health.",
  },
  {
    title: "Patience beats panic",
    copy:
      "qcf+1 versus ub+3 and df+1 versus throw are the honest layers. Do not open turtles with launch-punishable kenpo step before they have already respected your sway.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on whiff punishes, wall-splats, and confirmed CH routes. Enhanced kenpo pressure extends a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and patience button",
    when: "Use it to check, create space for sway, and start kenpo routes after they block.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to f+3 or sway.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "b / ub+3",
    role: "Back-sway evasion and low check",
    when: "Use sway after they press or after your own blocked df+1. ub+3 keeps you evasive after sway.",
    risk: "Sway loses to delay mids and patient block. Do not hold it forever against turtles.",
    clip: { label: "Play ub+3", search: "ub+3" },
  },
  {
    move: "b+1+2",
    role: "Kenpo shoulder approach",
    when: "Use it to close space after sway has made them hesitate. On hit it starts real pressure.",
    risk: "Minus on block and launch-punishable if thrown raw. Know the punish before you shoulder.",
    clip: { label: "Play b+1+2", search: "b+1+2" },
  },
  {
    move: "d+2",
    role: "Kenpo sweep",
    when: "Use it after shoulder conditioning to open stand-blockers. Pair it with df+1 so they cannot hold one guard angle.",
    risk: "Launch-punishable on block. Only throw it after they respect the shoulder.",
    clip: { label: "Play d+2", search: "d+2" },
  },
  {
    move: "qcf+1",
    role: "Whiff punish and keepout",
    when: "Use it after sway whiffs and as mid-range check when they stop swinging.",
    risk: "Minus on block if used as a string starter. Confirm the whiff before committing.",
    clip: { label: "Play qcf+1", search: "qcf+1" },
  },
  {
    move: "1 / ws4 / u/f+2",
    role: "Punisher ladder",
    when: "Use 1 at i10, ws4 at i13, and u/f+2 at i15. Match the punish to the whiff before you move.",
    risk: "Over-punishing with u/f+2 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws4", search: "ws4" },
  },
  {
    move: "f+1+2",
    role: "Power mid and CH route",
    when: "Use it to threaten at mid-range after they respect df+1. Good CH and wall-carry tool.",
    risk: "Linear and slower than df+1. Sidestep right beats lazy f+1+2 habits.",
    clip: { label: "Play f+1+2", search: "f+1+2" },
  },
  {
    move: "KNP.d+2 / 1+2",
    role: "Kenpo mix and throw layer",
    when: "Use KNP after plus frames to open turtles. 1+2 is the throw layer once they respect the low.",
    risk: "KNP without a read becomes a block contest. Do not spam kenpo against patient players.",
    clip: { label: "Play KNP.d+2", search: "KNP.d+2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Sway pack",
    notes: "The evasion tools that make Feng feel unfair before any kenpo mix starts.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "ub+3", search: "ub+3" },
      { label: "qcf+1", search: "qcf+1" },
      { label: "b+1+2", search: "b+1+2" },
    ],
  },
  {
    title: "Kenpo pack",
    notes: "Review these when you are entering kenpo step but not cashing the mix.",
    clips: [
      { label: "b+1+2", search: "b+1+2" },
      { label: "d+2", search: "d+2" },
      { label: "KNP.d+2", search: "KNP.d+2" },
      { label: "KNP.1", search: "KNP.1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The whiff punish and launcher tools worth drilling until they are automatic.",
    clips: [
      { label: "1", search: "1" },
      { label: "ws4", search: "ws4" },
      { label: "u/f+2", search: "u/f+2" },
      { label: "qcf+1", search: "qcf+1" },
      { label: "f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.f+1+2", search: "H.f+1+2" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "qcf+1,2", search: "qcf+1,2" },
      { label: "f+3", search: "f+3" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Back-sway is the real character",
    tag: "Core identity",
    copy:
      "Kenpo step is the obvious version. Back-sway is the one that actually makes committed offense whiff and sets up qcf+1 for the round. If sway is sloppy, Feng feels honest.",
    route:
      "Practice df+1 into b sway from mid-range. On their whiff, qcf+1. On their block, ub+3 or back to df+1. Never kenpo step before they have already committed.",
    counter:
      "If they stop pressing, go back to df+1 and throws. Do not keep swaying into delay mids.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "ub+3", search: "ub+3" },
      { label: "qcf+1", search: "qcf+1" },
    ],
  },
  {
    title: "Shoulder is bait, not autopilot",
    tag: "Kenpo rule",
    copy:
      "b+1+2 looks like free approach. It is also launch-punishable on block. Strong Fengs shoulder after sway conditioning; weak ones throw it as neutral.",
    route:
      "Sway, df+1, then shoulder when they hesitate. On block, take your punish lesson and go back to patience. On hit, kenpo mix.",
    counter:
      "If they start duck-launching shoulder, stop throwing it raw and use df+1 into throw instead.",
    clips: [
      { label: "b+1+2", search: "b+1+2" },
      { label: "df+1", search: "df+1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "qcf+1 is a whiff punish, not a block string",
    tag: "Punish secret",
    copy:
      "Everyone knows qcf+1 hurts. Fewer people remember it is for whiffs and keepout, not for opening turtles. Good opponents launch greedy qcf+1 habits.",
    route:
      "Sway first, wait for the swing, then qcf+1. At mid-range use it only when they have already shown impatience.",
    counter:
      "If they stop swinging after sway, return to df+1 and kenpo step. Do not keep fishing qcf+1 on block.",
    clips: [
      { label: "qcf+1", search: "qcf+1" },
      { label: "qcf+1,2", search: "qcf+1,2" },
      { label: "u/f+2", search: "u/f+2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Feng mirrors other evasive characters: Steve, Xiaoyu, Leroy. Two patient players mean the first df+1 string, flicker loop, or kenpo gamble loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one sway, one punish. Repeat until they swing. Then kenpo step.",
    counter:
      "If they mirror your patience, use throws and delayed shoulder to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "KNP mix beats panic lows",
    tag: "Stance secret",
    copy:
      "KNP.d+2 versus KNP.1 and throw is the honest 50/50 layer. Do not open turtles with launch-punishable d+2 before they have already respected your shoulder.",
    route:
      "Shoulder on hit or df+1 at plus, enter KNP, rotate low, mid, and throw. Show the boring option first.",
    counter:
      "If they delay tech or backroll consistently, stop kenpo on autopilot and just take df+1.",
    clips: [
      { label: "KNP.d+2", search: "KNP.d+2" },
      { label: "KNP.1", search: "KNP.1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Heat makes kenpo step expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances shoulder and power mids so blocking still costs health. Use it after you already have a whiff punish or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after qcf+1 confirm or wall-splat. Show one df+1, then H.f+1+2 or enhanced shoulder. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.f+1+2", search: "H.f+1+2" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "qcf+1", search: "qcf+1" },
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
  "Fahkumram",
  "Feng (mirror)",
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
      "She wants to leave and return with chainsaws. Feng wins by making her swing into sway, then punishing DES entries with df+1 and qcf+1.",
    doThis: [
      "Use df+1 and sway to punish her linear approach tools.",
      "Block chainsaws first, then punish the identified ender.",
    ],
    dodge: [
      "Sidestep her rocket approaches and launch the landing.",
      "Backdash after blocked DESTINY sequences instead of mashing.",
    ],
    utilise: [
      "qcf+1 when she hesitates after a whiffed high.",
      "Throws once she starts waiting for chainsaw timing.",
    ],
    avoid: [
      "Do not kenpo step into DES without knowing the gap.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Asuka: {
    briefing:
      "Parries eat greedy strings. Feng wins with single-hit pokes, sway evades, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and sway instead of finishing strings.",
      "Throw when she starts waiting for your kenpo timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "Sway against predictable highs.",
      "Shoulder after she has already whiffed into your evasion.",
    ],
    avoid: [
      "Do not autopilot b+1+2 into reversal.",
      "Do not repeat the same sway timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range. Feng wins by swaying highs, punishing snake edge, and refusing to trade CH buttons.",
    doThis: [
      "Hold sway against his high checks and df+1 approach.",
      "Punish snake edge and hatchet on block every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks of his own.",
      "Backdash after blocked df+1 instead of mashing into taunt.",
    ],
    utilise: [
      "u/f+2 whiff punish on his slow mids.",
      "Kenpo mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw shoulder into a ready sidestep.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids make sway risky if you enter blindly. Sway on reads, punish d+2, and do not overextend into wr2 freeze.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Sway his highs after plus frames, not his tracking lows.",
    ],
    utilise: [
      "qcf+1 when he throws highs after your sway.",
      "Shoulder once he has already respected df+1.",
    ],
    avoid: [
      "Do not kenpo step into his crouch mix.",
      "Do not autopilot strings where his plus frames live.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Feng wins by not poking at limb tip, swaying his highs, then kenpo stepping once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with u/f+2 or qcf+1.",
      "Make him come to you; sway deletes many of his highs.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 when he tries to press at mid-range.",
      "Heat shoulder once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not kenpo step from full screen.",
    ],
  },
  "Feng (mirror)": {
    briefing:
      "The mirror is a patience and overextension test. The worse Feng throws kenpo on cooldown; the better one sways, punishes, then steps.",
    doThis: [
      "Single-hit pokes; the first committed string loses.",
      "Punish blocked shoulder and sweep every time.",
    ],
    dodge: [
      "Mirror sway with ub+3; two evasive characters means the first to commit loses.",
      "Step linear qcf+1 habits and launch.",
    ],
    utilise: [
      "Throws when they start waiting for kenpo timing.",
      "Heat after you already have a whiff punish.",
    ],
    avoid: [
      "Do not both shoulder at the same time from mid-screen.",
      "Do not autopilot kenpo step into their sway.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Feng sways well, but only if you stop swinging at his low stances.",
    doThis: [
      "Duck known high kick strings and launch.",
      "Use df+1 and sway against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Sway under some of his linear mid checks.",
    ],
    utilise: [
      "qcf+1 when he mashes after your poke.",
      "Shoulder oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and sway.",
    doThis: [
      "Use df+1 and sway to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "qcf+1 keepout to tax every wavedash entry.",
    ],
    avoid: [
      "Do not kenpo step at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  King: {
    briefing:
      "Your evasion beats his approach, but throws beat blocking. Prove you can break, then mix from df+1 outside grab range.",
    doThis: [
      "Use df+1 and movement to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "Sway against his high grab setups.",
      "1+2 once he starts respecting df+1.",
    ],
    avoid: [
      "Do not stand still without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Feng makes this awkward with single-hit pokes, delayed sway, and throws.",
    doThis: [
      "Stagger df+1 and sway instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "Sway to evade highs he throws after parry attempts.",
      "Shoulder so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat kenpo timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. Sway first, punish second. If you throw shoulder into a ready sidestep, she owns you.",
    doThis: [
      "Use df+1 and sway before repeating kenpo entries.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "Sway when she throws highs after your poke.",
      "Kenpo mix at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw shoulder into sidestep right.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, sway her highs, then smother her when she finally has to defend.",
    doThis: [
      "Use df+1 and movement to stop sidestep approach.",
      "Fight for centre stage; her wall pressure is the danger.",
    ],
    dodge: [
      "Duck known high string enders, then launch.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "qcf+1 when she throws highs after your df+1.",
      "1+2 once she starts waiting for your kenpo mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear qcf+1.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows, and do not give predictable kenpo entries.",
    doThis: [
      "Use df+1 and sway to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "Sway once he has already committed to a high.",
      "Shoulder at the wall where his movement matters less.",
    ],
    avoid: [
      "Do not feed qcf+1 with predictable retaliation.",
      "Do not throw kenpo step on autopilot; he will duck-launch.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first with df+1, sway on reads, and kenpo step only after she whiffs or blocks.",
    doThis: [
      "Use df+1 and movement against AOP.",
      "Keep her at poke range, where your kenpo step is faster than her scramble.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "Shoulder oki once she is knocked down at the wall.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not kenpo step into stance without a read.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Feng wins with mid discipline, sway on reads, and kenpo mix once she is pinned.",
    doThis: [
      "Use df+1, sway, and shoulder that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with committed strings.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat shoulder when she starts waiting.",
      "Kenpo mix at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not insist on shoulder if it is already whiffing the stance.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Feng: sway with df+1, whiff punish with qcf+1, and kenpo step only after they overcommit.`,
        doThis: [
          "Start with single-hit pokes before forcing kenpo step.",
          "Punish blocked shoulder and sweep every time.",
        ],
        dodge: [
          "Sway committed strings instead of blocking everything.",
          "Backdash after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "qcf+1 and u/f+2 once they stop pressing.",
          "KNP mix and throws after plus frames.",
        ],
        avoid: [
          "Do not throw kenpo step as a raw neutral opener.",
          "Do not autopilot strings where their sway or parry lives.",
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
  return `https://okizeme.gg/database/feng?search=${encodeURIComponent(search)}`;
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
          ? "border-emerald-300 bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/20"
          : "border-emerald-400/35 bg-emerald-400/5 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="emerald" active={isActive} />
    </button>
  );
}

export function FengGuide() {
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
        return "Daily reps for back-sway bait, kenpo step routing, whiff punishes, and patience.";
      case "gameplan":
        return "A short round map: sway, punish, then kenpo mix when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for sway tools, kenpo threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Feng unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Feng Kenpo Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Feng wins when impatience gets punished at a glance. This guide
              leans on visual move chips, shorter drill cards, and live clips
              instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700">
            Focus: back-sway, kenpo step, whiff punishes, patience
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
                    ? "border-emerald-300/70 bg-emerald-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="emerald" active={isActive} />
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
            title="Daily Feng drills"
            copy="Run these as isolated reps. Each card focuses on one sway, kenpo, or punish idea so the clips can do the teaching."
            accent="emerald"
          />
          <GuideClipSection
            accent="emerald"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
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
            title="How Feng should feel"
            copy="The opponent should whiff first. Once they finally respect the sway, kenpo step and qcf+1 finish the round."
            accent="emerald"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="emerald" />
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
            accent="emerald"
          />
          <GuideClipSection
            accent="emerald"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="emerald" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
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
            title="Embedded Feng clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="emerald"
          />
          <GuideClipSection
            accent="emerald"
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
            title="The things that make Feng unfair"
            copy="The character becomes much scarier when you can see the sway routes, kenpo mix, and punish windows at a glance."
            accent="emerald"
          />
          <GuideClipSection
            accent="emerald"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-emerald-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
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
            copy="Tap a character for a fast Feng-specific plan with action cards you can scan between rounds."
            accent="emerald"
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
                      ? "border-emerald-300 bg-emerald-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="emerald"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-emerald-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  Feng vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
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
                  characterId="feng"
                  opponentName={activeMatchup.name}
                  accent="emerald"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="feng"
                  opponentName={activeMatchup.name}
                  accent="emerald"
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

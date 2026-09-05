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

const OKIZEME_CHARACTER = "alisa";

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
  { id: "dojo", label: "Dojo", icon: "DES" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "df+1 buys space for boot exits",
    summary: "Alisa wins neutral when opponents swing at air. df+1 is not filler; it is the safe mid that funds backdash, boot jumps, and DES entries.",
    why: "df+1 is fast and safe enough to check. If you cannot poke and leave cleanly, every chainsaw mix becomes a coin flip against disciplined players.",
    drill:
      "For five minutes, play only df+1, backdash, and one boot exit. After every blocked poke, either backdash, enter DES on a read, or cancel to movement instead of finishing 1,2 blindly.",
    cues: [
      "df+1 is the safe mid that buys space for boot mobility.",
      "Do not finish 1,2 every time; stagger it to bait retaliation.",
      "Backdash after df+1 when they start swinging on your rhythm.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch b+3", search: "b+3" },
    ],
  },
  {
    title: "Backdash punisher with b+3",
    summary: "Boot mobility is the trap layer once they respect your poke.",
    why: "b+3 catches greedy backdash after your df+1 and keeps Alisa airborne where grounded punishers whiff. The tool only works if you have already shown patient df+1 first.",
    drill:
      "From mid-range, rotate df+1 and b+3. After a blocked df+1, backdash once, then b+3 when they chase. Track whether they hold block, jab, or backdash again.",
    cues: [
      "b+3 is the boot backdash punisher, not a raw neutral opener.",
      "Show df+1 first so they believe the backdash is free.",
      "Know your landing options before you jump on autopilot.",
    ],
    clips: [
      { label: "Watch b+3", search: "b+3" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+3", search: "f+3" },
    ],
  },
  {
    title: "Whiff punish with uf+2",
    summary: "Alisa damage comes from punishing impatience, not from forcing DES every neutral.",
    why: "uf+2 is the whiff punish after boot movement and backdash baits. If you swing it as a block string, good players launch you back for the round.",
    drill:
      "Set the dummy to press after your backdash whiffs. Drill uf+2 on every recovery until the punish is automatic with no extra movement.",
    cues: [
      "Backdash first, punish second; do not reverse the order.",
      "uf+2 also whiff punishes at mid-range once they stop swinging.",
      "At the wall, confirm into your bread-and-butter combo.",
    ],
    clips: [
      { label: "Watch uf+2", search: "uf+2" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+2", search: "f+2" },
    ],
  },
  {
    title: "DES chainsaw pressure after respect",
    summary: "Once they stop pressing, DES is where Alisa stops being evasive and starts being unfair.",
    why: "DES.1 and DES.2 are the real open-up layer after mobility has already made them block. The mix only works if you have shown the boring df+1 first.",
    drill:
      "From df+1 or f+3 hit, enter DES and rotate DES.1, DES.2, and DES.f+2. Do not repeat the same option twice.",
    cues: [
      "DES.1 is the low that catches stand-blockers.",
      "DES.2 is the mid check that keeps chainsaw pressure alive.",
      "DES.f+2 when they start holding low forever.",
    ],
    clips: [
      { label: "Watch DES.1", search: "DES.1" },
      { label: "Watch DES.2", search: "DES.2" },
      { label: "Watch DES.f+2", search: "DES.f+2" },
    ],
  },
  {
    title: "db+2 launcher confirm routes",
    summary: "Alisa needs a reliable launcher that does not require a hard read every round.",
    why: "db+2 is the crouch launcher that closes rounds once mobility has already opened them up. Hesitating on confirm loses the combo; forcing it on block gets you launched.",
    drill:
      "Set the dummy to duck after df+1. Drill df+1 into db+2 on every crouch attempt until the confirm is automatic. Then repeat from DES.f+2 hit only.",
    cues: [
      "db+2 is for confirmed duck attempts, not autopilot neutral.",
      "Pair df+1 with db+2 so they cannot hold one guard angle.",
      "Wall carry matters more than max damage mid-screen.",
    ],
    clips: [
      { label: "Watch db+2", search: "db+2" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch DES.f+2", search: "DES.f+2" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Alisa has excellent punishers, but only if you know which tier you are in before the whiff happens.",
    why: "1, ws4, and uf+2 are the ladder. Hesitating on i10 loses the round; guessing uf+2 when ws4 was enough loses the combo.",
    drill:
      "Set the dummy to -10, -13, and -15. Drill 1, ws4, and uf+2 respectively until each punish is automatic.",
    cues: [
      "1 is the i10 jab punish.",
      "ws4 is the i13 standing launcher; confirm before committing.",
      "uf+2 is the i15 whiff punish that splats and carries.",
    ],
    clips: [
      { label: "Watch 1", search: "1" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch uf+2", search: "uf+2" },
    ],
  },
  {
    title: "Heat power on momentum",
    summary: "Heat is not a panic button. It is the phase where DES routes become plus and whiff punishes become guaranteed.",
    why: "Heat-enhanced chainsaws and power mids extend pressure after you already won neutral. Spending Heat while losing spacing wastes Alisa's best comeback tool.",
    drill:
      "Activate Heat only after a whiff punish, wall-splat, or confirmed CH. Loop H.2+3, DES.2 in Heat, and one uf+2 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced DES routes after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.2+3", search: "H.2+3" },
      { label: "Watch H.f+1+4", search: "H.f+1+4" },
      { label: "Watch uf+2", search: "uf+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Mobility-first neutral, not DES-first",
    copy:
      "Alisa is not a random chainsaw blender. Start with df+1 and boot movement, backdash when they swing, and only enter DES once you have already made them whiff or block.",
  },
  {
    title: "Make their strings whiff before you mix",
    copy:
      "Most players lose to Alisa because they keep throwing committed offense into boot backdash. Your job is to bait those swings, not to force DES against someone already blocking low.",
  },
  {
    title: "Punish everything on block",
    copy:
      "DES chainsaws and f+1+2 are risks for both players. Know your block punishes cold. Alisa rounds get easy once opponents realise every DES gamble costs them health.",
  },
  {
    title: "Patience beats panic",
    copy:
      "uf+2 versus b+3 and df+1 versus throw are the honest layers. Do not open turtles with launch-punishable DES before they have already respected your mobility.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on whiff punishes, wall-splats, and confirmed CH routes. Enhanced DES pressure extends a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and patience button",
    when: "Use it to check, create space for boot exits, and start DES routes after they block.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to db+2 or DES on a read.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "b+3",
    role: "Boot backdash punisher",
    when: "Use it after df+1 and backdash when they chase with movement or jabs.",
    risk: "Minus on block if thrown raw. Know the punish before you jump.",
    clip: { label: "Play b+3", search: "b+3" },
  },
  {
    move: "DES.1 / DES.2",
    role: "Chainsaw low and mid pressure",
    when: "Use DES after plus frames to open turtles. Rotate low and mid so they cannot hold one guard angle.",
    risk: "DES without a read becomes a block contest. Do not spam chainsaws against patient players.",
    clip: { label: "Play DES.2", search: "DES.2" },
  },
  {
    move: "DES.f+2",
    role: "DES mid check and confirm starter",
    when: "Use it when they start holding low forever or after DES.1 lands.",
    risk: "Launch-punishable on block if thrown on autopilot. Only commit after conditioning.",
    clip: { label: "Play DES.f+2", search: "DES.f+2" },
  },
  {
    move: "uf+2",
    role: "Whiff punish launcher",
    when: "Use it on their recovery after boot movement makes them whiff, and at mid-range once they stop swinging.",
    risk: "Launch-punishable on block, so strong players will duck-launch greedy habits. Confirm the whiff first.",
    clip: { label: "Play uf+2", search: "uf+2" },
  },
  {
    move: "db+2",
    role: "Crouch launcher",
    when: "Use it to punish duck attempts after df+1 or during DES conditioning.",
    risk: "Whiffs badly if they stand. Only throw it on confirmed crouch, not as a neutral gamble.",
    clip: { label: "Play db+2", search: "db+2" },
  },
  {
    move: "1 / ws4 / uf+2",
    role: "Punisher ladder",
    when: "Use 1 at i10, ws4 at i13, and uf+2 at i15. Match the punish to the whiff before you move.",
    risk: "Over-punishing with uf+2 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws4", search: "ws4" },
  },
  {
    move: "f+1+2 / f,f,F+2",
    role: "Power mid and rage route",
    when: "Use f+1+2 to threaten at mid-range after they respect df+1. f,f,F+2 closes rounds at rage.",
    risk: "Linear and slower than df+1. Sidestep right beats lazy f+1+2 habits.",
    clip: { label: "Play f+1+2", search: "f+1+2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Poke pack",
    notes: "The safe mids and movement tools that make Alisa feel unfair before any DES mix starts.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "df+2", search: "df+2" },
      { label: "f+3", search: "f+3" },
      { label: "1,2", search: "1,2" },
    ],
  },
  {
    title: "DES pack",
    notes: "Review these when you are entering Destructive Form but not cashing the mix.",
    clips: [
      { label: "DES.1", search: "DES.1" },
      { label: "DES.2", search: "DES.2" },
      { label: "DES.f+2", search: "DES.f+2" },
      { label: "d+2", search: "d+2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The whiff punish and launcher tools worth drilling until they are automatic.",
    clips: [
      { label: "1", search: "1" },
      { label: "ws4", search: "ws4" },
      { label: "uf+2", search: "uf+2" },
      { label: "b+3", search: "b+3" },
      { label: "db+2", search: "db+2" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "H.f+1+4", search: "H.f+1+4" },
      { label: "f,f,F+2", search: "f,f,F+2" },
      { label: "f+2,1", search: "f+2,1" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Boot mobility is the real character",
    tag: "Core identity",
    copy:
      "DES is the obvious version. Boot backdash and aerial exits are the ones that actually make committed offense whiff and set up uf+2 for the round. If mobility is sloppy, Alisa feels honest.",
    route:
      "Practice df+1 into backdash from mid-range. On their whiff, uf+2. On their block, b+3 or back to df+1. Never enter DES before they have already committed.",
    counter:
      "If they stop pressing, go back to df+1 and throws. Do not keep backdashing into delay mids.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "b+3", search: "b+3" },
      { label: "uf+2", search: "uf+2" },
    ],
  },
  {
    title: "DES is bait, not autopilot",
    tag: "Stance rule",
    copy:
      "DES.2 looks like free pressure. It is also launch-punishable on block. Strong Alisas chainsaw after mobility conditioning; weak ones throw DES as neutral.",
    route:
      "df+1, backdash, then DES when they hesitate. On block, take your punish lesson and go back to patience. On hit, rotate DES.1 and DES.f+2.",
    counter:
      "If they start duck-launching DES, stop throwing it raw and use df+1 into throw instead.",
    clips: [
      { label: "DES.2", search: "DES.2" },
      { label: "df+1", search: "df+1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "uf+2 is a whiff punish, not a block string",
    tag: "Punish secret",
    copy:
      "Everyone knows uf+2 hurts. Fewer people remember it is for whiffs, not for opening turtles. Good opponents launch greedy uf+2 habits.",
    route:
      "Backdash first, wait for the swing, then uf+2. At mid-range use it only when they have already shown impatience.",
    counter:
      "If they stop swinging after your backdash, return to df+1 and DES. Do not keep fishing uf+2 on block.",
    clips: [
      { label: "uf+2", search: "uf+2" },
      { label: "f+2", search: "f+2" },
      { label: "ws2", search: "ws2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Alisa mirrors other evasive characters: Feng, Xiaoyu, Leroy. Two patient players mean the first df+1 string, boot jump, or DES gamble loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one backdash, one punish. Repeat until they swing. Then DES.",
    counter:
      "If they mirror your patience, use throws and delayed DES to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "DES.1", search: "DES.1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "b+3 catches backdash greed",
    tag: "Mobility secret",
    copy:
      "b+3 is not just style. It punishes backdash after your df+1 and keeps you airborne where grounded players whiff. Pair it with patient pokes so they believe the space is free.",
    route:
      "After blocked df+1, watch for backdash and b+3. Pair it with uf+2 so they cannot hold one guard angle forever.",
    counter:
      "If they stop backdashing and start ducking, return to df+1 and db+2 instead of jumping on autopilot.",
    clips: [
      { label: "b+3", search: "b+3" },
      { label: "df+1", search: "df+1" },
      { label: "db+2", search: "db+2" },
    ],
  },
  {
    title: "Heat makes DES expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances chainsaws and power mids so blocking still costs health. Use it after you already have a whiff punish or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after uf+2 confirm or wall-splat. Show one df+1, then H.2+3 or H.f+1+4. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "H.f+1+4", search: "H.f+1+4" },
      { label: "uf+2", search: "uf+2" },
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
  "Alisa (mirror)",
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
  Asuka: {
    briefing:
      "Parries eat greedy strings. Alisa wins with single-hit df+1 pokes, boot backdash, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and backdash instead of finishing strings.",
      "Throw when she starts waiting for your DES timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "b+3 against predictable highs after backdash.",
      "DES once she has already whiffed into your mobility.",
    ],
    avoid: [
      "Do not autopilot DES.2 into reversal.",
      "Do not repeat the same backdash timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range. Alisa wins by backdashing highs, punishing snake edge, and refusing to trade CH buttons.",
    doThis: [
      "Hold backdash against his high checks and df+1 approach.",
      "Punish snake edge and hatchet on block every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks of his own.",
      "Backdash after blocked df+1 instead of mashing into taunt.",
    ],
    utilise: [
      "uf+2 whiff punish on his slow mids.",
      "DES mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw DES into a ready sidestep.",
    ],
  },
  "Devil Jin": {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and boot mobility.",
    doThis: [
      "Use df+1 and backdash to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "uf+2 to launch every lazy wavedash entry.",
    ],
    avoid: [
      "Do not enter DES at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids make backdash risky if you enter blindly. Backdash on reads, punish d+2, and do not overextend into wr2 freeze.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Backdash his highs after plus frames, not his tracking lows.",
    ],
    utilise: [
      "uf+2 when he throws highs after your backdash.",
      "DES once he has already respected df+1.",
    ],
    avoid: [
      "Do not enter DES into his crouch mix.",
      "Do not autopilot strings where his plus frames live.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Alisa wins by not poking at limb tip, backdashing his highs, then DES once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with uf+2 or db+2.",
      "Make him come to you; boot mobility deletes many of his highs.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 when he tries to press at mid-range.",
      "Heat DES once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not enter DES from full screen.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Alisa backdashes well, but only if you stop swinging at his low stances.",
    doThis: [
      "Duck known high kick strings and launch.",
      "Use df+1 and backdash against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Boot mobility under some of his linear mid checks.",
    ],
    utilise: [
      "uf+2 when he mashes after your poke.",
      "DES oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Jin: {
    briefing:
      "Keep him outside wavedash range. Tax the approach with df+1 and boot mobility before DES can reset the pace at close range.",
    doThis: [
      "Use df+1 and backdash to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "DES mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not enter DES at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and boot mobility.",
    doThis: [
      "Use df+1 and backdash to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "uf+2 to launch every lazy wavedash entry.",
    ],
    avoid: [
      "Do not enter DES at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  King: {
    briefing:
      "Your mobility beats his approach, but throws beat blocking. Prove you can break, then mix from df+1 outside grab range.",
    doThis: [
      "Use df+1 and movement to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "Backdash against his high grab setups.",
      "1+2 once he starts respecting df+1.",
    ],
    avoid: [
      "Do not stand still without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Lars: {
    briefing:
      "Lars wants to bully with df+2 and WR pressure. Alisa wins by not trading at his range, backdashing his highs, and DES once he is wall-splatted.",
    doThis: [
      "Use df+1 and backdash to stay outside his df+2 range.",
      "Punish blocked WR 1 and df+2 on block every time.",
    ],
    dodge: [
      "Sidestep right against raw WR 2.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "uf+2 when he throws highs after your backdash.",
      "DES oki at the wall where his movement dies.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not enter DES into his WR mix without a read.",
    ],
  },
  Law: {
    briefing:
      "Law wants speed and CH at close range. Alisa wins by df+1 spacing, boot backdash, and punishing dragon charge instead of scrambling.",
    doThis: [
      "Use df+1 and movement to keep him out of CH range.",
      "Punish dragon charge and blocked df+1 every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks.",
      "Backdash after blocked pokes; do not mash into CH.",
    ],
    utilise: [
      "uf+2 when he throws highs after your backdash.",
      "DES mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not jab-scramble with him up close for long.",
      "Do not enter DES without plus frames against his speed.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Alisa makes this awkward with single-hit pokes, delayed backdash, and throws.",
    doThis: [
      "Stagger df+1 and backdash instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "Boot mobility to evade highs he throws after parry attempts.",
      "DES so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat DES timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. Backdash first, punish second. If you throw DES into a ready sidestep, she owns you.",
    doThis: [
      "Use df+1 and backdash before repeating DES entries.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "b+3 when she throws highs after your poke.",
      "DES mix at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw DES into sidestep right.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, backdash her highs, then smother her when she finally has to defend.",
    doThis: [
      "Use df+1 and movement to stop sidestep approach.",
      "Fight for centre stage; her wall pressure is the danger.",
    ],
    dodge: [
      "Duck known high string enders, then launch.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "uf+2 when she throws highs after your df+1.",
      "1+2 once she starts waiting for your DES mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear uf+2.",
    ],
  },
  "Alisa (mirror)": {
    briefing:
      "The mirror is a mobility and overextension test. The worse Alisa throws DES on cooldown; the better one pokes, backdashes, punishes, then chainsaws.",
    doThis: [
      "Single-hit pokes; the first committed string loses.",
      "Punish blocked DES and f+1+2 every time.",
    ],
    dodge: [
      "Mirror backdash with b+3; two mobile characters means the first to commit loses.",
      "Step her linear pokes after a blocked uf+2 and launch.",
    ],
    utilise: [
      "Throws when they start waiting for DES timing.",
      "Heat after you already have a whiff punish.",
    ],
    avoid: [
      "Do not both jump at the same time from mid-screen.",
      "Do not autopilot DES into their backdash.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows, and do not give predictable DES entries.",
    doThis: [
      "Use df+1 and backdash to challenge his evasive posture.",
      "Punish duckable highs and blocked lows hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "uf+2 once he has already committed to a high.",
      "DES at the wall where his movement matters less.",
    ],
    avoid: [
      "Do not feed uf+2 with predictable retaliation.",
      "Do not throw DES on autopilot; he will duck-launch.",
    ],
  },
  Victor: {
    briefing:
      "Victor wants close-range CH and wall carry. Alisa wins by df+1 spacing, boot backdash, and DES only after he is forced to approach.",
    doThis: [
      "Use df+1 and movement to keep him at mid-range.",
      "Punish blocked df+1 and obvious approach tools every time.",
    ],
    dodge: [
      "Sidestep right against raw linear mids.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "uf+2 when he throws highs after your backdash.",
      "DES oki at the wall where his pressure peaks.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not enter DES without plus frames up close.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first with df+1, backdash on reads, and DES only after she whiffs or blocks.",
    doThis: [
      "Use df+1 and movement against AOP.",
      "Keep her at poke range, where your boot mobility is faster than her scramble.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "DES oki once she is knocked down at the wall.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not enter DES into stance without a read.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Alisa wins with mid discipline, backdash on reads, and DES mix once she is pinned.",
    doThis: [
      "Use df+1, backdash, and DES that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with committed strings.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat DES when she starts waiting.",
      "DES mix at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not insist on DES if it is already whiffing the stance.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Alisa: poke with df+1, use boot mobility to make highs whiff, enter DES for chainsaw pressure, and punish backdash with b+3 or uf+2.`,
        doThis: [
          "Start with single-hit pokes before forcing DES.",
          "Punish blocked chainsaws and power mids every time.",
        ],
        dodge: [
          "Backdash committed strings instead of blocking everything.",
          "Boot exit after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "uf+2 and b+3 once they stop pressing.",
          "DES mix and throws after plus frames.",
        ],
        avoid: [
          "Do not throw DES as a raw neutral opener.",
          "Do not autopilot strings where their parry or sway lives.",
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
  return `https://okizeme.gg/database/alisa?search=${encodeURIComponent(search)}`;
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
          ? "border-fuchsia-300 bg-fuchsia-300 text-slate-950 shadow-lg shadow-fuchsia-950/20"
          : "border-fuchsia-400/35 bg-fuchsia-400/5 text-fuchsia-700 hover:border-fuchsia-300 hover:bg-fuchsia-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="fuchsia" active={isActive} />
    </button>
  );
}

export function AlisaGuide() {
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
        return "Daily reps for df+1 pokes, boot mobility, DES chainsaw pressure, whiff punishes, and patience.";
      case "gameplan":
        return "A short round map: poke, backdash, punish, then DES mix when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for poke tools, DES threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Alisa unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Alisa Boot Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Alisa wins when impatience gets punished at a glance. This guide
              leans on visual move chips, shorter drill cards, and live clips
              instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-fuchsia-400/25 bg-fuchsia-400/10 px-4 py-3 text-sm text-fuchsia-700">
            Focus: aerial mobility, DES chainsaws, df+1 poke, boot punishes
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
                    ? "border-fuchsia-300/70 bg-fuchsia-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-fuchsia-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="fuchsia" active={isActive} />
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
            title="Daily Alisa drills"
            copy="Run these as isolated reps. Each card focuses on one poke, boot, or DES idea so the clips can do the teaching."
            accent="fuchsia"
          />
          <GuideClipSection
            accent="fuchsia"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
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
            title="How Alisa should feel"
            copy="The opponent should whiff first. Once they finally respect the backdash, DES and uf+2 finish the round."
            accent="fuchsia"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="fuchsia" />
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
            accent="fuchsia"
          />
          <GuideClipSection
            accent="fuchsia"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="fuchsia" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
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
            title="Embedded Alisa clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="fuchsia"
          />
          <GuideClipSection
            accent="fuchsia"
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
            title="The things that make Alisa unfair"
            copy="The character becomes much scarier when you can see the boot routes, DES mix, and punish windows at a glance."
            accent="fuchsia"
          />
          <GuideClipSection
            accent="fuchsia"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-fuchsia-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
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
            copy="Tap a character for a fast Alisa-specific plan with action cards you can scan between rounds."
            accent="fuchsia"
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
                      ? "border-fuchsia-300 bg-fuchsia-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-fuchsia-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="fuchsia"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-fuchsia-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                  Alisa vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-600">
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
                    ["Do this", activeMatchup.doThis, "text-fuchsia-600"],
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
                  characterId="alisa"
                  opponentName={activeMatchup.name}
                  accent="fuchsia"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="alisa"
                  opponentName={activeMatchup.name}
                  accent="fuchsia"
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

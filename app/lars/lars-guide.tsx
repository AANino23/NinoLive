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

const OKIZEME_CHARACTER = "lars";

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
  { id: "dojo", label: "Dojo", icon: "SEN" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "df+1 backbone before every burst",
    summary: "Lars wins neutral when opponents respect the mid poke first. df+1 is not filler; it is the safe check that buys space for SEN and Dynamic Entry.",
    why: "df+1 is fast, safe, and conditions block. If you cannot play df+1 and movement for a full round, f+2,1 and f+3 become launch-punishable gambles.",
    drill:
      "For five minutes, play only df+1, sidestep, and one follow-up. After every blocked df+1, choose f+2,1, f+3, or back to movement. Track whether they jab, duck, or hold low.",
    cues: [
      "df+1 is the safe mid that starts every honest route.",
      "Do not repeat df+1 forever against players who already stopped pressing.",
      "Burst only after they have blocked the poke at least once.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+2,1", search: "f+2,1" },
      { label: "Watch f+3", search: "f+3" },
    ],
  },
  {
    title: "Silent Entry routing with f+2,1",
    summary: "SEN is where Lars stops being honest and starts being unfair. f+2,1 is the main entry once df+1 has already made them block.",
    why: "f+2,1 enters Silent Entry on block or hit. The mix only works if you have shown the boring df+1 first and they are still guessing mid versus low.",
    drill:
      "From mid-range, rotate df+1, f+2,1, and movement. On f+2,1 block or hit, enter SEN and rotate SEN.1, SEN.2, and SEN.3 without repeating the same option twice.",
    cues: [
      "f+2,1 is the SEN door; know the block punish before you enter.",
      "SEN.1 is the low that catches stand-blockers.",
      "SEN.2 and SEN.3 are the mid checks that keep Silent Entry alive.",
    ],
    clips: [
      { label: "Watch f+2,1", search: "f+2,1" },
      { label: "Watch SEN.1", search: "SEN.1" },
      { label: "Watch SEN.2", search: "SEN.2" },
    ],
  },
  {
    title: "Dynamic Entry f+3 on respect",
    summary: "f+3 closes space fast and starts real pressure when they finally respect df+1. It is burst offense, not a raw neutral opener.",
    why: "Dynamic Entry is minus on block and launch-punishable if thrown raw. Strong Lars players f+3 after poke conditioning; weak ones throw it from full screen.",
    drill:
      "Set the dummy to block df+1, then drill f+3 on the next approach. Track block punish and confirm into your bread-and-butter combo on hit.",
    cues: [
      "f+3 belongs after df+1, not before it.",
      "On hit, carry to the wall with 1,2 or your standard route.",
      "On block, take the punish lesson and return to df+1.",
    ],
    clips: [
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch 1,2", search: "1,2" },
    ],
  },
  {
    title: "Flash Bullet df+2 at i14",
    summary: "df+2 is Lars's launch punish. i14 and it splats for a full combo. If you hesitate on the punish window, every burst gamble costs you the round.",
    why: "df+2 (Flash Bullet) is the i14 standing launcher. Hesitating on i10 loses the jab; guessing df+2 when ws4 was enough loses the combo.",
    drill:
      "Set the dummy to -10, -13, and -14. Drill 1, ws4, and df+2 respectively until each punish is automatic with no extra movement.",
    cues: [
      "1 is the i10 jab punish.",
      "ws4 is the i13 standing launcher; confirm before committing.",
      "df+2 is the i14 Flash Bullet punish that splats and carries.",
    ],
    clips: [
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
  {
    title: "SS.2 Shockwave side-step mix",
    summary: "SS.2 is the side-step low that catches players who sidestep right into Lars's burst routes. Pair it with df+1 so they cannot hold one guard angle.",
    why: "Shockwave only works after they respect your linear mids. If you spam SS.2 without df+1 conditioning, good players launch the recovery.",
    drill:
      "From df+1 block, sidestep and SS.2. Track whether they low-crush, jab, or hold low. Punish every blocked Shockwave on reaction.",
    cues: [
      "SS.2 is the low after sidestep; only throw it after they respect df+1.",
      "Do not SS.2 from full screen without a read.",
      "Know your block punishes cold before you gamble Shockwave.",
    ],
    clips: [
      { label: "Watch SS.2", search: "SS.2" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+2", search: "f+2" },
    ],
  },
  {
    title: "Magnetic knee b+4 at the wall",
    summary: "b+4 is the magnetic knee that closes space and splats at the wall. Lars damage comes from pinning opponents, not from forcing mix every neutral.",
    why: "b+4,1+2 is the follow-up that keeps pressure running. If you throw b+4 raw at mid-range, sidesteps and i14 punishes end the round.",
    drill:
      "Wall-splat the dummy, then drill b+4 and b+4,1+2 oki. Track whether they duck, jab, or hold low. Rotate df+1 and 1+2 once they respect the knee.",
    cues: [
      "b+4 is the wall tool; use it after you already earned the splat.",
      "b+4,1+2 extends pressure when they block the knee.",
      "Throw when they start holding low forever at the wall.",
    ],
    clips: [
      { label: "Watch b+4", search: "b+4" },
      { label: "Watch b+4,1+2", search: "b+4,1+2" },
      { label: "Watch 1+2", search: "1+2" },
    ],
  },
  {
    title: "Heat burst on momentum",
    summary: "Heat is not a panic button. It is the phase where Lars routes become plus and Flash Bullet punishes become guaranteed.",
    why: "Heat-enhanced f,F+2 and H.2+3 extend pressure after you already won neutral. Spending Heat while losing spacing wastes Lars's best comeback tool.",
    drill:
      "Activate Heat only after a df+2 punish, wall-splat, or confirmed CH. Loop H.2+3, f,F+2 in Heat, and one df+2 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced burst routes after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.2+3", search: "H.2+3" },
      { label: "Watch f,F+2", search: "f,F+2" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Poke-first neutral, not burst-first",
    copy:
      "Lars is not a random stance blender. Start with df+1 and movement, enter SEN with f+2,1 once they block, and only Dynamic Entry f+3 after you have already earned respect.",
  },
  {
    title: "Make them block before you burst",
    copy:
      "Most players lose to Lars because they keep throwing f+3 and f+2,1 as raw openers. Your job is to condition with df+1 first, not to force Silent Entry against someone already holding low.",
  },
  {
    title: "Punish everything on block",
    copy:
      "Dynamic Entry and SEN routes are risks for both players. Know your block punishes cold. Lars rounds get easy once opponents realise every burst gamble costs them health.",
  },
  {
    title: "Flash Bullet closes rounds",
    copy:
      "df+2 versus f+1+2 and df+1 versus throw are the honest layers. Do not open turtles with launch-punishable burst before they have already respected your poke.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on df+2 punishes, wall-splats, and confirmed CH routes. Enhanced burst pressure extends a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and patience button",
    when: "Use it to check, create space for SEN, and start burst routes after they block.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to f+3 or sidestep.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f+2,1 / SEN",
    role: "Silent Entry approach and mix",
    when: "Use f+2,1 after df+1 conditioning to enter SEN. Rotate SEN.1, SEN.2, and SEN.3 on block or hit.",
    risk: "Minus on block and launch-punishable if thrown raw. Know the punish before you enter SEN.",
    clip: { label: "Play f+2,1", search: "f+2,1" },
  },
  {
    move: "f+3",
    role: "Dynamic Entry burst approach",
    when: "Use it to close space after df+1 has made them hesitate. On hit it starts real pressure.",
    risk: "Launch-punishable on block. Only throw it after they respect the poke.",
    clip: { label: "Play f+3", search: "f+3" },
  },
  {
    move: "df+2",
    role: "Flash Bullet i14 launch punish",
    when: "Use it at i14 on whiffs and block punishers. Confirms into full combo and wall carry.",
    risk: "High commitment on whiff. Confirm the punish tier before committing.",
    clip: { label: "Play df+2", search: "df+2" },
  },
  {
    move: "1,2 / ws4 / ws2",
    role: "Punisher ladder",
    when: "Use 1,2 at i10, ws4 at i13, and ws2 where applicable. Match the punish to the whiff before you move.",
    risk: "Over-punishing with df+2 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws4", search: "ws4" },
  },
  {
    move: "SS.2",
    role: "Shockwave side-step low",
    when: "Use it after sidestep following blocked df+1 to catch stand-blockers and sidestep habits.",
    risk: "Launch-punishable on block. Only throw it after they respect the mid poke.",
    clip: { label: "Play SS.2", search: "SS.2" },
  },
  {
    move: "b+4 / b+4,1+2",
    role: "Magnetic knee wall pressure",
    when: "Use b+4 at the wall after splat. b+4,1+2 extends pressure when they block the knee.",
    risk: "Raw b+4 at mid-range gets sidestepped and launch-punished. Save it for wall oki.",
    clip: { label: "Play b+4", search: "b+4" },
  },
  {
    move: "f+1+2 / 1+2",
    role: "Power mid and throw layer",
    when: "Use f+1+2 to threaten at mid-range after they respect df+1. 1+2 is the throw layer once they respect the low.",
    risk: "Linear and slower than df+1. Sidestep right beats lazy f+1+2 habits.",
    clip: { label: "Play f+1+2", search: "f+1+2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Poke pack",
    notes: "The df+1 tools that make Lars feel honest before any burst mix starts.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "1,2", search: "1,2" },
      { label: "f+2", search: "f+2" },
      { label: "db+2", search: "db+2" },
    ],
  },
  {
    title: "Silent Entry pack",
    notes: "Review these when you are entering SEN but not cashing the mix.",
    clips: [
      { label: "f+2,1", search: "f+2,1" },
      { label: "SEN.1", search: "SEN.1" },
      { label: "SEN.2", search: "SEN.2" },
      { label: "SEN.3", search: "SEN.3" },
      { label: "LEN.1", search: "LEN.1" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The Flash Bullet and launcher tools worth drilling until they are automatic.",
    clips: [
      { label: "1,2", search: "1,2" },
      { label: "ws4", search: "ws4" },
      { label: "ws2", search: "ws2" },
      { label: "df+2", search: "df+2" },
      { label: "f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "f,F+2", search: "f,F+2" },
      { label: "f+3", search: "f+3" },
      { label: "FC.df+2", search: "FC.df+2" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "df+1 is the real character",
    tag: "Core identity",
    copy:
      "Silent Entry is the obvious version. df+1 is the one that actually makes opponents block and sets up f+2,1 for the round. If the poke is sloppy, Lars feels honest.",
    route:
      "Practice df+1 from mid-range. On their block, f+2,1 into SEN. On their whiff, df+2. On their duck, f+3 or sidestep. Never burst before they have already committed to blocking.",
    counter:
      "If they stop pressing, go back to df+1 and throws. Do not keep bursting into delay mids.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+2,1", search: "f+2,1" },
      { label: "df+2", search: "df+2" },
    ],
  },
  {
    title: "Dynamic Entry is bait, not autopilot",
    tag: "Burst rule",
    copy:
      "f+3 looks like free approach. It is also launch-punishable on block. Strong Lars players Dynamic Entry after df+1 conditioning; weak ones throw it as neutral.",
    route:
      "df+1, then f+3 when they hesitate. On block, take your punish lesson and go back to patience. On hit, carry and wall splat.",
    counter:
      "If they start duck-launching f+3, stop throwing it raw and use df+1 into throw instead.",
    clips: [
      { label: "f+3", search: "f+3" },
      { label: "df+1", search: "df+1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "df+2 is a punish, not a block string",
    tag: "Punish secret",
    copy:
      "Everyone knows Flash Bullet hurts. Fewer people remember it is for i14 punishes, not for opening turtles. Good opponents launch greedy df+2 habits.",
    route:
      "Label the whiff first, then df+2. At mid-range use it only when they have already shown a punishable recovery.",
    counter:
      "If they stop giving i14 frames, return to df+1 and SEN mix. Do not keep fishing df+2 on block.",
    clips: [
      { label: "df+2", search: "df+2" },
      { label: "ws4", search: "ws4" },
      { label: "f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Lars mirrors other rushdown characters: Hwoarang, Steve, Nina. Two patient players mean the first f+3, SEN loop, or burst gamble loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one sidestep, one punish. Repeat until they swing. Then Silent Entry.",
    counter:
      "If they mirror your patience, use throws and delayed f+3 to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "SEN mix beats panic lows",
    tag: "Stance secret",
    copy:
      "SEN.1 versus SEN.2 and throw is the honest 50/50 layer. Do not open turtles with launch-punishable SEN lows before they have already respected your f+2,1.",
    route:
      "f+2,1 on hit or df+1 at plus, enter SEN, rotate low, mid, and throw. Show the boring option first.",
    counter:
      "If they delay tech or backroll consistently, stop SEN on autopilot and just take df+1.",
    clips: [
      { label: "SEN.1", search: "SEN.1" },
      { label: "SEN.2", search: "SEN.2" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Heat makes burst offense expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances f,F+2 and H.2+3 so blocking still costs health. Use it after you already have a df+2 punish or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after df+2 confirm or wall-splat. Show one df+1, then H.2+3 or f,F+2. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "f,F+2", search: "f,F+2" },
      { label: "df+2", search: "df+2" },
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
  "Lars (mirror)",
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
      "She wants to leave and return with chainsaws. Lars wins by df+1 checking her approach, punishing DES entries with df+2, and bursting only after she blocks.",
    doThis: [
      "Use df+1 and movement to punish her linear approach tools.",
      "Block chainsaws first, then punish the identified ender with df+2.",
    ],
    dodge: [
      "Sidestep her rocket approaches and launch the landing.",
      "Backdash after blocked DESTINY sequences instead of mashing.",
    ],
    utilise: [
      "df+2 when she hesitates after a whiffed high.",
      "Throws once she starts waiting for chainsaw timing.",
    ],
    avoid: [
      "Do not f+3 into DES without knowing the gap.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Asuka: {
    briefing:
      "Parries eat greedy strings. Lars wins with single-hit df+1 pokes, sidestep evades, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and f+2,1 instead of finishing strings.",
      "Throw when she starts waiting for your SEN timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "df+2 against predictable whiffs after your poke.",
      "f+3 after she has already whiffed into your movement.",
    ],
    avoid: [
      "Do not autopilot f+3 into reversal.",
      "Do not repeat the same SEN timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range. Lars wins by df+1 checking, punishing snake edge with df+2, and refusing to trade CH buttons.",
    doThis: [
      "Hold df+1 against his high checks and approach.",
      "Punish snake edge and hatchet on block every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks of his own.",
      "Backdash after blocked df+1 instead of mashing into taunt.",
    ],
    utilise: [
      "df+2 whiff punish on his slow mids.",
      "SEN mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw f+3 into a ready sidestep.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids make burst risky if you enter blindly. df+1 on reads, punish d+2 with df+2, and do not overextend into wr2 freeze.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Block his plus frames before entering SEN.",
    ],
    utilise: [
      "df+2 when he throws highs after your poke.",
      "f+3 once he has already respected df+1.",
    ],
    avoid: [
      "Do not f+2,1 into his crouch mix.",
      "Do not autopilot strings where his plus frames live.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Lars wins by not poking at limb tip, df+1 checking his highs, then bursting once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with df+2 or ws4.",
      "Make him come to you; df+1 deletes many of his approach highs.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 when he tries to press at mid-range.",
      "Heat f,F+2 once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not f+3 from full screen.",
    ],
  },
  "Lars (mirror)": {
    briefing:
      "The mirror is a patience and overextension test. The worse Lars throws burst on cooldown; the better one df+1 pokes, punishes, then enters SEN.",
    doThis: [
      "Single-hit pokes; the first committed string loses.",
      "Punish blocked f+3 and f+2,1 every time.",
    ],
    dodge: [
      "Sidestep their linear f+1+2; two rushdown characters means the first to commit loses.",
      "Step their df+2 habits after a blocked Flash Bullet and launch.",
    ],
    utilise: [
      "Throws when they start waiting for SEN timing.",
      "Heat after you already have a df+2 punish.",
    ],
    avoid: [
      "Do not both f+3 at the same time from mid-screen.",
      "Do not autopilot SEN into their df+1.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Lars df+1 checks well, but only if you stop swinging at his low stances.",
    doThis: [
      "Duck known high kick strings and launch with df+2.",
      "Use df+1 and movement against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Sidestep under some of his linear mid checks.",
    ],
    utilise: [
      "df+2 when he mashes after your poke.",
      "b+4 oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and df+2.",
    doThis: [
      "Use df+1 and movement to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "df+2 to launch every lazy wavedash entry.",
    ],
    avoid: [
      "Do not f+3 at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  King: {
    briefing:
      "Your poke beats his approach, but throws beat blocking. Prove you can break, then mix from df+1 outside grab range.",
    doThis: [
      "Use df+1 and movement to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "df+1 against his high grab setups.",
      "1+2 once he starts respecting df+1.",
    ],
    avoid: [
      "Do not stand still without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Lars makes this awkward with single-hit df+1 pokes, delayed burst, and throws.",
    doThis: [
      "Stagger df+1 and f+2,1 instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "df+2 to punish whiffs after parry attempts.",
      "f+3 so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat SEN timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. df+1 first, punish second. If you throw f+3 into a ready sidestep, she owns you.",
    doThis: [
      "Use df+1 and movement before repeating burst entries.",
      "Punish her blocked lows and hopkicks hard with df+2.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "df+2 when she throws highs after your poke.",
      "SEN mix at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw f+3 into sidestep right.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, punish her highs with df+2, then smother her when she finally has to defend.",
    doThis: [
      "Use df+1 and movement to stop sidestep approach.",
      "Fight for centre stage; her wall pressure is the danger.",
    ],
    dodge: [
      "Duck known high string enders, then launch.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "df+2 when she throws highs after your df+1.",
      "1+2 once she starts waiting for your SEN mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear df+2.",
    ],
  },
  Paul: {
    briefing:
      "Paul wants one CH to end the round. Lars wins by df+1 discipline, not trading at his favourite range, and df+2 on every whiff.",
    doThis: [
      "Use df+1 and movement; do not swing first at mid-range.",
      "Punish blocked df+2 and sweep every time.",
    ],
    dodge: [
      "Sidestep his linear deathfist approach on a read.",
      "Backdash after blocked pokes instead of mashing.",
    ],
    utilise: [
      "df+2 when he throws highs after your poke.",
      "Heat f,F+2 once you finally splat him.",
    ],
    avoid: [
      "Do not trade CH buttons with Paul.",
      "Do not f+3 into a ready deathfist.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows with df+2, and do not give predictable SEN entries.",
    doThis: [
      "Use df+1 and movement to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "df+2 once he has already committed to a whiff.",
      "f+3 at the wall where his movement matters less.",
    ],
    avoid: [
      "Do not feed df+2 with predictable retaliation.",
      "Do not throw f+2,1 on autopilot; he will duck-launch.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first with df+1, sidestep on reads, and SEN only after she whiffs or blocks.",
    doThis: [
      "Use df+1 and movement against AOP.",
      "Keep her at poke range, where your burst is faster than her scramble.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "b+4 oki once she is knocked down at the wall.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not f+2,1 into stance without a read.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Lars wins with mid discipline, df+1 on reads, and SEN mix once she is pinned.",
    doThis: [
      "Use df+1, movement, and f+3 that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with committed strings.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat f,F+2 when she starts waiting.",
      "SEN mix at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not insist on f+3 if it is already whiffing the stance.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Lars: df+1 poke, Flash Bullet df+2 punishes, and SEN burst only after they overcommit.`,
        doThis: [
          "Start with single-hit df+1 pokes before forcing burst.",
          "Punish blocked f+3 and f+2,1 every time.",
        ],
        dodge: [
          "Sidestep committed strings instead of blocking everything.",
          "Backdash after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "df+2 and ws4 once they stop pressing.",
          "SEN mix and throws after plus frames.",
        ],
        avoid: [
          "Do not throw f+3 as a raw neutral opener.",
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
  return `https://okizeme.gg/database/lars?search=${encodeURIComponent(search)}`;
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
          ? "border-amber-300 bg-amber-300 text-slate-950 shadow-lg shadow-amber-950/20"
          : "border-amber-400/35 bg-amber-400/5 text-amber-700 hover:border-amber-300 hover:bg-amber-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="amber" active={isActive} />
    </button>
  );
}

export function LarsGuide() {
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
        return "Daily reps for df+1 poke, Silent Entry routing, Flash Bullet punishes, and burst offense.";
      case "gameplan":
        return "A short round map: poke, punish, then SEN mix when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for poke tools, SEN threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Lars unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Lars Silent Entry Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Lars wins when burst offense lands after honest pokes. This guide
              leans on visual move chips, shorter drill cards, and live clips
              instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-700">
            Focus: df+1 poke, SEN f+2,1, Flash Bullet df+2, burst offense
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
                    ? "border-amber-300/70 bg-amber-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-amber-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="amber" active={isActive} />
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
            title="Daily Lars drills"
            copy="Run these as isolated reps. Each card focuses on one poke, SEN, or punish idea so the clips can do the teaching."
            accent="amber"
          />
          <GuideClipSection
            accent="amber"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
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
            title="How Lars should feel"
            copy="The opponent should block first. Once they finally respect df+1, SEN and df+2 finish the round."
            accent="amber"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="amber" />
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
            accent="amber"
          />
          <GuideClipSection
            accent="amber"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="amber" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
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
            title="Embedded Lars clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="amber"
          />
          <GuideClipSection
            accent="amber"
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
            title="The things that make Lars unfair"
            copy="The character becomes much scarier when you can see the poke routes, SEN mix, and punish windows at a glance."
            accent="amber"
          />
          <GuideClipSection
            accent="amber"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-amber-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
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
            copy="Tap a character for a fast Lars-specific plan with action cards you can scan between rounds."
            accent="amber"
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
                      ? "border-amber-300 bg-amber-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-amber-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="amber"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-amber-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Lars vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
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
                    ["Do this", activeMatchup.doThis, "text-amber-600"],
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
                  characterId="lars"
                  opponentName={activeMatchup.name}
                  accent="amber"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="lars"
                  opponentName={activeMatchup.name}
                  accent="amber"
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

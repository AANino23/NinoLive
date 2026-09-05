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

const OKIZEME_CHARACTER = "victor";

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
  { id: "dojo", label: "Dojo", icon: "IAI" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Frame data and clip URLs verified against okizeme.gg/database/victor (Tekken 8, Sep 2026).

const dojoDrills: Drill[] = [
  {
    title: "df+1 buys space for Perfumer",
    summary: "Victor wins neutral when opponents duck too early or swing at sword flash. df+1 is not filler; it is the safe mid that sets up f+3 and iai dash.",
    why: "df+1 is plus enough to threaten stance and keeps you at mid-range where f+2 and df+2 are real. If you cannot poke and enter Perfumer cleanly, every flash string becomes a coin flip.",
    drill:
      "For five minutes, play only df+1, f+3, and movement. After every blocked poke, enter Perfumer for one beat, then choose f+2, df+2, or cancel back to standing df+1.",
    cues: [
      "df+1 is the safe mid that buys space for Perfumer entry.",
      "f+3 enters Perfumer when they start respecting the poke.",
      "Do not spam stance against players who already stopped pressing.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch f+2", search: "f+2" },
    ],
  },
  {
    title: "Iai dash routing",
    summary: "The sword dash closes space once they respect df+1. f+2 is approach, whiff punish, and pressure starter in one input.",
    why: "f+2 and f,f,F+2 are Victor's kenpo step equivalents. The mix only works if you have already made them block a boring df+1 first.",
    drill:
      "From mid-range, rotate df+1, f+2, and f,f,F+2. Track whether they duck, jab, or hold low. Punish every blocked minus transition on reaction.",
    cues: [
      "f+2 is the iai dash that closes space fast.",
      "f,f,F+2 is Carnwennan; only throw it after they respect f+2.",
      "Know your block punishes cold before you gamble the dash.",
    ],
    clips: [
      { label: "Watch f+2", search: "f+2" },
      { label: "Watch f,f,F+2", search: "f,f,F+2" },
      { label: "Watch df+1", search: "df+1" },
    ],
  },
  {
    title: "Arcadia hopkick confirms",
    summary: "Victor damage comes from converting minus frames and CH windows, not from forcing mix every neutral.",
    why: "df+2 is the i15 launcher and one of Victor's best punishers. If you swing it as a block string, good players launch you back for the round.",
    drill:
      "Set the dummy to -13, -15, and CH df+1. Drill ws4, df+2, and uf+2 respectively until each punish is automatic with no extra movement.",
    cues: [
      "ws4 is the i13 standing launcher; confirm before committing.",
      "df+2 is the Arcadia hopkick punish at i15.",
      "At the wall, confirm into your bread-and-butter combo.",
    ],
    clips: [
      { label: "Watch df+2", search: "df+2" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch uf+2", search: "uf+2" },
    ],
  },
  {
    title: "Perfumer mix after respect",
    summary: "Once they stop pressing, Perfumer is where Victor stops being honest and starts being unfair.",
    why: "f+3 follow-ups and duckable highs are the real open-up layer after df+1 has already made them block. The mix only works if you have shown the boring poke first.",
    drill:
      "From df+1 or f+2 hit, enter Perfumer via f+3 and rotate b+1+2, db+4, 4,3,2 highs, and 1+2 throw. Do not repeat the same option twice.",
    cues: [
      "b+1+2 is sword flash that beats panic buttons.",
      "db+4 is the sweep that catches stand-blockers after flash.",
      "Throw when they start holding low forever.",
    ],
    clips: [
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch db+4", search: "db+4" },
      { label: "Watch 4,3,2", search: "4,3,2" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Victor has excellent punishers, but only if you know which tier you are in before the whiff happens.",
    why: "1,2, ws4, and df+2 are the ladder. Hesitating on i10 loses the round; guessing df+2 when ws4 was enough loses the combo.",
    drill:
      "Set the dummy to -10, -13, and -15 standing, then -13 and -15 after blocking a low. Drill 1,2, ws4, df+2, ws2, and ws3 until each punish is automatic.",
    cues: [
      "1,2 is the i10 jab punish.",
      "ws4 is the i13 standing launcher; confirm before committing.",
      "df+2 is the i15 launch punish; ws2 and ws3 cover crouch after blocking lows.",
    ],
    clips: [
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch ws3", search: "ws3" },
    ],
  },
  {
    title: "Patience drill: single-hit neutral",
    summary: "Most Victor losses come from overextension, not from missing combos.",
    why: "Long strings with duckable highs are what df+1 and f+2 exist to exploit on both sides. If you cannot play df+1 and movement for a full round, sword flash never gets respect.",
    drill:
      "Play three rounds using only df+1, f+2, and one Perfumer option. Track whether they start freezing, stepping, or ducking first.",
    cues: [
      "The first player to overcommit loses.",
      "Block more than you press in unfamiliar plus-frame sequences.",
      "df+2 whiff punish is the round-ender; f+2 is the opener.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+2", search: "f+2" },
      { label: "Watch f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "Heat power on momentum",
    summary: "Heat is not a panic button. It is the phase where flash routes become plus and launch punishes become guaranteed.",
    why: "H.2+3 and Heat-enhanced sword strings extend pressure after you already won neutral. Spending Heat while losing spacing wastes Victor's best comeback tool.",
    drill:
      "Activate Heat only after a whiff punish, wall-splat, or confirmed CH. Loop H.2+3, b+1+2 in Heat, and one df+2 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced flash routes after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.2+3", search: "H.2+3" },
      { label: "Watch b+1+2", search: "b+1+2" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Mid-first neutral, not flash-first",
    copy:
      "Victor is not a random stance blender. Start with df+1 and movement, iai dash when they hesitate, and only enter Perfumer once you have already made them block or whiff.",
  },
  {
    title: "Make them duck before you mix",
    copy:
      "Most players lose to Victor because they keep ducking predictable highs in his strings. Your job is to condition that habit, then punish with df+2 and f+2 — not to force flash against someone already blocking low.",
  },
  {
    title: "Punish every minus transition",
    copy:
      "Iai dash and sword flash are risks for both players. Know your block punishes cold. Victor rounds get easy once opponents realise every flash gamble costs them health.",
  },
  {
    title: "Sword flash beats panic blocks",
    copy:
      "b+1+2 versus df+2 and df+1 versus throw are the honest layers. Do not open turtles with launch-punishable highs before they have already respected your poke.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on whiff punishes, wall-splats, and confirmed CH routes. H.2+3 and enhanced flash pressure extend a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and patience button",
    when: "Use it to check, create space for f+3, and start iai routes after they block.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to f+2 or f+1+2.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f+3 / f+2",
    role: "Perfumer entry and iai dash",
    when: "Use f+3 after blocked df+1 to enter stance. f+2 closes space and whiff punishes at mid-range.",
    risk: "Raw f+2 is minus on block and launch-punishable. Do not dash on autopilot.",
    clip: { label: "Play f+2", search: "f+2" },
  },
  {
    move: "df+2",
    role: "Arcadia hopkick launcher",
    when: "Use it at i15 to punish blocked strings, whiffs, and CH confirms at mid-range.",
    risk: "High and launch-punishable on block. Confirm the punish tier before committing.",
    clip: { label: "Play df+2", search: "df+2" },
  },
  {
    move: "f,f,F+2",
    role: "Carnwennan running sword",
    when: "Use it to close space after f+2 conditioning and to whiff punish slow recoveries.",
    risk: "Committed and linear. Sidestep right beats lazy Carnwennan habits.",
    clip: { label: "Play f,f,F+2", search: "f,f,F+2" },
  },
  {
    move: "b+1+2",
    role: "Sword flash pressure",
    when: "Use it at close range to beat panic buttons and extend Perfumer strings on hit.",
    risk: "Minus on block if they know the follow-up. Pair with df+1 so they cannot hold one guard angle.",
    clip: { label: "Play b+1+2", search: "b+1+2" },
  },
  {
    move: "1,2 / ws4 / uf+2",
    role: "Punisher ladder",
    when: "Use 1,2 at i10, ws4 at i13, and uf+2 or df+2 at i15. Match the punish to the whiff before you move.",
    risk: "Over-punishing with df+2 on i13 frames gets you launched. Confirm the tier first.",
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
    move: "4,3,2 / 1+2",
    role: "String mix and throw layer",
    when: "Use 4,3,2 after plus frames to force duck habits. 1+2 is the throw layer once they respect the mid.",
    risk: "Highs in the string are duckable. Do not spam the full string against patient players.",
    clip: { label: "Play 4,3,2", search: "4,3,2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Perfumer pack",
    notes: "The stance tools that make Victor feel overwhelming before any iai mix starts.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "4,3,2", search: "4,3,2" },
    ],
  },
  {
    title: "Iai dash pack",
    notes: "Review these when you are closing space but not cashing the punish.",
    clips: [
      { label: "f+2", search: "f+2" },
      { label: "f,f,F+2", search: "f,f,F+2" },
      { label: "f+1+2", search: "f+1+2" },
      { label: "df+1", search: "df+1" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The launch and whiff punish tools worth drilling until they are automatic.",
    clips: [
      { label: "1,2", search: "1,2" },
      { label: "ws4", search: "ws4" },
      { label: "df+2", search: "df+2" },
      { label: "uf+2", search: "uf+2" },
      { label: "b+4", search: "b+4" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "df+2", search: "df+2" },
      { label: "f+2", search: "f+2" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Perfumer is the real character",
    tag: "Core identity",
    copy:
      "Iai dash is the obvious version. Perfumer stance is the one that actually makes them duck highs and sets up df+2 for the round. If f+3 entry is sloppy, Victor feels honest.",
    route:
      "Practice df+1 into f+3 from mid-range. On their duck, df+2. On their block, b+1+2 or back to df+1. Never flash before they have already committed.",
    counter:
      "If they stop ducking, go back to df+1 and throws. Do not keep forcing 4,3,2 highs into patient block.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "df+2", search: "df+2" },
    ],
  },
  {
    title: "Iai dash is bait, not autopilot",
    tag: "Approach rule",
    copy:
      "f+2 looks like free approach. It is also launch-punishable on block. Strong Victors dash after df+1 conditioning; weak ones throw it as neutral.",
    route:
      "df+1, pause, then f+2 when they hesitate. On block, take your punish lesson and go back to patience. On hit, Perfumer mix.",
    counter:
      "If they start duck-launching f+2, stop throwing it raw and use df+1 into throw instead.",
    clips: [
      { label: "f+2", search: "f+2" },
      { label: "df+1", search: "df+1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "df+2 is a punish, not a block string",
    tag: "Punish secret",
    copy:
      "Everyone knows Arcadia hopkick hurts. Fewer people remember it is for punishes and CH, not for opening turtles. Good opponents launch greedy df+2 habits.",
    route:
      "Block first, label the minus, then df+2. At mid-range use it only when they have already shown impatience.",
    counter:
      "If they stop pressing after your poke, return to df+1 and sword flash. Do not keep fishing df+2 on block.",
    clips: [
      { label: "df+2", search: "df+2" },
      { label: "ws4", search: "ws4" },
      { label: "uf+2", search: "uf+2" },
    ],
  },
  {
    title: "Duckable highs are the trap",
    tag: "String secret",
    copy:
      "Victor strings look scary because of sword flash. The highs in 4,3,2 and other routes are duckable — good players launch every greedy duck habit you train.",
    route:
      "Show df+1, then 4,3,2 to make them duck. When they duck, df+2. When they stand block, b+1+2 or throw.",
    counter:
      "If they stop ducking, stop showing highs and just take df+1 plus frames.",
    clips: [
      { label: "4,3,2", search: "4,3,2" },
      { label: "df+2", search: "df+2" },
      { label: "b+1+2", search: "b+1+2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Victor mirrors other mid-range sword characters: Lars, Claudio, Devil Jin. Two patient players mean the first df+1 string, f+2 dash, or flash gamble loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one iai dash, one punish. Repeat until they swing or duck. Then Perfumer mix.",
    counter:
      "If they mirror your patience, use throws and delayed f+2 to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+2", search: "f+2" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Heat makes sword flash expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances flash and power mids so blocking still costs health. Use it after you already have a whiff punish or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after df+2 confirm or wall-splat. Show one df+1, then H.2+3 or enhanced b+1+2. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "b+1+2", search: "b+1+2" },
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
  "Victor (mirror)",
  "Xiaoyu",
  "Yoshimitsu",
  "Zafina",
] as const;

const matchupOverrides: Partial<
  Record<(typeof matchupNames)[number], Partial<Matchup>>
> = {
  Alisa: {
    briefing:
      "She wants to leave and return with chainsaws. Victor wins by poking with df+1, punishing DES entries, and not ducking into her mids.",
    doThis: [
      "Use df+1 and f+2 to punish her linear approach tools.",
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
      "Do not enter Perfumer into DES without knowing the gap.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Asuka: {
    briefing:
      "Parries eat greedy strings. Victor wins with single-hit pokes, df+1 stagger, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and f+2 instead of finishing strings.",
      "Throw when she starts waiting for your flash timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "b+1+2 against predictable panic buttons.",
      "f+2 after she has already whiffed into your poke.",
    ],
    avoid: [
      "Do not autopilot b+1+2 into reversal.",
      "Do not repeat the same df+1 timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to duck at kick range. Victor wins by blocking first, punishing snake edge, and refusing to trade CH buttons.",
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
      "Perfumer mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw f+2 into a ready sidestep.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids make raw f+2 risky if you enter blindly. Dash on reads, punish d+2, and do not overextend into wr2 freeze.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Block his highs after plus frames, not his tracking lows.",
    ],
    utilise: [
      "df+2 when he throws highs after your poke.",
      "f+2 once he has already respected df+1.",
    ],
    avoid: [
      "Do not enter Perfumer into his crouch mix.",
      "Do not autopilot strings where his plus frames live.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Victor wins by not poking at limb tip, blocking his highs, then iai dashing once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with df+2 or f+2.",
      "Make him come to you; df+1 keeps him out of Garuda range.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 when he tries to press at mid-range.",
      "Heat flash once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not f+2 from full screen.",
    ],
  },
  Feng: {
    briefing:
      "Feng's sway deletes lazy highs and shoulders. Victor wins with mid discipline, single-hit pokes, and punishing kenpo step on block.",
    doThis: [
      "Use df+1 and f+2 to challenge his sway timing.",
      "Punish blocked shoulder and sweep every time.",
    ],
    dodge: [
      "Do not high-check after his sway whiffs.",
      "Step his linear pokes after a blocked uf+4 and launch.",
    ],
    utilise: [
      "df+2 when he throws highs after your poke.",
      "1+2 once he starts waiting for your flash mix.",
    ],
    avoid: [
      "Do not throw 4,3,2 highs into sway.",
      "Do not autopilot f+2 into kenpo step.",
    ],
  },
  "Victor (mirror)": {
    briefing:
      "The mirror is a patience and overextension test. The worse Victor throws flash on cooldown; the better one pokes, punishes, then enters Perfumer.",
    doThis: [
      "Single-hit pokes; the first committed string loses.",
      "Punish blocked f+2 and minus flash transitions every time.",
    ],
    dodge: [
      "Duck known highs in 4,3,2; both Victors train the same duck habit.",
      "Step his linear f+2 after block and launch with df+2.",
    ],
    utilise: [
      "Throws when they start waiting for iai timing.",
      "Heat after you already have a whiff punish.",
    ],
    avoid: [
      "Do not both f+2 at the same time from mid-screen.",
      "Do not autopilot Perfumer into their df+1.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Victor blocks well, but only if you stop ducking into his low stances.",
    doThis: [
      "Block known high kick strings and launch with df+2.",
      "Use df+1 and f+1+2 against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Sidestep under some of his linear mid checks.",
    ],
    utilise: [
      "df+2 when he mashes after your poke.",
      "b+1+2 oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and block discipline.",
    doThis: [
      "Use df+1 and f+2 to punish crouch dash and highs.",
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
      "Do not enter Perfumer at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  King: {
    briefing:
      "Your mids beat his approach, but throws beat blocking. Prove you can break, then mix from df+1 outside grab range.",
    doThis: [
      "Use df+1 and movement to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "b+1+2 against his high grab setups.",
      "1+2 once he starts respecting df+1.",
    ],
    avoid: [
      "Do not stand still without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Victor makes this awkward with single-hit pokes, delayed f+2, and throws.",
    doThis: [
      "Stagger df+1 and f+2 instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "df+2 to punish highs he throws after parry attempts.",
      "b+1+2 so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat flash timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. Poke first, punish second. If you throw f+2 into a ready sidestep, she owns you.",
    doThis: [
      "Use df+1 and f+2 before repeating Perfumer entries.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "df+2 when she throws highs after your poke.",
      "Perfumer mix at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw f+2 into sidestep right.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, punish her highs, then smother her when she finally has to defend.",
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
      "1+2 once she starts waiting for your flash mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear f+2.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows, and do not give predictable flash entries.",
    doThis: [
      "Use df+1 and f+1+2 to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "df+2 once he has already committed to a high.",
      "b+1+2 at the wall where his movement matters less.",
    ],
    avoid: [
      "Do not feed df+2 with predictable retaliation.",
      "Do not throw Perfumer on autopilot; he will duck-launch.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first with df+1, block on reads, and enter Perfumer only after she whiffs or blocks.",
    doThis: [
      "Use df+1 and movement against AOP.",
      "Keep her at poke range, where your f+2 is faster than her scramble.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "b+1+2 oki once she is knocked down at the wall.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not enter Perfumer into stance without a read.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Victor wins with mid discipline, df+1 on reads, and flash mix once she is pinned.",
    doThis: [
      "Use df+1, f+1+2, and b+1+2 that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with committed strings.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat flash when she starts waiting.",
      "Perfumer mix at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not insist on f+2 if it is already whiffing the stance.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Victor: poke with df+1, punish with df+2, and enter Perfumer only after they overcommit.`,
        doThis: [
          "Start with single-hit pokes before forcing sword flash.",
          "Punish blocked f+2 and minus transitions every time.",
        ],
        dodge: [
          "Duck duckable highs in their strings instead of blocking everything.",
          "Backdash after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "df+2 and f+2 once they stop pressing.",
          "Perfumer mix and throws after plus frames.",
        ],
        avoid: [
          "Do not throw f+2 as a raw neutral opener.",
          "Do not autopilot strings where their duck or parry lives.",
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
  return `https://okizeme.gg/database/victor?search=${encodeURIComponent(search)}`;
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
          ? "border-indigo-300 bg-indigo-300 text-slate-950 shadow-lg shadow-indigo-950/20"
          : "border-indigo-400/35 bg-indigo-400/5 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="indigo" active={isActive} />
    </button>
  );
}

export function VictorGuide() {
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
        return "Daily reps for df+1 pokes, iai dash routing, launch punishes, and patience.";
      case "gameplan":
        return "A short round map: poke, punish, then Perfumer mix when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for Perfumer tools, iai dash threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Victor unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Victor Iai Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Victor wins when minus frames get punished at a glance. This guide
              leans on visual move chips, shorter drill cards, and live clips
              instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-400/25 bg-indigo-400/10 px-4 py-3 text-sm text-indigo-700">
            Focus: Perfumer stance, iai dash, duckable highs, sword flash
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
                    ? "border-indigo-300/70 bg-indigo-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-indigo-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="indigo" active={isActive} />
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
            title="Daily Victor drills"
            copy="Run these as isolated reps. Each card focuses on one poke, iai dash, or punish idea so the clips can do the teaching."
            accent="indigo"
          />
          <GuideClipSection
            accent="indigo"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
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
            title="How Victor should feel"
            copy="The opponent should duck or whiff first. Once they finally respect df+1, Perfumer mix and df+2 finish the round."
            accent="indigo"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="indigo" />
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
            accent="indigo"
          />
          <GuideClipSection
            accent="indigo"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="indigo" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
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
            title="Embedded Victor clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="indigo"
          />
          <GuideClipSection
            accent="indigo"
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
            title="The things that make Victor unfair"
            copy="The character becomes much scarier when you can see the Perfumer routes, iai dash mix, and punish windows at a glance."
            accent="indigo"
          />
          <GuideClipSection
            accent="indigo"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-indigo-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-indigo-300/15 bg-indigo-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
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
            copy="Tap a character for a fast Victor-specific plan with action cards you can scan between rounds."
            accent="indigo"
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
                      ? "border-indigo-300 bg-indigo-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-indigo-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="indigo"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-indigo-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
                  Victor vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
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
                    ["Do this", activeMatchup.doThis, "text-indigo-600"],
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
                  characterId="victor"
                  opponentName={activeMatchup.name}
                  accent="indigo"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="victor"
                  opponentName={activeMatchup.name}
                  accent="indigo"
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

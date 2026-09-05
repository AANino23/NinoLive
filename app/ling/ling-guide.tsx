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

const OKIZEME_CHARACTER = "xiaoyu";

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
  { id: "dojo", label: "Dojo", icon: "AOP" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Frame data and clip URLs verified against okizeme.gg/database/xiaoyu (Tekken 8, Aug 2026).

const dojoDrills: Drill[] = [
  {
    title: "Make their highs disappear in AOP",
    summary: "Xiaoyu wins neutral when opponents swing at air. AOP is not a gimmick; it is the default answer to lazy mids and highs.",
    why: "AOP evades linear highs and many mids on startup. If you cannot enter AOP cleanly and exit on your terms, every other stance trick becomes a coin flip.",
    drill:
      "For five minutes, play only df+1, f+3, and AOP entry. After every blocked poke, hold AOP for one beat, then choose AOP.df+1, AOP.1, or cancel to standing movement.",
    cues: [
      "df+1 is the safe mid that buys space for AOP.",
      "AOP.df+1 is the plus mid that keeps you in stance.",
      "Do not spam AOP against players who already stopped pressing.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch AOP.df+1", search: "AOP.df+1" },
      { label: "Watch AOP.1", search: "AOP.1" },
    ],
  },
  {
    title: "Hypnotist mix after respect",
    summary: "Once they stop swinging, Hypnotist is where Xiaoyu stops being evasive and starts being unfair.",
    why: "HYP.1 and HYP.2 are the real open-up layer after AOP has already made them block. The mix only works if you have shown the boring AOP mid first.",
    drill:
      "From AOP, rotate AOP→HYP cancel, HYP.1, and HYP.2. Do not repeat the same option twice. Track whether they duck, jab, or hold low.",
    cues: [
      "AOP→HYP cancel is faster than raw stance entry on a read.",
      "HYP.1 is the mid that keeps pressure honest.",
      "HYP.2 is the low; only throw it after they respect HYP.1.",
    ],
    clips: [
      { label: "Watch HYP.1", search: "HYP.1" },
      { label: "Watch HYP.2", search: "HYP.2" },
      { label: "Watch AOP.df+1", search: "AOP.df+1" },
    ],
  },
  {
    title: "Rain Dance and backturn pressure",
    summary: "Backturn is not a reset. It is a second neutral where your body angle deletes their favourite answers.",
    why: "BT.1 and BT.3 turn blocked pokes into wall carries and oki routes. If you enter Rain Dance without a plan, good players just hold and punish the return.",
    drill:
      "Knock down or wall-splat, enter Rain Dance, then rotate BT.1, BT.3, and f+3+4. Practice the timing until BT options feel like one continuous string.",
    cues: [
      "BT.1 is the safe mid that keeps backturn alive.",
      "BT.3 is the low that opens turtles who panic-block high.",
      "f+3+4 is the roll that catches backdash and linear checks.",
    ],
    clips: [
      { label: "Watch BT.1", search: "BT.1" },
      { label: "Watch BT.3", search: "BT.3" },
      { label: "Watch f+3+4", search: "f+3+4" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Xiaoyu has excellent punishers, but only if you know which tier you are in before the whiff happens.",
    why: "1, ws4, and b+4 are the ladder. Hesitating on i10 loses the round; guessing i15 when i13 was enough loses the combo.",
    drill:
      "Set the dummy to -10, -13, and -15. Drill 1, ws4, and b+4 respectively until each punish is automatic with no extra movement.",
    cues: [
      "1 is the i10 jab punish and the start of many CH routes.",
      "ws4 is the i13 standing launcher; confirm before committing.",
      "b+4 is the i15 whiff punish that splats and carries.",
    ],
    clips: [
      { label: "Watch 1", search: "1" },
      { label: "Watch ws4", search: "ws4" },
      { label: "Watch b+4", search: "b+4" },
    ],
  },
  {
    title: "Launcher confirms that actually stick",
    summary: "Xiaoyu damage comes from converting every real opening, not from fishing random launchers.",
    why: "f+3 on CH, u/f+2, and ws4 all need different spacing. If your confirms are sloppy, you win neutral and lose the round anyway.",
    drill:
      "Practice f+3 CH, u/f+2, and ws4 from three ranges: close, mid, and wall. After each launcher, finish the same bread-and-butter combo until it is muscle memory.",
    cues: [
      "f+3 is the mid-range CH launcher; do not throw it as a block string.",
      "u/f+2 is the honest i15 launcher with great wall carry.",
      "At the wall, prioritize routes that splat instead of side-switching.",
    ],
    clips: [
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch u/f+2", search: "u/f+2" },
      { label: "Watch ws4", search: "ws4" },
    ],
  },
  {
    title: "Wall scramble and oki discipline",
    summary: "At the wall, Xiaoyu stops scrambling and starts pinning. Oki is where stance mix becomes a round-ender.",
    why: "df+1, AOP.df+1, and BT oki only work after you have already knocked them down with intent. Random wall contact is not oki.",
    drill:
      "Wall-splat with b+4 or u/f+2, then rotate df+1, AOP.df+1, b+3+4, and 1+4 on knockdown. Repeat until the three grounded options look similar.",
    cues: [
      "df+1 is the safe oki mid that sets up the next stance.",
      "b+3+4 is the low that catches tech and panic stand.",
      "1+4 is the throw layer once they respect the mid.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch b+3+4", search: "b+3+4" },
      { label: "Watch 1+4", search: "1+4" },
    ],
  },
  {
    title: "Heat stance flow on momentum",
    summary: "Heat is not a panic button. It is the phase where stance routes become plus and scrambles become guaranteed.",
    why: "H.u/f+2 and Heat-enhanced stance strings extend pressure after you already won neutral. Spending Heat while losing spacing wastes the best part of Xiaoyu's kit.",
    drill:
      "Activate Heat only after a knockdown, wall-splat, or confirmed CH. Loop H.u/f+2, AOP.df+1 in Heat, and one BT oki route per knockdown.",
    cues: [
      "H.u/f+2 is the Heat launcher that keeps wall momentum.",
      "Heat makes several stance strings safer; use them after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.u/f+2", search: "H.u/f+2" },
      { label: "Watch AOP.df+1", search: "AOP.df+1" },
      { label: "Watch f+1+2", search: "f+1+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Stance-first neutral, not scramble-first",
    copy:
      "Xiaoyu is not a random evasion character. Start with df+1 and movement, enter AOP when they swing, and only scramble once you have already made them whiff or block.",
  },
  {
    title: "Make highs whiff before you mix",
    copy:
      "Most players lose to Xiaoyu because they keep throwing mids and highs into AOP. Your job is to bait those swings, not to force mix against someone already blocking low.",
  },
  {
    title: "Pin them before the scramble",
    copy:
      "Mid-screen scrambles are fun but inconsistent. Fight for the wall with b+4, u/f+2, and BT carry. Xiaoyu rounds get easy once their back is pinned and oki starts.",
  },
  {
    title: "Stance mix beats panic lows",
    copy:
      "HYP.1 versus HYP.2 and BT.1 versus BT.3 are the honest 50/50 layers. Do not open turtles with launch-punishable lows before they have already respected your mids.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on knockdowns, wall-splats, and confirmed CH routes. H.u/f+2 and enhanced stance pressure extend a lead you already earned; they do not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and oki anchor",
    when: "Use it to check, create space for AOP, and start wall oki after knockdown.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to f+3 or stance.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f+3",
    role: "CH launcher and approach kick",
    when: "Use it to threaten CH at mid-range and to close space after a whiffed high.",
    risk: "Minus on block and linear. Sidestep right beats lazy f+3 habits.",
    clip: { label: "Play f+3", search: "f+3" },
  },
  {
    move: "AOP.df+1 / AOP.1",
    role: "Stance evasion and plus mid",
    when: "Use AOP after they press or after your own blocked df+1. AOP.df+1 keeps stance; AOP.1 is the quick high check.",
    risk: "AOP loses to delay mids and patient block. Do not hold it forever against turtles.",
    clip: { label: "Play AOP.df+1", search: "AOP.df+1" },
  },
  {
    move: "1 / ws4 / b+4",
    role: "Punisher ladder",
    when: "Use 1 at i10, ws4 at i13, and b+4 at i15. Match the punish to the whiff before you move.",
    risk: "Over-punishing with b+4 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws4", search: "ws4" },
  },
  {
    move: "u/f+2",
    role: "Primary launcher",
    when: "Use it as your honest i15 punish and main mid-screen combo starter when f+3 CH is not available.",
    risk: "Whiffing u/f+2 is heavily punishable. Only throw it on confirmed minus or whiff.",
    clip: { label: "Play u/f+2", search: "u/f+2" },
  },
  {
    move: "b+4",
    role: "Whiff punish and wall splat",
    when: "Use it to punish slow mids, wall-splat, and convert into Rain Dance or oki.",
    risk: "Not a neutral poke. Throwing b+4 in footsies gets counter-hit.",
    clip: { label: "Play b+4", search: "b+4" },
  },
  {
    move: "HYP.1 / HYP.2",
    role: "Hypnotist mid/low mix",
    when: "Use after AOP has already earned respect. HYP.1 for mids; HYP.2 once they start blocking high.",
    risk: "Raw Hypnotist without setup gets interrupted. Enter from AOP cancel, not from minus.",
    clip: { label: "Play HYP.1", search: "HYP.1" },
  },
  {
    move: "BT.1 / BT.3 / f+3+4",
    role: "Backturn and California roll",
    when: "Use Rain Dance after splats and knockdowns. BT.1 and BT.3 for wall mix; f+3+4 to catch backdash.",
    risk: "Backturn without wall or oki plan gets walked. Do not scramble mid-screen on autopilot.",
    clip: { label: "Play f+3+4", search: "f+3+4" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Stance pack",
    notes: "The AOP and Hypnotist routes that define Xiaoyu's neutral identity.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "AOP.df+1", search: "AOP.df+1" },
      { label: "AOP.1", search: "AOP.1" },
      { label: "HYP.1", search: "HYP.1" },
      { label: "HYP.2", search: "HYP.2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "Review these when you see the opening but hesitate on the correct button.",
    clips: [
      { label: "1", search: "1" },
      { label: "ws4", search: "ws4" },
      { label: "b+4", search: "b+4" },
      { label: "u/f+2", search: "u/f+2" },
    ],
  },
  {
    title: "Combo pack",
    notes: "Bread-and-butter confirms after f+3 CH, u/f+2, and ws4.",
    clips: [
      { label: "f+3", search: "f+3" },
      { label: "u/f+2", search: "u/f+2" },
      { label: "ws4", search: "ws4" },
      { label: "f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "Oki pack",
    notes: "The grounded and wall tools that turn knockdowns into a second guessing game.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "b+3+4", search: "b+3+4" },
      { label: "BT.1", search: "BT.1" },
      { label: "BT.3", search: "BT.3" },
      { label: "1+4", search: "1+4" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "AOP→HYP cancel is the real mix entry",
    tag: "Core identity",
    copy:
      "Raw Hypnotist is slow enough to interrupt. Cancelling AOP into HYP on a read is how Xiaoyu keeps plus frames while threatening mids and lows in the same breath.",
    route:
      "Block or evade with AOP, then cancel to HYP and rotate HYP.1 and HYP.2. Show AOP.df+1 first so they commit to a guard angle.",
    counter:
      "If they stop pressing, leave stance and return to df+1 footsies. Do not keep cancelling into mix against someone already blocking low.",
    clips: [
      { label: "AOP.df+1", search: "AOP.df+1" },
      { label: "HYP.1", search: "HYP.1" },
      { label: "HYP.2", search: "HYP.2" },
    ],
  },
  {
    title: "AOP low-crush timing beats lazy highs",
    tag: "Evasion secret",
    copy:
      "AOP does not just evade highs on paper. The low-crush window deletes hopkicks, rage arts, and panic df+1s if you enter on their startup instead of after their block.",
    route:
      "After your df+1, hold AOP as they swing. On successful evade, immediately AOP.df+1 or cancel to HYP. Practice the timing against common i12-i15 highs.",
    counter:
      "Delay mids and lows beat empty AOP. If they stopped throwing highs, stop entering AOP without a read.",
    clips: [
      { label: "AOP.1", search: "AOP.1" },
      { label: "AOP.df+1", search: "AOP.df+1" },
      { label: "df+1", search: "df+1" },
    ],
  },
  {
    title: "Rain Dance oki is a flowchart, not a gimmick",
    tag: "Oki secret",
    copy:
      "BT.1, BT.3, and f+3+4 form a real oki tree at the wall. The win is showing BT.1 until they respect it, then cashing BT.3 or the roll when they panic.",
    route:
      "Wall-splat, enter Rain Dance, knock down, then rotate BT.1, BT.3, and f+3+4. Add 1+4 once they start blocking mid.",
    counter:
      "If they delay tech or backroll consistently, stop rolling on autopilot and take df+1 plus instead.",
    clips: [
      { label: "BT.1", search: "BT.1" },
      { label: "BT.3", search: "BT.3" },
      { label: "f+3+4", search: "f+3+4" },
    ],
  },
  {
    title: "df+1 CH is a win condition, not a poke",
    tag: "CH trap",
    copy:
      "Everyone treats df+1 as safe. On counter-hit it opens f+3, u/f+2, and wall routes that other characters cannot replicate from the same button.",
    route:
      "Use df+1 when they are about to press. On CH, confirm into launcher or wall carry. At the wall, this becomes a round-ending habit.",
    counter:
      "If they stop pressing after df+1, switch to AOP evade or throw. Do not keep fishing CH against turtles.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "u/f+2", search: "u/f+2" },
    ],
  },
  {
    title: "Heat turns scramble into guaranteed pressure",
    tag: "Heat rule",
    copy:
      "Heat is strongest when Xiaoyu already has wall or knockdown. H.u/f+2 and enhanced stance strings extend oki and make BT routes much harder to escape cleanly.",
    route:
      "Activate Heat after splat or knockdown. Loop H.u/f+2, AOP.df+1 in Heat, and one full BT oki sequence before spending the bar on random neutral.",
    counter:
      "If they start backdashing Heat routes, use f+3+4 and df+1 to catch space instead of forcing the same launcher.",
    clips: [
      { label: "H.u/f+2", search: "H.u/f+2" },
      { label: "AOP.df+1", search: "AOP.df+1" },
      { label: "BT.1", search: "BT.1" },
    ],
  },
  {
    title: "California roll catches backdash greed",
    tag: "Movement secret",
    copy:
      "f+3+4 is not just style. It low-crushes, catches backdash, and keeps backturn alive when opponents try to escape Rain Dance oki by running away.",
    route:
      "After BT.1 or blocked df+1 oki, watch for backdash and f+3+4. Pair it with BT.3 so they cannot hold one guard angle forever.",
    counter:
      "If they stop backdashing and start ducking, return to BT.1 and 1+4 instead of rolling on autopilot.",
    clips: [
      { label: "f+3+4", search: "f+3+4" },
      { label: "BT.1", search: "BT.1" },
      { label: "BT.3", search: "BT.3" },
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
  "Victor",
  "Xiaoyu (mirror)",
  "Yoshimitsu",
  "Zafina",
] as const;

const matchupOverrides: Partial<
  Record<(typeof matchupNames)[number], Partial<Matchup>>
> = {
  Alisa: {
    briefing:
      "Alisa wants to leave and return with chainsaws. Xiaoyu wins by making her swing into AOP, then pinning her before DES can reset the pace.",
    doThis: [
      "Use df+1 and AOP to punish her linear approach tools.",
      "Wall-splat early; her backdash escapes mid-screen scrambles.",
    ],
    dodge: [
      "Sidestep her rocket approaches and launch the landing.",
      "Block chainsaws first, then punish the identified ender.",
    ],
    utilise: [
      "Rain Dance oki once she is knocked down at the wall.",
      "HYP mix after she has already whiffed a high into AOP.",
    ],
    avoid: [
      "Do not chase her backdash with f+3+4 from full screen.",
      "Do not enter AOP against DES without knowing the gap.",
    ],
  },
  Asuka: {
    briefing:
      "Parries eat greedy strings. Xiaoyu wins with single-hit pokes, AOP evades, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and f+3 instead of finishing strings.",
      "Throw when she starts waiting for your AOP timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "AOP low-crush against predictable highs.",
      "BT oki at the wall where parry timing gets tight.",
    ],
    avoid: [
      "Do not autopilot HYP.2 into reversal.",
      "Do not repeat the same AOP→HYP timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range. Xiaoyu wins by evading highs in AOP, punishing snake edge, and pinning before hatchet mix starts.",
    doThis: [
      "Hold AOP against his high checks and df+1 approach.",
      "Punish snake edge and hatchet on block every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks of his own.",
      "Backdash after blocked df+1 instead of mashing into taunt.",
    ],
    utilise: [
      "b+4 whiff punish on his slow mids.",
      "Rain Dance oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw u/f+2 into a ready sidestep.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids and tracking lows make AOP risky if you enter blindly. Mid-check first, evade second, scramble only after a whiff.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Do not chase backturn against his d+2 tracking.",
    ],
    utilise: [
      "AOP when he throws highs after plus frames.",
      "Wall BT oki where his sidestep matters less.",
    ],
    avoid: [
      "Do not high-check his crouch mix.",
      "Do not scramble mid-screen into SNK 2.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Xiaoyu evades well in AOP, but only if you stop swinging at his low stances.",
    doThis: [
      "Duck known high kick strings and launch.",
      "Use df+1 and AOP against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "f+3+4 under some of his linear mid checks at the wall.",
    ],
    utilise: [
      "df+1 CH when he mashes after your poke.",
      "Rain Dance oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. Track first with df+1, evade second in AOP, then pin at the wall where her walk matters less.",
    doThis: [
      "Use df+1 and f+3 before repeating AOP entries.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "AOP when she throws highs after your poke.",
      "BT oki at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw f+3 into sidestep right.",
      "Do not chase her backdash with scramble.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Xiaoyu wins by not poking at limb tip, evading highs in AOP, then pinning once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with b+4 or u/f+2.",
      "Make him come to you; AOP deletes many of his highs.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 CH routes when he tries to press at mid-range.",
      "Heat wall carry once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not enter Rain Dance from far minus.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and AOP.",
    doThis: [
      "Use df+1 and AOP to punish crouch dash and highs.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "Wall oki once you have already splatted him.",
    ],
    avoid: [
      "Do not scramble at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  King: {
    briefing:
      "Your evasion beats his approach, but throws beat blocking. Prove you can break, then mix from stance outside grab range.",
    doThis: [
      "Use df+1 and f+3 to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "AOP against his high grab setups.",
      "1+4 once he starts respecting df+1 oki.",
    ],
    avoid: [
      "Do not stand still in AOP without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  Kunimitsu: {
    briefing:
      "Season 3 Kunimitsu is speed and misdirection. Do not chase teleports; hold space, evade on re-entry, then pin her at the wall.",
    doThis: [
      "Hold centre stage and let her run into df+1 / AOP.",
      "Punish blocked flip and teleport follow-ups once identified.",
    ],
    dodge: [
      "Step linear dash-ins, but do not chase after teleports.",
      "Use fast mids when she tries to low-profile past you.",
    ],
    utilise: [
      "Rain Dance oki at the wall where mobility dies.",
      "HYP mix after she whiffs a high into AOP.",
    ],
    avoid: [
      "Do not swing at where she was.",
      "Do not scramble before she is actually pinned.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Xiaoyu makes this awkward with single-hit pokes, delayed AOP, and throws.",
    doThis: [
      "Stagger df+1 and f+3 instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "AOP to evade highs he throws after parry attempts.",
      "BT oki so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat AOP→HYP timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, evade her highs in AOP, then smother her when she finally has to defend.",
    doThis: [
      "Use df+1 and movement to stop sidestep approach.",
      "Fight for centre stage; her wall pressure is the danger.",
    ],
    dodge: [
      "Duck known high string enders, then launch.",
      "Backdash after blocked pokes before swinging.",
    ],
    utilise: [
      "AOP when she throws highs after your df+1.",
      "1+4 once she starts waiting for your stance mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear f+3.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows, and do not give predictable AOP entries.",
    doThis: [
      "Use df+1 and AOP to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "HYP mix once he has already committed to a high.",
      "Wall Rain Dance where his movement matters less.",
    ],
    avoid: [
      "Do not feed b+1 with predictable retaliation.",
      "Do not throw AOP.1 on autopilot; he will duck-launch highs.",
    ],
  },
  "Xiaoyu (mirror)": {
    briefing:
      "The mirror is an AOP read and wall-pin test. The worse Xiaoyu scrambles mid-screen; the better one evades, splats, and okis.",
    doThis: [
      "Mid-check first; do not both enter AOP at the same time.",
      "Fight for wall splat with b+4 and u/f+2.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Punish empty AOP with df+1 CH or throw.",
    ],
    utilise: [
      "Your oki is better than theirs if you pin first.",
      "Heat after knockdown, not after losing neutral.",
    ],
    avoid: [
      "Do not mirror scramble without wall intent.",
      "Do not throw HYP.2 before showing HYP.1.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Xiaoyu wins with mid discipline, AOP on reads, and wall oki once she is pinned.",
    doThis: [
      "Use df+1, f+3, and AOP that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with u/f+2.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and 1+4 when she starts waiting in stance.",
      "Rain Dance oki at the wall where her movement dies.",
    ],
    avoid: [
      "Do not throw highs into low-profile stances.",
      "Do not enter AOP without a read against delay mids.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Xiaoyu: stance-first neutral with df+1, make highs whiff in AOP, then pin with b+4 or u/f+2 and oki with Hypnotist / Rain Dance at the wall.`,
        doThis: [
          "Start with df+1 and movement before forcing AOP.",
          "Wall-splat before you start scrambling mid-screen.",
        ],
        dodge: [
          "Do not chase backturn without a read on the return.",
          "Backdash after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "AOP evasion once they start throwing highs.",
          "HYP.1 versus HYP.2 and BT oki after knockdown.",
        ],
        avoid: [
          "Do not high-check patient blockers.",
          "Do not burn Heat trying to fix bad spacing.",
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
  return `https://okizeme.gg/database/xiaoyu?search=${encodeURIComponent(search)}`;
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
          ? "border-rose-300 bg-rose-300 text-slate-950 shadow-lg shadow-rose-950/20"
          : "border-rose-400/35 bg-rose-400/5 text-rose-700 hover:border-rose-300 hover:bg-rose-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="rose" active={isActive} />
    </button>
  );
}

export function LingGuide() {
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
        return "Daily reps for AOP evasion, Hypnotist mix, Rain Dance pressure, and wall oki.";
      case "gameplan":
        return "A short round map: stance first, make highs whiff, then scramble at the wall.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for stances, punishers, staple combos, and knockdown oki.";
      case "secrets":
        return "The habits that make Ling unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-10 space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
          Tekken 8
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Ling Xiaoyu Phoenix Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Ling wins when stance switches feel obvious at a glance. This
              guide leans on visual move chips, shorter drill cards, and live
              clips instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-700">
            Focus: AOP, Hypnotist, Rain Dance, punishers, wall oki
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-inner shadow-slate-200/70 sm:grid-cols-2 lg:grid-cols-3">
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
                    ? "border-rose-300/70 bg-rose-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-rose-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  <GuideTabGlyph tabId={tab.id} accent="rose" active={isActive} />
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

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
          {activeCopy}
        </p>

        <NotationLegend className="mt-6" />
      </section>

      {activeTab === "dojo" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Dojo"
            title="Daily Ling drills"
            copy="Run these as isolated reps. Each card focuses on one stance, punish, or mix idea so the clips can do the teaching."
            accent="rose"
          />
          <GuideClipSection
            accent="rose"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
          >
              {dojoDrills.map((drill) => (
                <article
                  key={drill.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                        Why it matters
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {drill.why}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
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
            title="How Ling should feel"
            copy="The opponent should feel lost after two blocked mids. Once they stop pressing highs, Hypnotist and Rain Dance finish the round."
            accent="rose"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6"
              >
                <StepBadge step={index + 1} accent="rose" />
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
            accent="rose"
          />
          <GuideClipSection
            accent="rose"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="md:grid-cols-2"
          >
              {toolkit.map((tool) => (
                <article
                  key={tool.move}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="rose" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                        When to use it
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {tool.when}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-4">
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
            title="Embedded Ling clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="rose"
          />
          <GuideClipSection
            accent="rose"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {clipPacks.map((pack) => (
                <article
                  key={pack.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-6"
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
            title="The things that make Ling unfair"
            copy="The character becomes much scarier when you can see the stance cancels, AOP low-crush routes, and Rain Dance oki at a glance."
            accent="rose"
          />
          <GuideClipSection
            accent="rose"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-rose-400/15 bg-white/80 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                        Route
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {secret.route}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4">
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
            copy="Tap a character for a fast Ling-specific plan with action cards you can scan between rounds."
            accent="rose"
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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "border-rose-300 bg-rose-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-rose-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="rose"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-rose-300/20 bg-white/85 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                  Ling vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
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
                      className="rounded-2xl border border-slate-200 bg-white/80 p-5"
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
                  characterId="ling"
                  opponentName={activeMatchup.name}
                  accent="violet"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="ling"
                  opponentName={activeMatchup.name}
                  accent="rose"
                  bullets={activeMatchup}
                />
              </article>
            </GuideClipSection>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 text-sm leading-7 text-slate-500">
              Pick a character and the briefing appears here.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

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

const OKIZEME_CHARACTER = "law";

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
  { id: "dojo", label: "Dojo", icon: "DSS" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "df+1 backbone and spacing",
    summary: "Law wins neutral when df+1 controls mid-range. Every DSS entry and slide mix starts from a poke they already respect.",
    why: "df+1 is the safe mid that buys space for f+2, f+3, and stance. If you cannot poke cleanly and stop repeating it on duck, the junkyard never gets respect.",
    drill:
      "For five minutes, play only df+1, movement, and one follow-up. After every blocked df+1, choose f+2, f+3, or backdash — never the same option twice in a row.",
    cues: [
      "df+1 is the default mid that keeps Law honest at range.",
      "f+2 is the fast mid follow-up when they stop ducking.",
      "Do not finish 1,2 on block unless you know the punish.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+2", search: "f+2" },
      { label: "Watch 1,2", search: "1,2" },
    ],
  },
  {
    title: "Dragon Sign Stance routing",
    summary: "DSS is where Law stops poking and starts mixing. The stance only works after df+1 or f+3 has already made them block.",
    why: "DSS.1, DSS.2, and DSS.f+1 are the open-up layer. Entering stance without a read turns every mix into a block contest.",
    drill:
      "From df+1 hit or blocked f+3, enter DSS and rotate DSS.1, DSS.2, and DSS.f+3. Track whether they duck, jab, or hold low.",
    cues: [
      "DSS.1 is the low that catches stand-blockers.",
      "DSS.2 is the mid check that keeps stance alive.",
      "DSS.f+3 is the slide extension after they respect the low.",
    ],
    clips: [
      { label: "Watch DSS.1", search: "DSS.1" },
      { label: "Watch DSS.2", search: "DSS.2" },
      { label: "Watch DSS.f+3", search: "DSS.f+3" },
    ],
  },
  {
    title: "f+3 slide and junkyard mix",
    summary: "The slide closes space and sets up DSS. Junkyard is not random — it is the payoff after they have already blocked your pokes.",
    why: "f+3 is Law's approach tool. On hit it starts real pressure; on block it still routes into DSS.f+3 or back to df+1 if you know the frame trap.",
    drill:
      "From mid-range, rotate df+1, f+3, and f+1+2. After blocked f+3, enter DSS or take your block punish before repeating the slide.",
    cues: [
      "f+3 is the slide that closes distance fast.",
      "DSS.f+3 extends the junkyard after they respect the entry.",
      "Know your block punishes before you gamble the slide.",
    ],
    clips: [
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch DSS.f+3", search: "DSS.f+3" },
      { label: "Watch f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "df+2 hopkick and whiff punish",
    summary: "Law damage comes from punishing impatience at hopkick range, not from forcing mix every neutral.",
    why: "df+2 is the hopkick launcher. If you throw it as a block string, good players launch you back for the round.",
    drill:
      "Set the dummy to press after your df+1 whiffs or after f+3 recovery. Drill df+2 on every recovery until the punish is automatic.",
    cues: [
      "df+1 first, hopkick second on their swing.",
      "df+2 also works as a CH tool at mid-range on reads.",
      "At the wall, confirm into your bread-and-butter combo.",
    ],
    clips: [
      { label: "Watch df+2", search: "df+2" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch uf+2", search: "uf+2" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Law has excellent punishers, but only if you know which tier you are in before the whiff happens.",
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
    title: "Punch parry conditioning",
    summary: "Law's punch parry turns their offense into your turn. The drill is about baiting swings, not about mashing parry on every poke.",
    why: "Parry only works when they commit. If you parry on autopilot against patient blockers, you eat df+1 and throws for free.",
    drill:
      "Play three rounds using df+1, movement, and parry only after they have swung twice in the same rhythm. Punish every successful parry with 1,2 or df+2.",
    cues: [
      "Parry after you have already shown df+1 patience.",
      "Do not parry against players who already stopped pressing.",
      "On parry success, take the guaranteed follow-up before mixing.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
  {
    title: "Heat power on momentum",
    summary: "Heat is not a panic button. It is the phase where DSS routes become plus and whiff punishes become guaranteed.",
    why: "H.2+3 and H.uf+2 extend pressure after you already won neutral. Spending Heat while losing spacing wastes Law's best comeback tool.",
    drill:
      "Activate Heat only after a df+2 launch, wall-splat, or confirmed CH. Loop H.2+3, DSS.f+1, and one uf+2 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced DSS routes after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.2+3", search: "H.2+3" },
      { label: "Watch H.uf+2", search: "H.uf+2" },
      { label: "Watch f,F+2", search: "f,F+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Poke-first neutral, not slide-first",
    copy:
      "Law is not a random stance blender. Start with df+1 and movement, threaten f+2 and f+3 once they respect the poke, and only enter DSS after they block.",
  },
  {
    title: "Make them swing before you parry",
    copy:
      "Most players lose to Law because they keep throwing committed offense into punch parry reads. Your job is to bait those swings with df+1, not to force DSS against someone already blocking low.",
  },
  {
    title: "Punish everything on block",
    copy:
      "Slide and hopkick are risks for both players. Know your block punishes cold. Law rounds get easy once opponents realise every junkyard gamble costs them health.",
  },
  {
    title: "Patience beats panic",
    copy:
      "df+2 versus f+3 and df+1 versus throw are the honest layers. Do not open turtles with launch-punishable DSS lows before they have already respected your slide.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on df+2 launches, wall-splats, and confirmed CH routes. Enhanced junkyard pressure extends a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and patience button",
    when: "Use it to check, create space for f+2 and f+3, and start DSS routes after they block.",
    risk: "It is not a launcher. If they duck, stop repeating it and switch to f+3 or df+2 on a read.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f+2",
    role: "Fast mid check",
    when: "Use it after df+1 when they stop ducking. Good CH tool that keeps Law threatening at mid-range.",
    risk: "Linear and punishable on block if thrown raw. Pair it with df+1 so they cannot hold one guard angle.",
    clip: { label: "Play f+2", search: "f+2" },
  },
  {
    move: "f+3",
    role: "Slide approach and junkyard entry",
    when: "Use it to close space after df+1 has made them hesitate. On hit it starts real pressure and DSS routes.",
    risk: "Minus on block and launch-punishable if thrown without a read. Know the punish before you slide.",
    clip: { label: "Play f+3", search: "f+3" },
  },
  {
    move: "df+2",
    role: "Hopkick launcher",
    when: "Use it on their recovery after df+1 makes them whiff, and as a CH tool at mid-range on reads.",
    risk: "Launch-punishable on block. Confirm the whiff or CH before committing.",
    clip: { label: "Play df+2", search: "df+2" },
  },
  {
    move: "DSS.1 / DSS.2",
    role: "Dragon Sign Stance mix",
    when: "Use DSS after plus frames or blocked f+3 to open turtles. Rotate low and mid before repeating.",
    risk: "DSS without a read becomes a block contest. Do not spam stance against patient players.",
    clip: { label: "Play DSS.1", search: "DSS.1" },
  },
  {
    move: "1 / ws4 / uf+2",
    role: "Punisher ladder",
    when: "Use 1 at i10, ws4 at i13, and uf+2 at i15. Match the punish to the whiff before you move.",
    risk: "Over-punishing with uf+2 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws4", search: "ws4" },
  },
  {
    move: "b+4,3 / ws2",
    role: "String pressure and wakeup tool",
    when: "Use b+4,3 at the wall for chip and spacing. ws2 is the dragon uppercut on wakeup and whiff punishes.",
    risk: "b+4,3 is launch-punishable on block if they know the gap. ws2 whiffs badly if they block low.",
    clip: { label: "Play ws2", search: "ws2" },
  },
  {
    move: "f+1+2 / 1+2",
    role: "Power mid and throw layer",
    when: "Use f+1+2 to threaten at mid-range after they respect df+1. 1+2 is the throw layer once they respect the low.",
    risk: "Linear f+1+2 loses to sidestep right. Do not throw against players already breaking every attempt.",
    clip: { label: "Play f+1+2", search: "f+1+2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Poke pack",
    notes: "The mid-range tools that make Law feel honest before any junkyard mix starts.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+2", search: "f+2" },
      { label: "1,2", search: "1,2" },
      { label: "df+2", search: "df+2" },
    ],
  },
  {
    title: "DSS pack",
    notes: "Review these when you are entering Dragon Sign Stance but not cashing the mix.",
    clips: [
      { label: "DSS.1", search: "DSS.1" },
      { label: "DSS.2", search: "DSS.2" },
      { label: "DSS.f+1", search: "DSS.f+1" },
      { label: "DSS.f+3", search: "DSS.f+3" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The whiff punish and launcher tools worth drilling until they are automatic.",
    clips: [
      { label: "1", search: "1" },
      { label: "ws4", search: "ws4" },
      { label: "uf+2", search: "uf+2" },
      { label: "df+2", search: "df+2" },
      { label: "ws2", search: "ws2" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "H.uf+2", search: "H.uf+2" },
      { label: "f,F+2", search: "f,F+2" },
      { label: "f+3", search: "f+3" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "df+1 is the real character",
    tag: "Core identity",
    copy:
      "DSS is the obvious version. df+1 is the one that actually controls neutral and sets up f+3 and df+2 for the round. If poking is sloppy, Law feels honest.",
    route:
      "Practice df+1 into movement from mid-range. On their whiff, df+2. On their block, f+3 or back to df+1. Never enter DSS before they have already committed.",
    counter:
      "If they stop pressing, go back to df+1 and throws. Do not keep sliding into delay mids.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+2", search: "f+2" },
      { label: "df+2", search: "df+2" },
    ],
  },
  {
    title: "Slide is bait, not autopilot",
    tag: "Junkyard rule",
    copy:
      "f+3 looks like free approach. It is also launch-punishable on block. Strong Laws slide after df+1 conditioning; weak ones throw it as neutral.",
    route:
      "df+1, movement, then f+3 when they hesitate. On block, take your punish lesson and go back to patience. On hit, DSS mix.",
    counter:
      "If they start duck-launching slide, stop throwing it raw and use df+1 into throw instead.",
    clips: [
      { label: "f+3", search: "f+3" },
      { label: "df+1", search: "df+1" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "df+2 is a whiff punish, not a block string",
    tag: "Punish secret",
    copy:
      "Everyone knows df+2 hurts. Fewer people remember it is for whiffs and CH, not for opening turtles. Good opponents launch greedy hopkick habits.",
    route:
      "df+1 first, wait for the swing, then df+2. At mid-range use it only when they have already shown impatience.",
    counter:
      "If they stop swinging after your poke, return to f+3 and DSS. Do not keep fishing df+2 on block.",
    clips: [
      { label: "df+2", search: "df+2" },
      { label: "df+1", search: "df+1" },
      { label: "uf+2", search: "uf+2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Law mirrors other evasive rushdown characters: Steve, Xiaoyu, Feng. Two patient players mean the first df+1 string, slide loop, or DSS gamble loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one slide, one punish. Repeat until they swing. Then punch parry or DSS.",
    counter:
      "If they mirror your patience, use throws and delayed f+3 to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "DSS mix beats panic lows",
    tag: "Stance secret",
    copy:
      "DSS.1 versus DSS.2 and throw is the honest 50/50 layer. Do not open turtles with launch-punishable DSS lows before they have already respected your slide.",
    route:
      "f+3 on hit or df+1 at plus, enter DSS, rotate low, mid, and throw. Show the boring option first.",
    counter:
      "If they delay tech or backroll consistently, stop DSS on autopilot and just take df+1.",
    clips: [
      { label: "DSS.1", search: "DSS.1" },
      { label: "DSS.2", search: "DSS.2" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Heat makes junkyard expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances DSS and power mids so blocking still costs health. Use it after you already have a df+2 launch or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after df+2 confirm or wall-splat. Show one df+1, then H.2+3 or H.uf+2. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "H.uf+2", search: "H.uf+2" },
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
  "Law (mirror)",
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
      "She wants to leave and return with chainsaws. Law wins by poking with df+1, parrying her linear approach, then punishing DES entries with df+2.",
    doThis: [
      "Use df+1 and movement to punish her linear approach tools.",
      "Block chainsaws first, then punish the identified ender.",
    ],
    dodge: [
      "Sidestep her rocket approaches and launch the landing.",
      "Backdash after blocked DESTINY sequences instead of mashing.",
    ],
    utilise: [
      "df+2 when she hesitates after a whiffed high.",
      "f+3 into DSS once she is wall-splatted.",
    ],
    avoid: [
      "Do not slide into DES without knowing the gap.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Asuka: {
    briefing:
      "Parries eat greedy strings. Law wins with single-hit df+1 pokes, punch parry on reads, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and f+2 instead of finishing 1,2.",
      "Throw when she starts waiting for your slide timing.",
    ],
    dodge: [
      "Duck her obvious high panic buttons, then launch.",
      "Step her linear hopkicks and punish recovery.",
    ],
    utilise: [
      "Punch parry against predictable highs.",
      "f+3 after she has already whiffed into your evasion.",
    ],
    avoid: [
      "Do not autopilot f+3 into reversal.",
      "Do not repeat the same parry timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range. Law wins by df+1 poking, parrying highs, punishing snake edge, and refusing to trade CH buttons.",
    doThis: [
      "Hold df+1 against his high checks and approach.",
      "Punish snake edge and hatchet on block every time.",
    ],
    dodge: [
      "Sidestep right against raw linear kicks of his own.",
      "Backdash after blocked df+1 instead of mashing into taunt.",
    ],
    utilise: [
      "uf+2 whiff punish on his slow mids.",
      "DSS mix once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade CH buttons at his favourite range.",
      "Do not throw f+3 into a ready sidestep.",
    ],
  },
  Dragunov: {
    briefing:
      "Dragunov's plus mids make slide risky if you enter blindly. Poke with df+1, punish d+2, and do not overextend into wr2 freeze.",
    doThis: [
      "Use df+1 and movement to make his wr2 whiff.",
      "Punish blocked d+2; it is not plus on hit.",
    ],
    dodge: [
      "Sidestep right against raw wr2 and SNK 4.",
      "Block his plus frames before entering DSS.",
    ],
    utilise: [
      "df+2 when he throws highs after your poke.",
      "f+3 once he has already respected df+1.",
    ],
    avoid: [
      "Do not slide into his crouch mix.",
      "Do not autopilot strings where his plus frames live.",
    ],
  },
  Fahkumram: {
    briefing:
      "His legs outrange yours. Law wins by not poking at limb tip, df+1 at safe range, then f+3 once he is forced to approach.",
    doThis: [
      "Block standing 3 and df+4, then punish with uf+2 or df+2.",
      "Make him come to you; parry deletes many of his highs.",
    ],
    dodge: [
      "Sidestep linear Garuda strings before the charge completes.",
      "Duck b,f+4 on a read and launch the high.",
    ],
    utilise: [
      "df+1 when he tries to press at mid-range.",
      "Heat H.2+3 once you finally splat him.",
    ],
    avoid: [
      "Do not poke at the end of his legs.",
      "Do not f+3 from full screen.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Law pokes well, but only if you stop sliding at his low stances.",
    doThis: [
      "Duck known high kick strings and launch.",
      "Use df+1 and parry against his high answers.",
    ],
    dodge: [
      "Backdash out of flamingo range when your turn is unclear.",
      "Block under some of his linear mid checks.",
    ],
    utilise: [
      "df+2 when he mashes after your poke.",
      "DSS oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not high-check flamingo on reaction.",
      "Do not panic-press into Left Flamingo pressure.",
    ],
  },
  Jin: {
    briefing:
      "Jin's wave dash and plus mids demand patience. Law wins by df+1 spacing, punishing hellsweep, and saving f+3 for confirmed openings.",
    doThis: [
      "Use df+1 to check wavedash entries.",
      "Launch blocked hellsweep without hesitation.",
    ],
    dodge: [
      "Sidestep right against linear EWGF when you can.",
      "Backdash after blocked pokes; do not mash into pewgf.",
    ],
    utilise: [
      "Throws when he starts waiting for hellsweep.",
      "uf+2 to punish every lazy mid whiff.",
    ],
    avoid: [
      "Do not slide at wavedash range.",
      "Do not give up centre stage for free.",
    ],
  },
  Kazuya: {
    briefing:
      "Keep him outside wavedash range. One knockdown turns the round into hellsweep roulette, so tax the approach with df+1 and parry.",
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
      "Your pokes beat his approach, but throws beat blocking. Prove you can break, then mix from df+1 outside grab range.",
    doThis: [
      "Use df+1 and movement to keep him out of throw range.",
      "Break 1+2 and 1+4 on reaction as the default.",
    ],
    dodge: [
      "Duck command grabs on hard reads only.",
      "Step Jaguar Sprint and punish.",
    ],
    utilise: [
      "Parry against his high grab setups.",
      "1+2 once he starts respecting df+1.",
    ],
    avoid: [
      "Do not stand still without a throw break plan.",
      "Do not low-check out of fear into a grab.",
    ],
  },
  "Law (mirror)": {
    briefing:
      "The mirror is a patience and overextension test. The worse Law throws slide on cooldown; the better one pokes, parries, then enters DSS.",
    doThis: [
      "Single-hit df+1; the first committed string loses.",
      "Punish blocked f+3 and df+2 every time.",
    ],
    dodge: [
      "Parry mirror slide on a read; two rushdown characters means the first to commit loses.",
      "Step his linear uf+2 after block and launch.",
    ],
    utilise: [
      "Throws when they start waiting for junkyard timing.",
      "Heat after you already have a df+2 launch.",
    ],
    avoid: [
      "Do not both slide at the same time from mid-screen.",
      "Do not autopilot DSS into their parry.",
    ],
  },
  Leroy: {
    briefing:
      "Leroy wants predictable strings into parry. Law makes this awkward with single-hit df+1, delayed f+3, and throws.",
    doThis: [
      "Stagger df+1 and f+2 instead of finishing strings.",
      "Throw when he starts holding for parry.",
    ],
    dodge: [
      "Step his linear hermit pressure.",
      "Backdash after a parry before swinging again.",
    ],
    utilise: [
      "Punch parry to evade highs he throws after parry attempts.",
      "DSS so blocking still costs him at the wall.",
    ],
    avoid: [
      "Do not repeat slide timing into parry.",
      "Do not mentally collapse after one parry; change rhythm.",
    ],
  },
  Lili: {
    briefing:
      "Her movement is the matchup. df+1 first, punish second. If you throw f+3 into a ready sidestep, she owns you.",
    doThis: [
      "Use df+1 and movement before repeating slide entries.",
      "Punish her blocked lows and hopkicks hard.",
    ],
    dodge: [
      "Do not sidewalk with her; take small steps and block.",
      "Duck her obvious high approach tools on a read.",
    ],
    utilise: [
      "Parry when she throws highs after your poke.",
      "DSS mix at the wall where mobility dies.",
    ],
    avoid: [
      "Do not raw f+3 into sidestep right.",
      "Do not chase her backdash with committed strings.",
    ],
  },
  Nina: {
    briefing:
      "Nina wants range 0 and the wall. Keep her out with df+1, parry her highs, then smother her when she finally has to defend.",
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
      "1+2 once she starts waiting for your DSS mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear uf+2.",
    ],
  },
  Paul: {
    briefing:
      "Paul's damage is the threat. Law wins by not trading at his range, df+1 poking safely, and punishing whiffed launchers with uf+2.",
    doThis: [
      "Stay at df+1 range; do not slide into his CH buttons.",
      "Punish blocked df+2 and launchers on reaction.",
    ],
    dodge: [
      "Sidestep his linear power mids on a read.",
      "Backdash after blocked pokes instead of mashing.",
    ],
    utilise: [
      "df+2 when he swings after your poke.",
      "DSS oki once he is wall-splatted.",
    ],
    avoid: [
      "Do not trade f+1+2 at his favourite range.",
      "Do not panic-slide after one blocked df+1.",
    ],
  },
  Steve: {
    briefing:
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows, and do not give predictable slide entries.",
    doThis: [
      "Use df+1 and parry to challenge his evasive posture.",
      "Punish db+3,2 and duckable highs hard.",
    ],
    dodge: [
      "Sidestep-right duck covers a lot of his linear offense.",
      "Backdash after blocked Flicker pressure before swinging.",
    ],
    utilise: [
      "Parry once he has already committed to a high.",
      "f+3 at the wall where his movement matters less.",
    ],
    avoid: [
      "Do not feed uf+2 with predictable retaliation.",
      "Do not throw f+3 on autopilot; he will duck-launch.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP deletes lazy highs. Play mid-first with df+1, parry on reads, and DSS only after she whiffs or blocks.",
    doThis: [
      "Use df+1 and movement against AOP.",
      "Keep her at poke range, where your slide is faster than her scramble.",
    ],
    dodge: [
      "Do not chase backturn; wait for the return option.",
      "Step her linear Rain Dance exits and punish.",
    ],
    utilise: [
      "Throws when she starts holding AOP forever.",
      "DSS oki once she is knocked down at the wall.",
    ],
    avoid: [
      "Do not high-check AOP.",
      "Do not f+3 into stance without a read.",
    ],
  },
  Zafina: {
    briefing:
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Law wins with mid discipline, df+1 on reads, and DSS once she is pinned.",
    doThis: [
      "Use df+1, f+2, and f+3 that actually touch mantis/tarantula.",
      "Punish stance lows on block every time.",
    ],
    dodge: [
      "Do not chase her stance retreats with committed strings.",
      "Block first when the stance is unfamiliar, then label the low.",
    ],
    utilise: [
      "Throws and Heat H.2+3 when she starts waiting.",
      "DSS mix at the wall where her movement dies.",
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
        briefing: `${name} is a loading-screen fundamentals check for Law: poke with df+1, whiff punish with df+2, and enter DSS only after they overcommit.`,
        doThis: [
          "Start with single-hit df+1 before forcing slide or DSS.",
          "Punish blocked f+3 and df+2 every time.",
        ],
        dodge: [
          "Parry committed strings instead of blocking everything.",
          "Backdash after safe mids instead of stealing turns blindly.",
        ],
        utilise: [
          "df+2 and uf+2 once they stop pressing.",
          "DSS mix and throws after plus frames.",
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
  return `https://okizeme.gg/database/law?search=${encodeURIComponent(search)}`;
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
          ? "border-teal-300 bg-teal-300 text-slate-950 shadow-lg shadow-teal-950/20"
          : "border-teal-400/35 bg-teal-400/5 text-teal-700 hover:border-teal-300 hover:bg-teal-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="teal" active={isActive} />
    </button>
  );
}

export function LawGuide() {
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
        return "Daily reps for df+1 pokes, DSS routing, slide mix, punch parry reads, and whiff punishes.";
      case "gameplan":
        return "A short round map: poke, parry, slide, then DSS mix when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for poke tools, DSS threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Law unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Law Junkyard Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Law wins when impatience gets punished at a glance. This guide
              leans on visual move chips, shorter drill cards, and live clips
              instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-teal-400/25 bg-teal-400/10 px-4 py-3 text-sm text-teal-700">
            Focus: DSS flow, f+3 slide, punch parry, df+1, uf+2
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
                    ? "border-teal-300/70 bg-teal-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-teal-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="teal" active={isActive} />
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
            title="Daily Law drills"
            copy="Run these as isolated reps. Each card focuses on one poke, DSS, slide, or punish idea so the clips can do the teaching."
            accent="teal"
          />
          <GuideClipSection
            accent="teal"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-teal-300/15 bg-teal-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
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
            title="How Law should feel"
            copy="The opponent should whiff first. Once they finally respect the poke, f+3 slide and df+2 finish the round."
            accent="teal"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="teal" />
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
            accent="teal"
          />
          <GuideClipSection
            accent="teal"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="teal" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-teal-300/15 bg-teal-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
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
            title="Embedded Law clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="teal"
          />
          <GuideClipSection
            accent="teal"
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
            title="The things that make Law unfair"
            copy="The character becomes much scarier when you can see the poke routes, DSS mix, and punish windows at a glance."
            accent="teal"
          />
          <GuideClipSection
            accent="teal"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-teal-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-teal-300/15 bg-teal-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
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
            copy="Tap a character for a fast Law-specific plan with action cards you can scan between rounds."
            accent="teal"
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
                      ? "border-teal-300 bg-teal-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-teal-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="teal"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-teal-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                  Law vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
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
                    ["Do this", activeMatchup.doThis, "text-teal-600"],
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
                  characterId="law"
                  opponentName={activeMatchup.name}
                  accent="teal"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="law"
                  opponentName={activeMatchup.name}
                  accent="teal"
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

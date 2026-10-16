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

const OKIZEME_CHARACTER = "bryan";

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
  { id: "dojo", label: "Dojo", icon: "12" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "df+1 before every kick",
    summary:
      "Bryan wins when opponents walk into kick range on their own. df+1 is the safe mid that makes them block before f+3, df+3, or f+1+2 ever appear.",
    why: "df+1 is fast, safe, and counter-hit friendly. If you cannot poke and move for a full round, raw keepout kicks and snake edge become donated rounds.",
    drill:
      "For five minutes, play only df+1, backdash, and one follow-up. After every blocked df+1, choose f+3, d,db,b+3, or return to movement — never the same option twice in a row.",
    cues: [
      "df+1 is the honest mid that starts every route.",
      "Stop repeating df+1 once they already stopped pressing.",
      "Kick only after they have blocked the poke at least once.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch d,db,b+3", search: "d,db,b+3" },
    ],
  },
  {
    title: "f+3 keepout kick on respect",
    summary:
      "f+3 is Bryan's signature range tool. It controls half the screen, but only after df+1 has already made them hesitate.",
    why: "Keepout kicks counter-hit for huge damage. Thrown raw at full screen they get stepped and launch-punished. Strong Bryans kick after conditioning; weak ones kick on cooldown.",
    drill:
      "From mid-range, rotate df+1, f+3, and sidestep. Track block punish and confirm your standard combo on counter hit.",
    cues: [
      "f+3 belongs after df+1, not as the first button.",
      "On counter hit, carry toward the wall with your bread-and-butter.",
      "On block, back off — do not press into their turn.",
    ],
    clips: [
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch b+2,1+2", search: "b+2,1+2" },
    ],
  },
  {
    title: "df+3 snake edge discipline",
    summary:
      "Snake edge is slow, readable, and launch-punishable on block — but it still wins rounds when timed after plus frames or as a conditioned mix.",
    why: "df+3 is minus on block. If you spam it without a read, every good player takes a full combo. The move is a reward for their impatience, not a neutral opener.",
    drill:
      "After df+1 block or a plus string, throw one df+3. If they block, take the punish lesson and stop until the next plus frame. Track when they start ducking on rhythm.",
    cues: [
      "Block-check with df+1 before you ever snake edge.",
      "Never df+3 twice in the same rhythm against someone who already blocked.",
      "At the wall, snake edge into oki is where the move pays off.",
    ],
    clips: [
      { label: "Watch df+3", search: "df+3" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch d,db,b+3", search: "d,db,b+3" },
    ],
  },
  {
    title: "df+2 tombstone at i15",
    summary:
      "Tombstone is Bryan's standing launch punish. Hesitating on i10 loses the jab; guessing df+2 when 4,1 was enough loses the combo.",
    why: "df+2 at i15 splats for a full route. Bryan rounds swing on whether you take every -15 block punish without thinking.",
    drill:
      "Set the dummy to -10, -13, and -15. Drill 1,2, 4,1, and df+2 respectively until each punish is automatic.",
    cues: [
      "1,2 is the i10 jab punish.",
      "4,1 is the i12 check when df+2 is not guaranteed.",
      "df+2 is the i15 tombstone — take it from -15 up.",
    ],
    clips: [
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch 4,1", search: "4,1" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
  {
    title: "d,db,b+3 hatchet and f+1+2 layer",
    summary:
      "Hatchet is the fast low that keeps Bryan threatening after mids. f+1+2 is the power mid that counter-hits for half a life bar.",
    why: "d,db,b+3 is only -13 on block — you must know the quick punish before you throw it. f+1+2 is linear and slow; pair it with df+1 so they cannot hold one guard angle forever.",
    drill:
      "From df+1 block, rotate d,db,b+3 and f+1+2 on alternating approaches. Punish your own blocked hatchet in training mode until the gap is muscle memory.",
    cues: [
      "d,db,b+3 catches stand-blockers after df+1.",
      "f+1+2 is for counter-hit fishing, not autopilot block strings.",
      "Sidestep right beats lazy f+1+2 habits.",
    ],
    clips: [
      { label: "Watch d,db,b+3", search: "d,db,b+3" },
      { label: "Watch f+1+2", search: "f+1+2" },
      { label: "Watch df+1", search: "df+1" },
    ],
  },
  {
    title: "uf+2 hopkick whiff punish",
    summary:
      "The hopkick closes space and launches on counter hit. It is Bryan's best answer to their impatience after your keepout kicks.",
    why: "uf+2 whiffs badly if they do not press. Use it when df+1 and f+3 have already made them swing, not as a raw approach from full screen.",
    drill:
      "Block df+1, then walk back until the dummy whiffs a jab. Whiff punish with uf+2. Repeat until you stop pressing when the whiff is out of range.",
    cues: [
      "Label the whiff before you commit.",
      "uf+2 also works as a CH tool at mid-range on reads.",
      "At the wall, confirm into wall carry routes.",
    ],
    clips: [
      { label: "Watch uf+2", search: "uf+2" },
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch f+3", search: "f+3" },
    ],
  },
  {
    title: "Heat on counter-hit momentum",
    summary:
      "Heat is not a panic button. It is the phase where taunt, enhanced kicks, and chip make blocking expensive.",
    why: "H.2+3 and Heat-enhanced f+3 extend pressure after you already won neutral. Spending Heat while losing spacing wastes Bryan's best comeback tool.",
    drill:
      "Activate Heat only after a df+2 launch, wall-splat, or confirmed CH. Loop H.2+3, f+3 in Heat, and one df+2 confirm route per opening.",
    cues: [
      "Heat belongs on momentum, not recovery.",
      "Use enhanced kicks after a read, not on cooldown.",
      "Do not burn Heat trying to escape bad spacing.",
    ],
    clips: [
      { label: "Watch H.2+3", search: "H.2+3" },
      { label: "Watch f+3", search: "f+3" },
      { label: "Watch df+2", search: "df+2" },
    ],
  },
];

const gameplan = [
  {
    title: "Kick range is home",
    copy:
      "Bryan is not a random mix blender. Hold df+1 and f+3 at the tip of your range, make them approach, then punish every whiff with df+2 or uf+2.",
  },
  {
    title: "Counter-hit fishing beats mashing",
    copy:
      "Most players lose on Bryan because they press after his plus-on-block kicks. Your job is to let them swing into f+1+2 and df+1 counter hits, not to trade blindly at his favourite spacing.",
  },
  {
    title: "Snake edge is conditioned, not spammed",
    copy:
      "df+3 is minus on block and launch-punishable. Show df+1 and mids first, then snake edge when they still stand-block. Every blocked snake edge you repeat is a donated round.",
  },
  {
    title: "Tombstone closes rounds",
    copy:
      "df+2 versus df+3 and df+1 versus throw are the honest layers. Know your i15 punish before you gamble hatchet or taunt.",
  },
  {
    title: "Spend Heat on momentum, not recovery",
    copy:
      "Heat belongs on df+2 launches, wall-splats, and confirmed CH routes. Enhanced keepout pressure extends a lead you already earned; it does not fix bad neutral.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "df+1",
    role: "Main mid poke and CH fishing button",
    when: "Use it to check, counter-hit, and set up f+3 or df+3 after they block.",
    risk: "It is not a launcher. If they duck, stop repeating and kick or whiff punish instead.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "f+3",
    role: "Keepout kick and range control",
    when: "Use it after df+1 when they hesitate at mid-range. Counter-hit carries toward the wall.",
    risk: "Launch-punishable on block if thrown raw. Sidestep beats autopilot keepout.",
    clip: { label: "Play f+3", search: "f+3" },
  },
  {
    move: "df+3",
    role: "Snake edge low mix",
    when: "Use it after plus frames or once they stand-block your mids. Launches on hit.",
    risk: "Heavily minus on block. Only throw with a read or after conditioning.",
    clip: { label: "Play df+3", search: "df+3" },
  },
  {
    move: "df+2",
    role: "Tombstone i15 launch punish",
    when: "Use it from -15 on block punishers and whiffs. Confirms into full combo.",
    risk: "High commitment on whiff. Do not use it as a block string opener.",
    clip: { label: "Play df+2", search: "df+2" },
  },
  {
    move: "1,2 / 4,1 / ws2",
    role: "Punisher ladder",
    when: "Use 1,2 at i10, 4,1 at i12, and ws2 from crouch after blocking lows.",
    risk: "Over-punishing with df+2 on i13 frames gets you launched. Confirm the tier first.",
    clip: { label: "Play ws2", search: "ws2" },
  },
  {
    move: "d,db,b+3 / f+2,1",
    role: "Hatchet kick and keepout string",
    when: "Use d,db,b+3 after df+1 to catch stand-blockers. f+2,1 extends keepout pressure.",
    risk: "Hatchet is -13 on block — know their quick punish before you throw it.",
    clip: { label: "Play d,db,b+3", search: "d,db,b+3" },
  },
  {
    move: "uf+2 / b,B+4",
    role: "Hopkick whiff punish and flying knee",
    when: "Use uf+2 on whiffs. b,B+4 closes space for wall splats after you already have a read.",
    risk: "Both whiff badly without conditioning. Save knee for confirmed approach.",
    clip: { label: "Play uf+2", search: "uf+2" },
  },
  {
    move: "f+1+2 / 1+2",
    role: "Power mid and throw layer",
    when: "Use f+1+2 to counter-hit at mid-range after they respect df+1. 1+2 breaks turtles.",
    risk: "Linear and slow. Sidestep right beats lazy habits.",
    clip: { label: "Play f+1+2", search: "f+1+2" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Keepout pack",
    notes: "The df+1 and kick tools that make Bryan feel oppressive at mid-range.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "f+2,1", search: "f+2,1" },
      { label: "b+2,1+2", search: "b+2,1+2" },
    ],
  },
  {
    title: "Mix pack",
    notes: "Review these when snake edge and hatchet are not paying off.",
    clips: [
      { label: "df+3", search: "df+3" },
      { label: "d,db,b+3", search: "d,db,b+3" },
      { label: "f+1+2", search: "f+1+2" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "The tombstone and hopkick tools worth drilling until they are automatic.",
    clips: [
      { label: "1,2", search: "1,2" },
      { label: "4,1", search: "4,1" },
      { label: "df+2", search: "df+2" },
      { label: "uf+2", search: "uf+2" },
      { label: "ws2", search: "ws2" },
    ],
  },
  {
    title: "Heat pack",
    notes: "The enhanced routes that steal rounds once you already have momentum.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "f+3", search: "f+3" },
      { label: "df+2", search: "df+2" },
      { label: "b,B+4", search: "b,B+4" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "df+1 is the real character",
    tag: "Core identity",
    copy:
      "Snake edge is the meme. df+1 is the move that actually makes opponents block and sets up f+3 for the round. If the poke is sloppy, Bryan feels fair.",
    route:
      "Practice df+1 from mid-range. On their block, f+3 or d,db,b+3. On their whiff, df+2 or uf+2. Never snake edge before they have already committed to blocking.",
    counter:
      "If they stop pressing, go back to df+1 and throws. Do not keep kicking into delay mids.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+3", search: "f+3" },
      { label: "df+2", search: "df+2" },
    ],
  },
  {
    title: "Keepout kick is bait, not autopilot",
    tag: "Range rule",
    copy:
      "f+3 looks like free neutral. It is also launch-punishable on block. Strong Bryans kick after df+1 conditioning; weak ones kick on cooldown.",
    route:
      "df+1, then f+3 when they hesitate. On block, backdash and df+1 again. On counter hit, wall carry.",
    counter:
      "If they start sidestep-launching f+3, stop throwing it raw and use df+1 into throw instead.",
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
      "Everyone knows tombstone hurts. Fewer people remember it is for i15 punishes, not for opening turtles. Good opponents launch greedy df+2 habits.",
    route:
      "Label the minus first, then df+2. At mid-range use it only on whiffs and confirmed block punishers.",
    counter:
      "If they stop giving i15 frames, return to df+1 and df+3 mix. Do not keep fishing df+2 on block.",
    clips: [
      { label: "df+2", search: "df+2" },
      { label: "4,1", search: "4,1" },
      { label: "f+1+2", search: "f+1+2" },
    ],
  },
  {
    title: "The first to overcommit loses",
    tag: "Neutral secret",
    copy:
      "Bryan mirrors other keepout characters: Paul, Dragunov, Steve at range. Two patient players mean the first snake edge, knee, or taunt loses. Play shorter than usual.",
    route:
      "Single-hit pokes, one kick, one punish. Repeat until they swing. Then counter-hit.",
    counter:
      "If they mirror your patience, use throws and delayed df+3 to force a decision.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "df+3", search: "df+3" },
      { label: "1+2", search: "1+2" },
    ],
  },
  {
    title: "Taunt is a frame trap, not BM",
    tag: "Mindgame",
    copy:
      "Taunt is plus and baits retaliation. Do not taunt on cooldown — use it after they have already respected your df+1 and f+3.",
    route:
      "df+1 block into short taunt on a read. If they jab, counter-hit with df+1 or f+1+2. If they backdash, walk them down.",
    counter:
      "If they stop pressing after taunt, drop the showmanship and take df+1.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "f+1+2", search: "f+1+2" },
      { label: "f+3", search: "f+3" },
    ],
  },
  {
    title: "Heat makes keepout expensive to block",
    tag: "Heat rule",
    copy:
      "Heat enhances kicks and H.2+3 so blocking still costs health. Use it after you already have a df+2 launch or wall, not as a reset after you lost spacing.",
    route:
      "Activate Heat after df+2 confirm or wall-splat. Show one df+1, then H.2+3 or Heat f+3. Keep chip running between attempts.",
    counter:
      "If they start ducking Heat routes, interrupt with df+1 and throws. Heat is a layer, not a win button.",
    clips: [
      { label: "H.2+3", search: "H.2+3" },
      { label: "f+3", search: "f+3" },
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
  "Bryan (mirror)",
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
      "She wants to leave and return with chainsaws. Bryan wins by df+1 checking her approach, punishing DES entries with df+2, and bursting only after she blocks.",
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
      "Parries eat greedy strings. Bryan wins with single-hit df+1 pokes, sidestep evades, and throws once Asuka starts holding for reversal.",
    doThis: [
      "Stagger df+1 and f+2,1 instead of finishing strings.",
      "Throw when she starts waiting for your kick timing.",
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
      "Do not repeat the same kick timing every time.",
    ],
  },
  Bryan: {
    briefing:
      "Mirror Bryans fish for snake edge and keepout CH. Win by df+1 discipline, blocking their df+3, and df+2 on every minus kick string.",
    doThis: [
      "Hold df+1 and f+3 at your range; make them walk into you.",
      "Block low on snake edge rhythm — launch every time.",
    ],
    dodge: [
      "Sidestep right against raw f+3 and f+1+2.",
      "Backdash after blocked keepout instead of mashing into taunt.",
    ],
    utilise: [
      "df+2 when they repeat df+3 on block.",
      "Heat f+3 once you finally splat them.",
    ],
    avoid: [
      "Do not trade CH kicks at kick range.",
      "Do not snake edge twice in the same pattern.",
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
      "Block his plus frames before throwing df+3.",
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
      "His legs outrange yours. Bryan wins by not poking at limb tip, df+1 checking his highs, then bursting once he is forced to approach.",
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
  "Bryan (mirror)": {
    briefing:
      "The mirror is a patience and snake-edge test. The worse Bryan spams df+3; the better one df+1 pokes, kicks on respect, and tombstones every minus string.",
    doThis: [
      "Single-hit df+1; the first committed snake edge loses.",
      "Punish blocked df+3 and d,db,b+3 every time.",
    ],
    dodge: [
      "Sidestep their linear f+1+2; two keepout characters means the first to overcommit loses.",
      "Block low on df+3 — never guess duck early.",
    ],
    utilise: [
      "Throws when they start waiting for your kick timing.",
      "Heat after you already have a df+2 launch.",
    ],
    avoid: [
      "Do not both f+3 from full screen at once.",
      "Do not taunt without knowing their jab answer.",
    ],
  },
  Hwoarang: {
    briefing:
      "Label the high kick routes or you will eat flamingo forever. Bryan df+1 checks well, but only if you stop swinging at his low stances.",
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
      "Leroy wants predictable strings into parry. Bryan makes this awkward with single-hit df+1 pokes, delayed kicks, and throws.",
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
      "Do not repeat kick timing into parry.",
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
      "df+3 mix at the wall where mobility dies.",
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
      "1+2 once she starts waiting for your df+3 mix.",
    ],
    avoid: [
      "Do not jab-scramble with her up close for long.",
      "Do not let her walk around every linear df+2.",
    ],
  },
  Paul: {
    briefing:
      "Paul wants one CH to end the round. Bryan wins by df+1 discipline, not trading at his favourite range, and df+2 on every whiff.",
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
      "Steve wants to slip highs and counter-hit your timing. Make him block mids, punish his lows with df+2, and do not give predictable df+3 habits.",
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
      "AOP deletes lazy highs. Play mid-first with df+1, sidestep on reads, and df+3 only after she whiffs or blocks.",
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
      "Inconsistent hitboxes and low-profile stances eat lazy highs. Bryan wins with mid discipline, df+1 on reads, and df+3 mix once she is pinned.",
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
      "df+3 mix at the wall where her movement dies.",
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
        briefing: `${name} is a loading-screen fundamentals check for Bryan: df+1 poke, keepout f+3, tombstone df+2 punishes, and conditioned df+3 only after they block.`,
        doThis: [
          "Start with single-hit df+1 pokes before kicking or snake edging.",
          "Punish blocked df+3 and unsafe strings every time.",
        ],
        dodge: [
          "Sidestep committed strings instead of trading at their range.",
          "Backdash after blocked keepout instead of mashing into taunt.",
        ],
        utilise: [
          "df+2 and uf+2 once they stop pressing.",
          "f+1+2 counter hits and throws after plus frames.",
        ],
        avoid: [
          "Do not throw df+3 as a raw neutral opener.",
          "Do not autopilot f+3 where their sidestep launch lives.",
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
  return `https://okizeme.gg/database/bryan?search=${encodeURIComponent(search)}`;
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

export function BryanGuide() {
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
        return "Daily reps for df+1 poke, keepout f+3, tombstone df+2 punishes, and conditioned snake edge.";
      case "gameplan":
        return "A short round map: poke, kick range, punish, then df+3 when they overcommit.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for keepout tools, mix threats, punishes, and Heat routes.";
      case "secrets":
        return "The habits that make Bryan unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Bryan Keepout Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Bryan wins when keepout kicks and counter hits land after honest
              df+1 pokes. This guide leans on visual move chips, shorter drill
              cards, and live clips instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-700">
            Focus: df+1 poke, f+3 keepout, df+2 tombstone, conditioned df+3
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
                    ? "border-rose-300/70 bg-rose-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-rose-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="rose" active={isActive} />
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
            title="Daily Bryan drills"
            copy="Run these as isolated reps. Each card focuses on one poke, kick, or punish idea so the clips can do the teaching."
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
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
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
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
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
            title="How Bryan should feel"
            copy="The opponent should block first. Once they finally respect df+1, f+3 and df+2 finish the round."
            accent="rose"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
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
                  className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
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
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
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
            title="Embedded Bryan clip packs"
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
            title="The things that make Bryan unfair"
            copy="The character becomes much scarier when you can see the keepout routes, df+3 mix, and punish windows at a glance."
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
                  className="rounded-3xl border border-rose-400/15 bg-white/80 p-4 sm:p-6"
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
                    <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
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
            copy="Tap a character for a fast Bryan-specific plan with action cards you can scan between rounds."
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
                  className={`rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
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
              <article className="rounded-3xl border border-rose-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                  Bryan vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
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
                    ["Do this", activeMatchup.doThis, "text-rose-600"],
                    ["How to dodge", activeMatchup.dodge, "text-sky-600"],
                    ["Utilise", activeMatchup.utilise, "text-rose-600"],
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
                  characterId="bryan"
                  opponentName={activeMatchup.name}
                  accent="rose"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="bryan"
                  opponentName={activeMatchup.name}
                  accent="rose"
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

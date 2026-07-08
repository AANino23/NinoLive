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

type PlanStep = {
  title: string;
  copy: string;
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

type SecretTech = {
  title: string;
  tag: string;
  secret: string;
  execution: string;
  payoff: string;
  clips: Clip[];
};

type SecretFlowchart = {
  title: string;
  hook: string;
  steps: string[];
  escapeHatch: string;
  clips: Clip[];
};

type Matchup = {
  name: string;
  archetype: string;
  verdict: string;
  overview: string;
  doThis: string[];
  dodge: string[];
  utilise: string[];
  avoid: string[];
};

const tabs = [
  { id: "dojo", label: "Dojo", icon: "CH", tone: "sky" },
  { id: "gameplan", label: "Gameplan", icon: "GP", tone: "cyan" },
  { id: "toolkit", label: "Toolkit", icon: "12", tone: "violet" },
  { id: "clips", label: "Clips", icon: "REC", tone: "emerald" },
  { id: "secrets", label: "Secrets", icon: "EX", tone: "amber" },
  { id: "matchups", label: "Matchups", icon: "VS", tone: "rose" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "Build the counter-hit backbone",
    summary: "Steve wins when opponents feel forced to swing first.",
    why: "Your first layer is teaching yourself to fish with safe, annoying buttons before cashing out with a counter hit.",
    drill:
      "Alternate between backdash into b+1, df+2~DCK cancel, and qcf+1~FLK for 3 minutes. Do not chase damage; only focus on catching retaliation cleanly.",
    cues: [
      "Use b+1 when you think a fast button is coming.",
      "Use df+2 when you want a mid check that still threatens a reward.",
      "Cancel into stance safely instead of autopiloting the follow-up.",
    ],
    clips: [
      { label: "Watch b+1", search: "b+1" },
      { label: "Watch df+2", search: "df+2" },
      { label: "Watch qcf+1", search: "qcf+1" },
    ],
  },
  {
    title: "Jab tree into stance pressure",
    summary: "Steve's offense gets scary once the opponent respects 1,2 and 2,1.",
    why: "These strings let you stay active, vary timing, and enter Flicker or Peekaboo without looking reckless.",
    drill:
      "Loop 1,2,1~b, 2,1~b, and 2,1~f. After every blocked string, choose a different next action: block, low, jab, or stance jab.",
    cues: [
      "Keep 1,2,1 as your tempo setter.",
      "Use 2,1~b when you want plus-ish pressure into Flicker.",
      "Use 2,1~f when you want to threaten Peekaboo mids and lows.",
    ],
    clips: [
      { label: "Watch 1,2,1", search: "1,2,1" },
      { label: "Watch 2,1", search: "2,1" },
      { label: "Watch FLK.1", search: "FLK.1" },
    ],
  },
  {
    title: "Mid control before big reads",
    summary: "Steve works best when the opponent is scared to duck or step for free.",
    why: "Clean Steve play is less about random launchers and more about disciplined mid checks that make the later mix stronger.",
    drill:
      "Play a five-minute set where your only starters are df+1, qcf+1, and ub+2. Track whether your opponent starts freezing, stepping, or ducking.",
    cues: [
      "df+1 is your no-nonsense pressure starter.",
      "qcf+1 is your long-range mid that keeps Steve honest in neutral.",
      "ub+2 is the 'your turn is not really your turn' reminder.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch qcf+1", search: "qcf+1" },
      { label: "Watch ub+2", search: "ub+2" },
    ],
  },
  {
    title: "Flicker discipline",
    summary: "Flicker is strongest when you rotate answers instead of spamming one button.",
    why: "Good Steve players make Flicker feel claustrophobic: high chip pressure, a mid check, and evasive exits all from the same stance.",
    drill:
      "After every b+1~b or qcf+1~b, rotate between FLK 1, FLK 2, weave away, and immediate guard. Do not repeat the same option twice.",
    cues: [
      "FLK 1 keeps jab pressure rolling.",
      "FLK 2 is your mid reminder when they are duck-happy.",
      "Movement out of Flicker matters as much as attacking out of Flicker.",
    ],
    clips: [
      { label: "Watch FLK.1", search: "FLK.1" },
      { label: "Watch FLK.2", search: "FLK.2" },
      { label: "Watch qcf+1", search: "qcf+1" },
    ],
  },
  {
    title: "Peekaboo harassment",
    summary: "Peekaboo is where Steve turns respect into an actual guessing game.",
    why: "Once the opponent stops pressing, Steve needs a simple way to chip away at their guard without overextending.",
    drill:
      "Enter PAB from 2,1~f or manually, then cycle PAB d+1, PAB df+2, and throw attempts. Spend one round focusing only on locking movement down.",
    cues: [
      "PAB d+1 is there to irritate and pin movement.",
      "PAB df+2 is the mid threat that stops people from crouch-blocking forever.",
      "If they freeze, throws become part of the lesson.",
    ],
    clips: [
      { label: "Watch PAB d+1", search: "PAB.d+1" },
      { label: "Watch PAB df+2", search: "PAB.df+2" },
      { label: "Watch 2,1", search: "2,1" },
    ],
  },
  {
    title: "Lionheart wall round-stealing",
    summary: "Lionheart becomes far scarier once the wall is behind them.",
    why: "This is the most explosive version of Steve's offense, especially when the opponent is already nervous about guard break and homing mid checks.",
    drill:
      "At the wall, alternate ub+2 into LNH 1, LNH 1+2, and delayed cancel. Then repeat with DCK f+2 starters until the three options feel visually identical.",
    cues: [
      "LNH 1 is the stable pressure check.",
      "LNH 1+2 is the statement piece when they turtle or panic.",
      "LNH 2 is the comeback bet once they get too comfortable ducking.",
    ],
    clips: [
      { label: "Watch LNH 1", search: "LNH.1" },
      { label: "Watch LNH 2", search: "LNH.2" },
      { label: "Watch LNH 1+2", search: "LNH.1+2" },
    ],
  },
  {
    title: "Round-closing lows",
    summary: "Steve's lows are not terrifying on paper, but they matter once the rest of his pressure is working.",
    why: "You are not trying to become a low monster. You just need enough annoyance to stop pure stand blocking.",
    drill:
      "Use d+2,1, d+1, and PAB d+1 only when the opponent has already been conditioned by mids and jab pressure. Review whether you scored a hit or gave away your turn.",
    cues: [
      "d+2,1 is the more serious low check.",
      "d+1 is mainly for information and irritation.",
      "Low timing matters more than raw low count.",
    ],
    clips: [
      { label: "Watch d+2,1", search: "d+2,1" },
      { label: "Watch d+1", search: "d+1" },
      { label: "Watch PAB d+1", search: "PAB.d+1" },
    ],
  },
];

const gameplan: PlanStep[] = [
  {
    title: "Win neutral by making buttons feel expensive",
    copy:
      "Steve is a counter-hit specialist first. Start rounds by checking movement and impatience with b+1, df+1, qcf+1, and clean backdash timing. The goal is not immediate damage; it is teaching the opponent that pressing into you can be fatal.",
  },
  {
    title: "Use jab strings to keep your turns fuzzy",
    copy:
      "1,2,1 and 2,1 are your rhythm changers. Once they are respected, Steve gets to slide into Flicker or Peekaboo and keep offense alive without relying on one big coin flip.",
  },
  {
    title: "Save Lionheart for meaningful moments",
    copy:
      "Lionheart is at its best near the wall, after you've built hesitation, or during comeback pressure. Use LNH 1 as the stable check, LNH 1+2 as the guard-break threat, and LNH 2 when the opponent starts ducking or gambling.",
  },
  {
    title: "Accept that punishment is not your whole identity",
    copy:
      "Steve does not punish like the rest of the cast. Instead of obsessing over what he lacks, lean into long-range whiff punishment with 1+2 and the fact that his offense stays awkward and safe longer than most characters can manage.",
  },
  {
    title: "Heat is for momentum, not panic",
    copy:
      "Steve's heat gets scarier when it extends a read you already made. Use heat to bully with chip, improve approach speed, and make Lionheart pressure harder to disrespect instead of spending it randomly at the first touch.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "b+1",
    role: "Counter-hit king",
    when: "Use when the opponent wants a quick answer after your movement or plus frames.",
    risk: "High if hard-called with a duck, but far safer once you buffer into Flicker.",
    clip: { label: "Play b+1", search: "b+1" },
  },
  {
    move: "df+1",
    role: "Reliable mid check",
    when: "Use to start offense, test responses, and stop mindless crouching.",
    risk: "Low risk, low drama. The reward comes from what you layer after it.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "qcf+1",
    role: "Long-range mid control",
    when: "Use when you need reach, a heat-engaging threat, or a safe-looking mid from further out.",
    risk: "Manageable on its own and even better when you flow into Flicker.",
    clip: { label: "Play qcf+1", search: "qcf+1" },
  },
  {
    move: "1+2",
    role: "Whiff punish and heat entry",
    when: "Use when the opponent overextends from range or you need a simple punish that still hurts.",
    risk: "Less scary on block than a missed launcher, but still not a throwaway button.",
    clip: { label: "Play 1+2", search: "1+2" },
  },
  {
    move: "2,1~f / 2,1~b",
    role: "Stance gateway",
    when: "Use after establishing jab respect so Steve can transition into offense cleanly.",
    risk: "Predictable timing gets challenged; the answer is variety, not volume.",
    clip: { label: "Play 2,1", search: "2,1" },
  },
  {
    move: "PAB d+1 / PAB df+2",
    role: "Peekaboo guess starter",
    when: "Use after the opponent freezes against stance entry or over-focuses on highs.",
    risk: "Peekaboo loses value fast if you always choose the same side of the mix.",
    clip: { label: "Play PAB df+2", search: "PAB.df+2" },
  },
  {
    move: "ub+2",
    role: "Plus-frame high into Lionheart",
    when: "Use when you want to push a turn forward and force wall-stage hesitation.",
    risk: "Duck-happy players can make you pay if you become obvious.",
    clip: { label: "Play ub+2", search: "ub+2" },
  },
  {
    move: "LNH 1 / LNH 1+2",
    role: "Wall snowball tools",
    when: "Use when the opponent is cornered, passive, or already scared of your mids.",
    risk: "Lionheart is strongest once you've earned respect first.",
    clip: { label: "Play LNH 1", search: "LNH.1" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Counter-hit pack",
    notes:
      "Start here if you want the fastest sense of how Steve actually gets paid. These are the buttons that make opponents stop taking liberties.",
    clips: [
      { label: "b+1", search: "b+1" },
      { label: "df+2", search: "df+2" },
      { label: "FLK.2", search: "FLK.2" },
    ],
  },
  {
    title: "Pressure pack",
    notes:
      "This set is for seeing how Steve chains turns together once the opponent stops mashing immediately.",
    clips: [
      { label: "1,2,1", search: "1,2,1" },
      { label: "2,1", search: "2,1" },
      { label: "df+1", search: "df+1" },
      { label: "qcf+1", search: "qcf+1" },
    ],
  },
  {
    title: "Stance pack",
    notes:
      "Use this when you want to study how each stance actually threatens something different instead of blurring together.",
    clips: [
      { label: "FLK.1", search: "FLK.1" },
      { label: "PAB d+1", search: "PAB.d+1" },
      { label: "LNH.1", search: "LNH.1" },
      { label: "DCK.1", search: "DCK.1" },
    ],
  },
  {
    title: "Wall closer pack",
    notes:
      "These are the clips to review when a round is nearly over and you need Steve's scariest close-range endgame.",
    clips: [
      { label: "ub+2", search: "ub+2" },
      { label: "LNH.1", search: "LNH.1" },
      { label: "LNH.1+2", search: "LNH.1+2" },
      { label: "PAB df+2", search: "PAB.df+2" },
    ],
  },
];

const secretTech: SecretTech[] = [
  {
    title: "Swindler cancels: the anti-duck fakeouts",
    tag: "Hidden input",
    secret:
      "Every high homing move that transitions Steve into Lionheart can be cancelled into Swindler by sliding 1 right after the 2: ub+2~1, b+1,2~1, PAB 2~1, and df+1,2~1. Instead of the high Lionheart entry, Steve throws a completely safe mid that counter-hit launches.",
    execution:
      "Input the move normally, then plink 1 immediately after the 2 lands or is blocked. Practice ub+2~1 first since the timing window is the most forgiving, then move to the string versions.",
    payoff:
      "Opponents who have learned to duck your ub+2 and PAB 2 get launched by a mid they never see coming. This is the single biggest gap between a good Steve and a scary one, because it makes ducking his stance entries a losing bet.",
    clips: [
      { label: "ub+2~1", search: "ub+2~1" },
      { label: "b+1,2~1", search: "b+1,2~1" },
      { label: "PAB 2~1", search: "PAB.2~1" },
      { label: "df+1,2~1", search: "df+1,2~1" },
    ],
  },
  {
    title: "The crouch-cancel WS+1 machine",
    tag: "Stance glue",
    secret:
      "Any move that puts Steve in Flicker can be crouch-cancelled with a quick db into WS+1, an i11 mid check that is only -3 on block. Flicker officially has no fast mid; this trick manufactures one and almost nobody labs against it.",
    execution:
      "After 2,1~b or qcf+1~b, tap db to cancel the stance into crouch, then immediately press WS+1. The full loop looks like 2,1~b > db > WS+1, and it should feel like one continuous motion.",
    payoff:
      "People who down-jab or high crush your Flicker jabs eat an 11-frame mid instead. WS1,2 is also heavily delayable and counter-hit confirmable, so the same starter doubles as a frame trap and a hit-confirm tool.",
    clips: [
      { label: "WS 1", search: "WS.1" },
      { label: "WS 1,2", search: "WS.1,2" },
      { label: "WS 1,1", search: "WS.1,1" },
    ],
  },
  {
    title: "Heat duck into Two-Faced",
    tag: "Heat exclusive",
    secret:
      "In heat, df+3+4 performs a sped-up extended duck that skips the long vulnerable animation. From it Steve gets EXD f+2 as a normal-hit launcher, plus the Two-Faced command grab (1+3) with a genuine two-way ending: press 1 for three gut punches into +14, or 2 for a heavy side-switching throw.",
    execution:
      "Activate heat, then use df+3+4 the moment the opponent freezes. Mix 1+3 grab attempts with EXD f+2 for people who try to duck the grab. After the grab connects, choose TFA 1 when you want guaranteed follow-up pressure and TFA 2 when you want raw damage or a side switch away from the wall.",
    payoff:
      "This is Steve's real heat gameplan and most players never touch it. The grab is only duckable on read, the launcher punishes that exact read, and the +14 from TFA 1 guarantees 1+2 for another heat engager's worth of damage.",
    clips: [
      { label: "Heat duck", search: "H.df+3+4" },
      { label: "EXD f+2", search: "EXD.f+2" },
      { label: "TFA 1 ender", search: "TFA.1" },
      { label: "TFA 2 ender", search: "TFA.2" },
    ],
  },
  {
    title: "LNH 1+2 breaks reversals",
    tag: "Counter-counterplay",
    secret:
      "Lionheart 1+2 is not just a guard break. It has reversal-break properties: if the opponent tries to parry, power crush, heat burst, or armour through your Lionheart pressure, this move breaks the reversal and launches them for full combo damage.",
    execution:
      "Watch for opponents who answer your Lionheart entries with parries (Asuka, Jun, Nina players especially) or panic heat bursts. Enter Lionheart as usual with ub+2 or WS+2, then choose 1+2 instead of the expected LNH 1.",
    payoff:
      "The standard advice against Lionheart is to parry or armour through it, so this launches exactly the players who have done their homework. On regular guard break it still guarantees any follow-up of 12 frames or faster.",
    clips: [
      { label: "LNH 1+2", search: "LNH.1+2" },
      { label: "ub+2 entry", search: "ub+2" },
      { label: "WS 2,2 entry", search: "WS.2,2" },
    ],
  },
  {
    title: "The Lionheart auto-parry trap",
    tag: "Heat exclusive",
    secret:
      "With heat active, Lionheart stance gains a built-in auto parry against all standing punches and kicks, which converts directly into the Two-Faced grab. WS 2,2 ends in Lionheart at +4, so most opponents immediately press a jab or kick to take their turn back — and feed the parry.",
    execution:
      "In heat, finish WS 2,2 on block and simply wait in Lionheart. If they press a standing punch or kick, the parry triggers automatically and you choose the TFA 1 or TFA 2 ender. If they respect it, take your +4 and run normal Lionheart offense.",
    payoff:
      "It turns your opponent's most natural defensive habit into a command grab. Know the counterplay so you can bait around it: the parry loses to knees, elbows, lows, and hopkicks, so alternate with LNH 1 to check those answers.",
    clips: [
      { label: "WS 2,2", search: "WS.2,2" },
      { label: "LNH 1 check", search: "LNH.1" },
      { label: "TFA 1", search: "TFA.1" },
    ],
  },
  {
    title: "PAB 2's hidden punch sabaki",
    tag: "Buried property",
    secret:
      "Peekaboo 2 has a built-in punch sabaki. If it is timed to meet an incoming punch, Steve parries the punch mid-move and lands the hit anyway, with a guaranteed LNH 1 follow-up on hit at +14.",
    execution:
      "When your Peekaboo pressure gets jabbed, deliberately delay PAB 2 slightly so it collides with their retaliation. On hit or sabaki, confirm into LNH 1. Against duckers, swap to PAB 2~1 swindler for the counter-hit launch instead.",
    payoff:
      "Peekaboo stops being a stance you exit when people mash. The sabaki beats jabs, the swindler beats ducking, and PAB df+2's elbow beats parry characters — a complete triangle most Steves never finish learning.",
    clips: [
      { label: "PAB 2", search: "PAB.2" },
      { label: "PAB 2~1", search: "PAB.2~1" },
      { label: "PAB df+2", search: "PAB.df+2" },
    ],
  },
];

const secretFlowcharts: SecretFlowchart[] = [
  {
    title: "The Albatross spacing trap",
    hook: "2,1~b > FLK 1 > ALB 2 > ub+3 — the flowchart high-level Steves lean on when they want a round on autopilot.",
    steps: [
      "2,1~b puts you in Flicker at plus frames; FLK 1 frame traps anyone pressing.",
      "The Albatross spin into ALB 2 catches people who finally try to press after blocking the jabs — and it's only -3 on block.",
      "After a blocked ALB 2, backing off with ub+3 creates instant whiff-punish range, or stand your ground with b+1 since the pushback protects it.",
      "Once they freeze completely, replace ALB 2 with a throw or a low to restart the loop.",
    ],
    escapeHatch:
      "If the opponent starts sidestepping right to beat ALB 2, switch to qcf+1 at closer range, which tracks that exact escape.",
    clips: [
      { label: "2,1", search: "2,1" },
      { label: "FLK 1", search: "FLK.1" },
      { label: "ALB 2", search: "ALB.2" },
      { label: "ub+3", search: "ub+3" },
    ],
  },
  {
    title: "The FLK 1,d+1 zero trap",
    hook: "A move that is exactly 0 on block is a psychological weapon: nobody knows whose turn it is, and Steve wins ties.",
    steps: [
      "End Flicker pressure with FLK 1,d+1. On block it is dead even; on normal hit it ballerina-spins them and wall splats.",
      "Most opponents respond with a slow-ish button because it 'felt' minus. Walk back slightly and land b+1 for a full counter-hit launch.",
      "Once they start ducking the d+1 ender, switch to FLK 1,f+1, the mid version that forces crouch and hard knocks down on counter hit.",
      "On counter hit, FLK 1,d+1 gives a guaranteed db+2 ground hit — free damage most Steves forget to collect.",
    ],
    escapeHatch:
      "Sharp opponents will jab immediately at 0. If that happens, pre-empt with FLK b+2, the high power crush that eats their button and knocks down for a guaranteed f,F+2.",
    clips: [
      { label: "FLK 1,d+1", search: "FLK.1,d+1" },
      { label: "b+1 catch", search: "b+1" },
      { label: "FLK 1,f+1", search: "FLK.1,f+1" },
      { label: "FLK b+2", search: "FLK.b+2" },
    ],
  },
  {
    title: "The db+3,2 wall machine",
    hook: "At the wall, one stomp turns Steve's weakest area (lows) into a round-ending 50/50.",
    steps: [
      "Land or block db+3,2 at range 0 near the wall; hold back to cancel Lionheart and stand at +4 with them still in front of the wall.",
      "From +4, threaten two things at once: qcf+1 for the wall splat, or db+3,2 again for the low that loops the situation.",
      "Sprinkle in the single stomp db+3 alone to test reactions without risking the launch-punishable full string.",
      "When they start ducking to stop the loop, LNH 1 and qcf+1 both wall splat and end the round on the spot.",
    ],
    escapeHatch:
      "Do not run this mid-screen. db+3,2 needs range 0, and away from the wall the reward stops justifying the -13 on the full string.",
    clips: [
      { label: "db+3,2", search: "db+3,2" },
      { label: "qcf+1", search: "qcf+1" },
      { label: "LNH 1", search: "LNH.1" },
    ],
  },
  {
    title: "The -3 weave steal",
    hook: "Steve's dirtiest habit: being minus on paper but plus in practice, because weave dodges the answer.",
    steps: [
      "End pressure at small minus: qcf+1~b into Flicker (-3) or LNH 1~b into Flicker (-3).",
      "Instead of blocking, weave with 3 or 4. Most retaliation is a jab or df+1, and weave slips both.",
      "Convert the whiff with 4,1,2 into Lionheart or 3,1,2 — both natural-hitting weave strings that restart your offense at plus frames.",
      "Rotate in an honest block occasionally so the weave read stays unpredictable.",
    ],
    escapeHatch:
      "Weave loses to homing moves and well-timed lows. If those start appearing, you've won the mental battle — go back to frame traps and counter-hit fishing.",
    clips: [
      { label: "qcf+1", search: "qcf+1" },
      { label: "Left weave", search: "3" },
      { label: "Right weave", search: "4" },
      { label: "Weave 4,1,2", search: "RWV.1,2" },
    ],
  },
  {
    title: "The Five Fox Fury heat loop",
    hook: "Season 2's b+1+2,1+2 in heat is a five-punch wall of chip that Steve can legally loop.",
    steps: [
      "In heat, throw H.b+1+2,1+2 — mid, high, mid, mid, mid, and the high jails so it cannot be ducked once they block the first hit.",
      "Hold back on the final hit to land in Flicker at +3 instead of -4, keeping your turn.",
      "From Flicker at +3, FLK 1 frame traps, and the whole string can be threatened again while heat lasts.",
      "At the wall, the string splats, converting chip pressure into a full wall combo.",
    ],
    escapeHatch:
      "Outside heat the string is still safe at -4, but the loop only works with heat active — treat it as a round-closing gear, not your default offense.",
    clips: [
      { label: "Five Fox Fury", search: "H.b+1+2,1+2" },
      { label: "FLK 1", search: "FLK.1" },
      { label: "Heat burst", search: "H.2+3" },
    ],
  },
];

const secretHabits: { title: string; copy: string }[] = [
  {
    title: "Delay everything once, on purpose",
    copy:
      "WS 1,2, WS 2,2, PAB df+1 strings, and Flicker jabs are all heavily delayable. Good opponents time their punishes to your normal rhythm; one deliberately late extension per round resets their timing and buys counter hits for free.",
  },
  {
    title: "Collect your guaranteed follow-ups",
    copy:
      "CH FLK 1,d+1 gives a free db+2. FLK b+2 on hit gives a free f,F+2. TFA 1 gives a free 1+2 at +14. ub+2 on hit guarantees LNH 1. Steve players routinely leave this damage on the table — auditing it is worth more than a new combo route.",
  },
  {
    title: "Know your own weakness better than they do",
    copy:
      "Sidestep-left-into-duck option-selects most of Steve's offense: it beats qcf+1, df+2, and his key highs at once. The counter is delayed timing, realigning with movement, and homing checks with LNH 1 and ub+2. If you fix this before your opponents find it, you keep the secret.",
  },
  {
    title: "Bank the swindlers for match point",
    copy:
      "Fakeout tools lose value each time they're shown. The strongest Steves save ub+2~1 and PAB 2~1 for the moments a round actually hinges on — the opponent who ducked twice in a row at match point is the launch you were saving it for.",
  },
];

const matchups: Matchup[] = [
  {
    name: "Alisa",
    archetype: "Aerial mobility and chainsaw pressure",
    verdict: "Even, becomes Steve-favoured once you stop respecting chainsaws",
    overview:
      "Alisa wants to dance around backdashes, boots, and destructive form chainsaw pressure. Steve's counter-hit tools punish her floaty movement hard, but chainsaw stance turns careless pressing into big damage against you.",
    doThis: [
      "Walk her down patiently; her pokes lose the counter-hit war to b+1 and df+2.",
      "When she enters chainsaw stance (DES), back off with ub+3 or stand block: most of it is minus or interruptible on block.",
      "Punish her hopkick and boots on whiff with qcf+1 or a full launch.",
    ],
    dodge: [
      "Weave slips most of her high string enders and her jab pressure.",
      "Do not challenge chainsaw swings with highs; they trade badly. Block first, then punish.",
    ],
    utilise: [
      "LNH 1 as a homing check when she starts sidestepping your qcf+1.",
      "Wall carry: Alisa struggles far more once her backdash space is gone.",
    ],
    avoid: [
      "Chasing her backdash with dashing highs; that is exactly what her boots punish.",
      "Pressing after blocked DES entries you have not labbed; some are plus.",
    ],
  },
  {
    name: "Anna",
    archetype: "Chaotic 50/50s and counter-hit traps",
    verdict: "Volatile; whoever lands the first knockdown usually snowballs",
    overview:
      "Anna throws out risky lows and counter-hit highs constantly. She wins rounds fast when you freeze, but nearly everything she opens with is punishable if you block it.",
    doThis: [
      "Stand block early, take a low or two, then start blocking down on her rhythm; her big lows are launch or heavily punishable.",
      "Take your turn back with 1,2,1 after her minus strings; she loves to keep pressing.",
      "Force her to defend: her own defense is far weaker than her offense.",
    ],
    dodge: [
      "Weave after blocking her plus-looking highs; a lot of her pressure is high-heavy and slips clean.",
      "Back off with ub+3 when she enters crouch-dash mixups instead of guessing at point-blank.",
    ],
    utilise: [
      "b+1 counter hits her constant pressing for full launch damage.",
      "Heat duck Two-Faced once she starts stand-blocking your mids.",
    ],
    avoid: [
      "Guessing on her 50/50 at the wall when you could backstep the first low instead.",
      "Getting impatient after losing a round fast; she is designed to tilt you into mashing.",
    ],
  },
  {
    name: "Armor King",
    archetype: "Throw mixups with heavyweight strikes",
    verdict: "Knowledge check; break throws and it swings hard to Steve",
    overview:
      "Armor King mixes King-style command grabs with stronger mid pokes and the Dark Upper. The matchup is a throw-break exam first and a footsie fight second.",
    doThis: [
      "Watch arms and practice 1 versus 2 breaks; breaking even half his grabs guts his damage.",
      "Duck on hard grab reads and launch: most command grabs are highs.",
      "Play the mid-range counter-hit war; Steve's b+1 and df+2 outpace his pokes.",
    ],
    dodge: [
      "Weave his high-committal swings and shoulder attempts.",
      "Sidestep after blocking his linear approach moves rather than eating the next grab.",
    ],
    utilise: [
      "ub+3 to create space when he starts looping grab attempts at range 0.",
      "qcf+1 keepout: he has to walk through it to reach grab range.",
    ],
    avoid: [
      "Crouching randomly; his mids and hopkick exist exactly to farm panicking duckers.",
      "Letting him corner you; grab mix at the wall is where he ends rounds.",
    ],
  },
  {
    name: "Asuka",
    archetype: "Defensive reversals and counter-hit whiff punishing",
    verdict: "Annoying on paper, but Steve owns the direct counters",
    overview:
      "Asuka's parry and counter-hit tools are built to punish exactly the punch pressure Steve lives on. The trick is that Steve carries the two cleanest anti-parry answers in the game.",
    doThis: [
      "Feed her parry once, then switch to PAB df+2: elbows cannot be parried and it launches.",
      "Use LNH 1+2 against parry-happy defense; it reversal breaks for a full combo.",
      "Make her whiff her big swings and punish; her recovery is heavy.",
    ],
    dodge: [
      "Do not autopilot long punch strings; that is parry food.",
      "Block her CH strings first; most of her offense is minus when respected.",
    ],
    utilise: [
      "Throws: parry-heavy players stand and wait, which is free grab territory.",
      "Delayed string timings so her parry attempts whiff into your counter hit.",
    ],
    avoid: [
      "Jumping into her can-can launcher by pressing during her frame traps.",
      "Panic-pressing after her plus-on-hit lows; she wants retaliation.",
    ],
  },
  {
    name: "Azucena",
    archetype: "Relentless forward pressure with evasive stance",
    verdict: "Even; whoever respects the other's counter-hits less loses",
    overview:
      "Azucena runs at you all day and her Libertador stance ducks under highs mid-pressure. Steve has to be deliberate about which buttons he checks her with.",
    doThis: [
      "Check her approach with df+2 and qcf+1: mids beat her stance ducking where b+1 whiffs.",
      "Interrupt her stance transitions with jabs when she is minus; most entries lose their turn.",
      "Punish her while-running nonsense with block punishment, not with movement.",
    ],
    dodge: [
      "Back off with ub+3 when she enters Libertador rather than feeding it a high.",
      "Weave only after her committed strings, not during her stance where lows live.",
    ],
    utilise: [
      "LNH 1 homing to shut down her constant lateral drift.",
      "b+1 the moment she respects your mids and starts standing still.",
    ],
    avoid: [
      "Flicker high spam; Libertador low-profiles it for free launches.",
      "Backdashing in a straight line; her running attacks are built to run that down.",
    ],
  },
  {
    name: "Bryan",
    archetype: "Keepout and counter-hit destruction",
    verdict: "Slightly against Steve at range, even once you get inside",
    overview:
      "Bryan wants you at the tip of his kicks where his counter-hit machine is safest. Steve wants chest-to-chest where Bryan's minus frames actually matter. The whole match is about who fights at their range.",
    doThis: [
      "Close distance in small, patient steps behind block; never run straight in.",
      "Punish hatchet kick every time: blocking it is worth a full launch.",
      "Once inside, stay inside: jab strings and stance pressure keep him from resetting to keepout.",
    ],
    dodge: [
      "Weave his high keepout kicks and jabs during his turn; it slips a shocking amount of his wall of moves.",
      "React to snake edge: it is slow enough to block and launch every single time.",
    ],
    utilise: [
      "ub+3 to bait his whiff-punish attempts, then whiff punish him back.",
      "Heat to bridge the gap: chip pressure forces him to press where b+1 lives.",
    ],
    avoid: [
      "Pressing after his plus-on-block moves; taunt and f+4 pressure feed his CH engine.",
      "Trading at range; his kicks out-damage and out-range everything you have there.",
    ],
  },
  {
    name: "Claudio",
    archetype: "Simple, strong mids with Starburst spikes",
    verdict: "Steve-favoured on the ground; respect the buffed moments",
    overview:
      "Claudio's game is honest: strong mids, a hopkick, and scary Starburst-empowered moves. His lows are famously weak, which means Steve can stand block a frightening amount of this match.",
    doThis: [
      "Stand block by default; his low game barely dents you.",
      "Rush him after he spends Starburst; his threat level drops sharply.",
      "Whiff punish his big keepout swings with 1+2 or a launch.",
    ],
    dodge: [
      "Weave his high pokes between strings; his pressure has clean gaps.",
      "Sidestep his linear plus-frame mids once you have seen his patterns.",
    ],
    utilise: [
      "Counter-hit fishing: he has to press mid-heavy buttons that lose to b+1 timing.",
      "Wall pressure: he lacks the panic tools to escape Lionheart at the wall.",
    ],
    avoid: [
      "Ducking when Starburst is loaded; empowered mids are his kill condition.",
      "Challenging his heat smash and command grab mix without labbing it first.",
    ],
  },
  {
    name: "Clive",
    archetype: "Ranged zoning with stance shift cancels",
    verdict: "Uphill at range, clearly Steve's once you are inside",
    overview:
      "Clive controls half the screen with sword range and projectile-style pokes. Steve has no answer at that distance, so the entire matchup is about converting one clean entry into lasting pressure.",
    doThis: [
      "Advance behind block; most of his ranged moves are minus enough for you to keep walking.",
      "Once in range, stay glued to him: his up-close defense is among the weakest in the game.",
      "Punish his big sword commitments on block; several are heavily punishable.",
    ],
    dodge: [
      "Sidestep his ranged pokes rather than backdashing; distance is his win condition, not yours.",
      "Watch for Phoenix Shift follow-ups before pressing after blocked specials.",
    ],
    utilise: [
      "Heat approach speed to skip neutral he otherwise controls.",
      "Wall carry combos; Clive cornered loses his entire zoning identity.",
    ],
    avoid: [
      "Playing mid-range chicken; you will lose a poke war against a sword.",
      "Burning your own heat defensively; save it to force your way in.",
    ],
  },
  {
    name: "Devil Jin",
    archetype: "Wavedash 50/50s and aerial control",
    verdict: "Even; hinges on your reaction to hellsweep",
    overview:
      "Devil Jin's threat is the wavedash mix between hellsweep and mid launcher, backed by lasers and flight nonsense. Steve cannot out-gimmick him, but he can make every wrong guess cost Devil Jin the round.",
    doThis: [
      "Hold your ground just outside crouch-dash range where hellsweep whiffs.",
      "Launch blocked hellsweep every single time; that punish is the matchup.",
      "Counter-hit his approach: wavedashing into b+1 territory is a losing trade for him.",
    ],
    dodge: [
      "Weave under electrics: they are highs, and slipping one means a free launch.",
      "Block low at wavedash range only when he is conditioned that you stand; do not guess early.",
    ],
    utilise: [
      "ub+3 to make his crouch-dash approach whiff, then punish the recovery.",
      "qcf+1 keepout to tax every wavedash entry attempt.",
    ],
    avoid: [
      "Random ducking against a character whose mid launcher ends rounds.",
      "Chasing him during flight gimmicks; wait, block, and punish the landing.",
    ],
  },
  {
    name: "Dragunov",
    archetype: "Suffocating plus frames and running offense",
    verdict: "Against Steve on paper; discipline drags it back to even",
    overview:
      "Dragunov gets more plus frames than almost anyone, and Steve's instinct to press back is exactly what feeds him. This matchup rewards the most patient version of your defense.",
    doThis: [
      "Respect his plus frames fully, then take your turn only when he is actually minus.",
      "Sidestep his running attacks instead of backdashing; he is built to catch retreat.",
      "Punish d+2 and his committal lows with while-standing offense every time.",
    ],
    dodge: [
      "Weave between his string gaps once you know them; his highs feed counter hits.",
      "Step rather than duck against qcf+1 pressure; guessing high is how you get opened up.",
    ],
    utilise: [
      "b+1 as the answer when he tries to re-engage after minus strings.",
      "Your own wall game: Dragunov players are far worse at defending than attacking.",
    ],
    avoid: [
      "Mashing after wr2 or blocked plus mids; that is his entire gameplan working.",
      "Trying to out-rush him; you win by punishing overreach, not by racing.",
    ],
  },
  {
    name: "Eddy",
    archetype: "Stance flow and unfamiliar rhythm",
    verdict: "Knowledge check that Steve passes with mids and patience",
    overview:
      "Eddy wins on unfamiliarity: negativa, handstand, and constant transitions. Once you know when he is actually vulnerable, Steve's homing mids take the character apart.",
    doThis: [
      "Hit negativa (ground stance) with mids on reaction; d+2,1 and qcf+1 both connect.",
      "Interrupt his stance transitions with jabs; most of his flow is not real on block.",
      "Punish his launch-punishable sweeps and helicopter lows on block.",
    ],
    dodge: [
      "Stand block first when unsure; his mids from stance are weaker than his lows.",
      "Back out with ub+3 mid-flow and let his stance strings whiff entirely.",
    ],
    utilise: [
      "LNH 1 homing to catch his constant twisting movement.",
      "Counter hits between transitions: every stance switch is a gap for b+1.",
    ],
    avoid: [
      "Pressing highs at negativa; it low-profiles them and launches you.",
      "Freezing and watching the capoeira show; passivity is his best-case scenario.",
    ],
  },
  {
    name: "Fahkumram",
    archetype: "Range tyrant with plus-frame kicks",
    verdict: "Against Steve at range, even to favoured up close",
    overview:
      "Fahkumram's limbs control a zone Steve simply cannot poke into. But his up-close game and defense are much weaker, and Steve is one of the best characters at living inside someone's chest.",
    doThis: [
      "Commit to getting inside and staying there; half-in half-out is where his knees live.",
      "Punish his big kicks on block; many are more minus than they look.",
      "Grind him down with jab pressure and stance mix once inside; he wants you off him.",
    ],
    dodge: [
      "Weave under his high kicks on approach; it is your safest way through the wall.",
      "Sidestep his linear keepout after conditioning him to expect blocks.",
    ],
    utilise: [
      "Heat dash and heat approach to skip the range where he wins.",
      "Wall pressure; a cornered Fahkumram has no space for his kicks to breathe.",
    ],
    avoid: [
      "Poke wars at his range; you are donating counter hits to longer limbs.",
      "Backing off after knockdowns; resetting to range restarts his best phase.",
    ],
  },
  {
    name: "Feng",
    archetype: "Evasive kenpo and punish-everything defense",
    verdict: "Slightly against; Feng preys on overextension",
    overview:
      "Feng's back-sway makes committed offense whiff, and his keepout punishes impatience brutally. Steve has to play the mirror of his own game: bait, whiff punish, and refuse to overcommit.",
    doThis: [
      "Use short, safe pokes; long strings are what his sway exists to punish.",
      "Punish his shoulder and sweep properly on block; know the exact punishes cold.",
      "Whiff punish his sway with qcf+1 when he swings back in.",
    ],
    dodge: [
      "Mirror his patience with ub+3; two evasive characters means the first to commit loses.",
      "Block more than you press in his plus-frame sequences; his traps need your cooperation.",
    ],
    utilise: [
      "LNH 1 homing against his stance drift and sidesteps.",
      "b+1 timing to clip him coming out of kenpo step.",
    ],
    avoid: [
      "Autopilot flicker strings from range; his sway makes them whiff into launch.",
      "Getting reads-hungry when down; Feng comebacks feed on desperate offense.",
    ],
  },
  {
    name: "Heihachi",
    archetype: "Mishima power with warrior instinct stance",
    verdict: "Even; punish the stance and weave the electrics",
    overview:
      "Heihachi hits harder than nearly anyone and his stance pressure is real, but his approach lives on highs and hard commitments that Steve's evasion was built for.",
    doThis: [
      "Interrupt warrior instinct entries with jabs and b+1 before the stance pays off.",
      "Punish hellsweep and his big minus commitments with full launches.",
      "Fight him at range 1 where your counter hits outpace his pokes.",
    ],
    dodge: [
      "Weave under electrics for free launches; it is one of Steve's best tricks in the matchup.",
      "Back off from his stance flurries with ub+3 and let them whiff.",
    ],
    utilise: [
      "SSL-based movement against his linear power moves.",
      "Wall avoidance: his wall damage is the single scariest part of the character.",
    ],
    avoid: [
      "Standing in stance range trying to react; pre-empt or leave.",
      "Trading raw power; his counter-hit conversions out-damage yours.",
    ],
  },
  {
    name: "Hwoarang",
    archetype: "Flamingo kick pressure and tempo control",
    verdict: "Feels worse than it is; even with flamingo discipline",
    overview:
      "Hwoarang buries you in kicks and stance switches, but most of his pressure is high-heavy and gap-riddled. Steve's weave and down-jab turn his blender into counter-hit practice.",
    doThis: [
      "Learn the two or three real gaps in his flamingo strings and jab them.",
      "Stay grounded and block; his mixups need you flinching to work.",
      "Punish his launch-punishable lows and unsafe stance enders hard.",
    ],
    dodge: [
      "Weave and duck his right-leg high loops; half his pressure whiffs over a crouch.",
      "Sidestep left against flamingo approach once he is conditioned to run straight in.",
    ],
    utilise: [
      "db+1 down-jab to slip under kick pressure and reset the pace.",
      "b+1 counter hits when he dances back into range expecting fear.",
    ],
    avoid: [
      "Pressing mid-string in gaps you have not labbed; some are frame traps.",
      "Letting him keep tempo; every blocked sequence should cost him something.",
    ],
  },
  {
    name: "Jack-8",
    archetype: "Long-limb spacing and crushing damage",
    verdict: "Against Steve at range, even inside; entry is everything",
    overview:
      "Jack's arms occupy the space Steve wants to walk through, and his punishment is enormous. But like all giants, once you are inside his elbows he struggles to get you off.",
    doThis: [
      "Approach in short blocks and punish his whiffed long pokes; his recovery is slow.",
      "Stay chest-to-chest once in; his up-close options are far weaker than his mid-range.",
      "Low parry his signature lows once you have seen the rhythm.",
    ],
    dodge: [
      "Sidestep his linear arm pokes; lateral movement beats him harder than backdash.",
      "Weave his high swings during your approach for free entries.",
    ],
    utilise: [
      "Heat to close distance without paying the poke toll.",
      "Jab pressure inside; his big frame makes your strings extremely consistent.",
    ],
    avoid: [
      "Trading pokes at his range; every trade is heavily in his favour.",
      "Ducking near him without a read; his mid damage is round-ending.",
    ],
  },
  {
    name: "Jin",
    archetype: "Complete all-rounder with electric pressure",
    verdict: "Slightly against; Jin has answers, but so does b+1",
    overview:
      "Jin does everything well, so there is no cheese to hide behind. This is the matchup where Steve's fundamentals — counter-hit timing, whiff punishment, wall control — get tested honestly.",
    doThis: [
      "Play the mid-range poke war carefully and take counter hits when he presses back.",
      "Punish his committal lows and hellsweep-style entries on block.",
      "Take the wall early; Jin's comeback potential mid-screen is better than his defense at the wall.",
    ],
    dodge: [
      "Weave under his electric and high pressure between strings.",
      "Respect his parry: vary timing rather than feeding rhythmic punch strings.",
    ],
    utilise: [
      "PAB df+2 elbow against his parry attempts.",
      "ub+3 to bait the electric whiff and punish the recovery.",
    ],
    avoid: [
      "Pressing into zen cancels you have not labbed; some are traps.",
      "Panicking under his plus frames; he converts your mash better than most.",
    ],
  },
  {
    name: "Jun",
    archetype: "Sabaki-laden flow with health-cost power",
    verdict: "Even; elbows and patience defuse her best tools",
    overview:
      "Jun's parries and sabakis punish punch-heavy offense, which sounds like a Steve nightmare until you remember his elbow and reversal-break exist. Her strings are also more punishable than they feel.",
    doThis: [
      "Lead with PAB df+2 elbow once she shows sabaki habits; it cannot be parried.",
      "Use LNH 1+2 to break her reversals for a full launch.",
      "Learn her string punishes; much of her flow is -12 or worse when finished.",
    ],
    dodge: [
      "Do not feed rhythm: delay string enders so her parry timing whiffs.",
      "Block through her genjitsu stance flurries before answering.",
    ],
    utilise: [
      "Throws against her defensive posture; parry-heavy players eat grabs.",
      "Counter hits when she spends her own health on empowered moves and needs to press.",
    ],
    avoid: [
      "Long predictable punch strings; that is her entire defensive design working.",
      "Chasing her evasive twirls; let her come back to you.",
    ],
  },
  {
    name: "Kazuya",
    archetype: "Pure 50/50 wavedash intimidation",
    verdict: "Steve-favoured in neutral; nightmare if you let him dictate",
    overview:
      "Kazuya has the scariest mixup in the game but one of the weakest approaches. Steve's job is simple to say and hard to do: never let him reach wavedash range for free.",
    doThis: [
      "Tax his approach with qcf+1 and df+2 keepout; make crouch-dashing painful.",
      "Launch blocked hellsweep without fail; it is the most valuable punish in the matchup.",
      "Pressure him relentlessly; his own defense is his weakest attribute.",
    ],
    dodge: [
      "Weave under electrics: slipping an EWGF into a launch is a round-swinging moment.",
      "Backdash the first mixup after knockdown rather than guessing immediately.",
    ],
    utilise: [
      "b+1 to clip him out of wavedash the moment he enters range.",
      "Wall pressure; Kazuya defending Lionheart at the wall has no good options.",
    ],
    avoid: [
      "Freezing at crouch-dash range; standing still is choosing to coin-flip.",
      "Ducking early out of fear; his mid of choice launches for the round.",
    ],
  },
  {
    name: "King",
    archetype: "Throw mixups and momentum bullying",
    verdict: "Knowledge check; throw breaks decide everything",
    overview:
      "King's entire threat is conditioning you to freeze so his grabs and Jaguar Sprint bowl you over. Steve does not need to out-grapple him — he needs to break throws and make King strike.",
    doThis: [
      "Grind throw breaks: watch arms, and default to breaking 1+2 versus Giant Swing setups you know.",
      "Duck grabs on read and launch; his command grabs are mostly highs.",
      "Force him to play striking neutral where Steve's counter hits dominate.",
    ],
    dodge: [
      "Weave his mid-range swings; his non-throw offense is more linear than it looks.",
      "Interrupt Jaguar Sprint with a fast mid rather than blocking and guessing.",
    ],
    utilise: [
      "b+1 against his approach; King has to walk into your best button to grab you.",
      "Your own throws: King players famously do not expect to be grabbed back.",
    ],
    avoid: [
      "Panic-ducking after eating one grab; his mids convert your fear into launches.",
      "Standing at range 0 doing nothing; that is literally his win condition.",
    ],
  },
  {
    name: "Kuma / Panda",
    archetype: "Giant hitbox with deceptive range",
    verdict: "Steve-favoured; consistent combos and stable defense win out",
    overview:
      "The bears out-range and out-damage you in raw trades, but their giant frame makes every Steve combo and string more consistent, and their movement cannot handle disciplined mids.",
    doThis: [
      "Punish rolling bear and their big commitments on block or whiff.",
      "Keep them at range 1 where your pokes connect and their paws whiff.",
      "Cash out fully on every launch; the big hurtbox makes optimal routes easy.",
    ],
    dodge: [
      "Sidestep their linear paws; lateral movement beats bears better than blocking.",
      "Stay out of hunting bear stance range instead of contesting its lows point-blank.",
    ],
    utilise: [
      "d+2,1 and qcf+1 against their crouchy stances.",
      "Wall combos; bears take absurd wall damage from Steve's standard routes.",
    ],
    avoid: [
      "Trading at their arm range; bear paws out-damage every poke you own.",
      "Ducking near them; bear mids are among the most damaging in the game.",
    ],
  },
  {
    name: "Kunimitsu",
    archetype: "Ninja hit-and-run with kunai tricks",
    verdict: "Knowledge check; block first, chase never",
    overview:
      "Kunimitsu darts in, stabs, teleports, and leaves. Most of her gimmicks are minus or punishable once identified, and Steve's homing tools punish her constant repositioning.",
    doThis: [
      "Block her flip and teleport follow-ups until you know which are real, then punish.",
      "Occupy centre stage and make her come to you; her damage needs momentum.",
      "Counter hit her re-entries with b+1; she has to keep diving back into range.",
    ],
    dodge: [
      "Stand your ground on teleports; chasing is how her evasion becomes offense.",
      "Weave her high approach pokes during her dart-ins.",
    ],
    utilise: [
      "LNH 1 homing against her lateral movement and stance drift.",
      "Wall pressure; her escape tools degrade badly in the corner.",
    ],
    avoid: [
      "Swinging at empty space after her teleports; wait for her to reappear and commit.",
      "Respecting flash-looking gimmicks that are actually minus; lab, then press.",
    ],
  },
  {
    name: "Lars",
    archetype: "Burst offense through stance entries",
    verdict: "Even; interrupt the stances and he runs out of plan",
    overview:
      "Lars surges in with Silent Entry and Dynamic Entry transitions that look overwhelming but are frequently interruptible or minus. Steve's fast buttons are made for poking holes in exactly this.",
    doThis: [
      "Jab or b+1 his stance entries you know are interruptible; steal the turn constantly.",
      "Block his burst strings and punish the unsafe enders properly.",
      "Make him play neutral after knockdown instead of letting him loop entries.",
    ],
    dodge: [
      "Sidestep his linear dash-in offense once he is conditioned to run straight.",
      "Weave the high enders of his strings for launch-level counter hits.",
    ],
    utilise: [
      "qcf+1 keepout to tax every Dynamic Entry approach.",
      "Your wall game; Lars's own defense at the wall is mediocre.",
    ],
    avoid: [
      "Holding block through entire stance sequences; passivity lets fake pressure become real.",
      "Challenging the specific entries that are genuinely plus; know which is which.",
    ],
  },
  {
    name: "Law",
    archetype: "Dragon sign flow and slide mixups",
    verdict: "Even; elbows beat the parry, patience beats the slide",
    overview:
      "Law's DSS flow and junkyard strings punish impatience, and his punch parry directly targets Steve's offense. The counters exist, but you have to actually use them.",
    doThis: [
      "Mix PAB df+2 elbow into pressure once he shows parry attempts.",
      "Punish blocked slide with a full while-standing launch every time.",
      "Interrupt DSS transitions with jabs where gaps exist.",
    ],
    dodge: [
      "React to the slide at range rather than pre-emptively crouching.",
      "Weave his high string enders; his flow leaks counter-hit opportunities.",
    ],
    utilise: [
      "Delayed string timing to make his parry windows whiff.",
      "b+1 when he dances at range 1 fishing for your buttons.",
    ],
    avoid: [
      "Rhythmic punch strings into his parry; vary or pay.",
      "Pressing after his plus-on-block DSS mids; respect, then counter.",
    ],
  },
  {
    name: "Lee",
    archetype: "Precision keepout and just-frame execution",
    verdict: "Even; deny his range and his execution stops mattering",
    overview:
      "Lee wants perfect spacing where his kicks and acid rain punish everything. His up-close defense and damage without walls are much weaker — Steve should turn this into a phone-booth fight.",
    doThis: [
      "Close him down patiently and fight at range 0-1 where his keepout is irrelevant.",
      "Punish hitman stance lows and his slide on block.",
      "Counter hit his check buttons; his pokes lose the CH war to yours.",
    ],
    dodge: [
      "Weave his high kick keepout on approach.",
      "Do not backdash predictably; acid rain and his kicks farm retreating opponents.",
    ],
    utilise: [
      "Jab pressure and stance mix inside; he wants space you should never give back.",
      "Wall carry; Lee's defense at the wall cracks under Lionheart.",
    ],
    avoid: [
      "Whiffing at mid-range; Lee's whiff punishment is elite.",
      "Respecting hitman stance too much; most options are steppable or minus.",
    ],
  },
  {
    name: "Leo",
    archetype: "Solid mids with stance layering",
    verdict: "Even; honest fight where counter hits tip the scales",
    overview:
      "Leo's fundamentals mirror Steve's: strong mids, stance pressure, few weaknesses. Neither side gets gimmicks here, so the counter-hit war and wall control decide it.",
    doThis: [
      "Contest the mid-range with df+2 and qcf+1; Leo has to fight for every inch.",
      "Punish KNK stance lows and unsafe enders on block.",
      "Take counter hits when Leo re-presses after minus strings.",
    ],
    dodge: [
      "Sidestep more than usual; several of Leo's core mids are linear.",
      "Block through KNK stance first; guessing early is what the stance wants.",
    ],
    utilise: [
      "b+1 in the gaps of Leo's turn-taking; it wins the exchange war.",
      "Your superior evasion; ub+3 makes Leo's committed mids whiff.",
    ],
    avoid: [
      "Ducking against a character built on strong mids; stand block is your friend.",
      "Letting Leo take the wall; their wall game rivals yours.",
    ],
  },
  {
    name: "Leroy",
    archetype: "Parry-centric counter fighting",
    verdict: "Steve-favoured once the parry stops working",
    overview:
      "Leroy's parry directly answers punch offense, which makes lazy Steve play miserable. But Steve owns the cleanest parry counters in the game, and Leroy without parry momentum is just a slower poker.",
    doThis: [
      "Lead with elbows: PAB df+2 launches and ignores the parry entirely.",
      "Use LNH 1+2 reversal break when he leans on defensive answers.",
      "Punish his sway-back lows and committal strings on block.",
    ],
    dodge: [
      "Break your own rhythm: delayed enders make his parry whiff into launch range.",
      "Weave his high pokes; his neutral leaks counter hits when he cannot parry.",
    ],
    utilise: [
      "Throws against his wait-and-parry posture.",
      "Heat pressure; chip forces him to act instead of sitting on defense.",
    ],
    avoid: [
      "Feeding the same string twice in a row; that is parry practice for him.",
      "Panicking after one parry launch; adjust timing rather than abandoning offense.",
    ],
  },
  {
    name: "Lidia",
    archetype: "Karate stance 50/50s with heavy commitment",
    verdict: "Even; block mid first and punish the commitment",
    overview:
      "Lidia's cat stance mixups and power crush stance make her terrifying to guess against, but nearly everything she commits to is punishable when read. Discipline beats aggression here.",
    doThis: [
      "Default to blocking mid in her stance mix and punish the lows you catch.",
      "Punish her unsafe stance launchers properly; she pays real frames for her damage.",
      "Counter hit her stance entries before they become mixups.",
    ],
    dodge: [
      "Back off with ub+3 as she enters stance; her mix needs you in range.",
      "Sidestep her linear charge moves after conditioning.",
    ],
    utilise: [
      "b+1 to clip stance transitions; her entries are slower than your best button.",
      "Wall control; her guessing games are worst for you at the wall, so fight mid-stage.",
    ],
    avoid: [
      "Guessing low against her; her mids hurt far more than her lows.",
      "Pressing into her power crush stance without a mid ready.",
    ],
  },
  {
    name: "Lili",
    archetype: "Evasive flips and whiff-punish royalty",
    verdict: "Even; she feeds on whiffs, so do not give her any",
    overview:
      "Lili converts your missed buttons into full combos better than almost anyone, and her flips make chasing feel useless. The fix is unglamorous: whiff less, block more, punish her risk-taking.",
    doThis: [
      "Play tight, short pokes; her whiff punishment needs you swinging at air.",
      "Punish Matterhorn and her flip commitments on block or landing.",
      "Ground her with quick mids the moment she starts her acrobatics.",
    ],
    dodge: [
      "Do not chase backturn flips; hold ground and punish the return trip.",
      "Weave her high pokes during her bullying phases.",
    ],
    utilise: [
      "LNH 1 homing to end her sidestep-heavy movement.",
      "Counter hits when she re-engages; her entries lose to b+1 timing.",
    ],
    avoid: [
      "Whiffing big buttons at mid-range; that is her entire game plan fed by you.",
      "Getting impatient with dew glide mix; block first, label it, then punish.",
    ],
  },
  {
    name: "Miary Zo",
    archetype: "Spirit-powered stance shifting",
    verdict: "Knowledge check; her power states need momentum you can deny",
    overview:
      "Miary Zo cycles through empowered states and unfamiliar stance rhythms that most players simply have not labbed yet. Treat her like every new-generation stance character: block first, learn which transitions are real, and tax her entries with counter hits.",
    doThis: [
      "Block through her stance sequences early rounds and bank which enders are minus.",
      "Interrupt her stance entries with jabs and b+1 the moment you spot the interruptible ones.",
      "Punish her committal empowered moves on block; the reward she chases comes with real recovery.",
    ],
    dodge: [
      "Weave her high-heavy pressure strings; unfamiliar does not mean gapless.",
      "Back off with ub+3 when she powers up rather than pressing into buffed frames.",
    ],
    utilise: [
      "LNH 1 homing against her weaving stance movement.",
      "Your own tempo: unfamiliar characters rely on you hesitating, so keep your normal frame-trap game running.",
    ],
    avoid: [
      "Freezing at animations you have not seen; default to stand block and punish after.",
      "Letting her sit in empowered states for free; pressure her the moment she buffs.",
    ],
  },
  {
    name: "Nina",
    archetype: "Frame-tight pressure with evasive weaving",
    verdict: "Slightly against; her offense is real, make her defend",
    overview:
      "Nina's blonde-bomb pressure, ss1 evasion, and wall loops make her one of the scariest offensive characters alive. Steve cannot out-pressure her turtling; he wins by punishing her entries and denying the wall.",
    doThis: [
      "Contest ss1 with homing LNH 1; her evasion habit is her most punishable one.",
      "Take your turn after her minus strings instead of holding block forever.",
      "Fight for centre stage; her wall game is the single biggest threat.",
    ],
    dodge: [
      "Weave her high pressure enders; her flow leaks counter-hit gaps.",
      "Duck her known high enders for launch punishes once labbed.",
    ],
    utilise: [
      "b+1 against her re-engagement; she has to keep coming to you.",
      "Your own wall pressure; Nina defending is dramatically weaker than Nina attacking.",
    ],
    avoid: [
      "Freezing at the wall; her loops are designed to execute exactly that.",
      "Chasing her sidestep cancels with linear mids; use homing or wait.",
    ],
  },
  {
    name: "Paul",
    archetype: "Deathfist deterrence and demolition mixups",
    verdict: "Steve-favoured; his risk-taking feeds your counter hits",
    overview:
      "Paul's damage is legendary but nearly all of it rides on committal, punishable moves. Steve's whole design — bait, counter hit, punish — is a natural answer to a character built on big swings.",
    doThis: [
      "Block deathfist and punish it hard every time; that discipline is the matchup.",
      "Counter hit his demolition man entries and qcb setups with b+1.",
      "Punish his launch-punishable lows on block without mercy.",
    ],
    dodge: [
      "Sidestep his linear power moves; deathfist and friends hate lateral movement.",
      "Do not stand in sway range watching; back off or pre-empt.",
    ],
    utilise: [
      "ub+3 to make deathfist whiff, then launch the recovery.",
      "Frame traps: Paul players press back constantly, feeding your CH engine.",
    ],
    avoid: [
      "Ducking anywhere near him without a read; one deathfist erases a health bar.",
      "Trading recklessly when he has heat; empowered Paul damage ends rounds instantly.",
    ],
  },
  {
    name: "Raven",
    archetype: "Teleport trickery and back-turn shenanigans",
    verdict: "Knowledge check; punish the gimmicks, ignore the theatre",
    overview:
      "Raven's clones, teleports, and back-turn stance sell an illusion of safety that mostly is not real. Steve's job is to keep his composure, hit back-turn with mids, and never chase shadows.",
    doThis: [
      "Hit his back-turn stance with quick mids; most BT options lose to being pressed on.",
      "Block and punish his teleport follow-ups once you know which are minus.",
      "Control centre stage and make him spend resources approaching.",
    ],
    dodge: [
      "Hold position when he teleports; swinging at empty space is his win condition.",
      "Weave his high approach pokes on his way in.",
    ],
    utilise: [
      "LNH 1 homing against his constant repositioning.",
      "Counter hits when he lands from gimmicks needing to press.",
    ],
    avoid: [
      "Chasing clones or panicking at unfamiliar animations; block first, always.",
      "Standing next to back-turn respectfully; that stance needs your hesitation.",
    ],
  },
  {
    name: "Reina",
    archetype: "Mishima mix with Sentai stance flow",
    verdict: "Even; interrupt Sentai and weave the electrics",
    overview:
      "Reina blends electric pressure with Sentai stance transitions that punish passive blocking. She is at her best when you freeze and at her worst when you contest her entries with fast buttons.",
    doThis: [
      "Interrupt Sentai transitions with jabs and b+1; most entries are not free.",
      "Punish her unsafe stance lows and sweeps on block.",
      "Keep her out of wavedash range with qcf+1 taxes.",
    ],
    dodge: [
      "Weave under her electrics for free launches.",
      "Backdash the first post-knockdown mixup instead of guessing.",
    ],
    utilise: [
      "b+1 counter hits on her dash-ins; she must approach through your best button.",
      "Wall pressure; her defense is significantly weaker than her offense.",
    ],
    avoid: [
      "Holding back and watching Sentai flow; passivity converts her fake pressure into real damage.",
      "Ducking at crouch-dash range without a hard read.",
    ],
  },
  {
    name: "Shaheen",
    archetype: "Honest mids with a slide wildcard",
    verdict: "Steve-favoured; you out-gun him in the poke war",
    overview:
      "Shaheen fights clean: great mids, solid pokes, and the snake-step slide as his one trick. Steve simply has better counter-hit tools in the same weight class, so the fundamentals fight leans your way.",
    doThis: [
      "Out-poke him: b+1 and df+2 beat his check buttons in the CH war.",
      "React to the slide at range and block it for a full launch punish.",
      "Punish his committal keepout swings on whiff.",
    ],
    dodge: [
      "Weave his high pokes between his turns.",
      "Sidestep his linear mids after establishing block respect.",
    ],
    utilise: [
      "Frame traps; Shaheen players take their turn back on rhythm, feeding b+1.",
      "Your stance pressure; he lacks panic tools against Lionheart at the wall.",
    ],
    avoid: [
      "Pre-emptive crouching for the slide; his mids punish paranoia.",
      "Giving him whiffs at mid-range; his whiff punishment is his best weapon.",
    ],
  },
  {
    name: "Steve (mirror)",
    archetype: "The knowledge war",
    verdict: "Whoever knows the counterplay chapter better wins",
    overview:
      "The mirror is a test of who actually understands Steve's weaknesses. Everything in the Secrets tab cuts both ways here — the winner is the player exploiting Steve's own holes harder.",
    doThis: [
      "Sidestep left and duck: it option-selects most of Steve's offense including your mirror's.",
      "Duck flicker highs and b+1 on read; his highs are the backbone of his damage.",
      "Punish db+3,2 on block with a launch; never let the low loop start.",
    ],
    dodge: [
      "Do not press into FLK 1,d+1 at 0; walk back and whiff punish the b+1 attempt.",
      "Watch for swindler cancels before committing to ducks against Lionheart entries.",
    ],
    utilise: [
      "Elbow-free offense punishing: his weave loses to well-timed lows and homing mids — use LNH 1.",
      "Your own delayed timings; mirror players punish on autopilot rhythm.",
    ],
    avoid: [
      "Flicker-vs-flicker chicken at range; the first to whiff a high loses the exchange.",
      "Assuming your habits are invisible; everything you do, he also knows the answer to.",
    ],
  },
  {
    name: "Victor",
    archetype: "Iai flash offense with stance loops",
    verdict: "Steve-favoured with knowledge; his pressure leaks highs",
    overview:
      "Victor's perfumer stance and sword dashes look overwhelming, but his pressure is riddled with duckable highs and minus transitions. Once labbed, Steve turns his flash into launch practice.",
    doThis: [
      "Duck his known high enders and stance highs for full launches.",
      "Interrupt perfumer transitions with jabs where he is not actually plus.",
      "Punish his unsafe sword commitments on block.",
    ],
    dodge: [
      "Weave his high pokes; his neutral leans on them heavily.",
      "Sidestep his linear iai dashes rather than blocking passively.",
    ],
    utilise: [
      "b+1 counter hits as he re-engages from stance resets.",
      "Wall pressure; his escape options from Lionheart mix are poor.",
    ],
    avoid: [
      "Freezing against unfamiliar stance flow; that hesitation is his entire character.",
      "Pressing into the transitions that are genuinely plus; lab which loops are real.",
    ],
  },
  {
    name: "Xiaoyu",
    archetype: "AOP evasion and scrambling chaos",
    verdict: "Annoying; against Steve's highs, even for his mids",
    overview:
      "Art of Phoenix ducks under Steve's beloved highs, which deletes half your usual offense. The matchup flips once you commit to a mid-heavy game plan and stop feeding her evasion.",
    doThis: [
      "Go mid-first: qcf+1, df+2, d+2,1 and down-jabs all tag AOP.",
      "Punish her AOP lows and hypnotist gimmicks on block.",
      "Keep her at range 1; her scramble needs closeness to function.",
    ],
    dodge: [
      "Hold highs entirely when she is low; flicker spam is free launches for her.",
      "Do not backdash predictably; California roll and her range creep hunt retreat.",
    ],
    utilise: [
      "LNH 1 homing against her constant twirling movement.",
      "Wall pressure; her evasion has far less room to breathe in the corner.",
    ],
    avoid: [
      "Autopiloting b+1 and flicker; every whiff over AOP is a full combo against you.",
      "Chasing her backturn; wait and punish the return option instead.",
    ],
  },
  {
    name: "Yoshimitsu",
    archetype: "Gimmick arsenal and flash punishment",
    verdict: "Knowledge check; composure beats the toolbox",
    overview:
      "Yoshimitsu owns the game's strangest toolkit: flash, sword unblockables, self-damage stances. None of it survives an opponent who blocks first and refuses to press into flash range.",
    doThis: [
      "Block and identify before pressing; most gimmicks are heavily minus once blocked.",
      "Punish sword commitments and unblockable attempts with full launches.",
      "Keep steady mid pressure; he wants chaos, so give him structure.",
    ],
    dodge: [
      "Never press immediately at point-blank after his blocked strings; flash beats buttons.",
      "Back off from NSS and bad-breath stance games instead of guessing inside them.",
    ],
    utilise: [
      "Throws against his flash-ready posture; grabs beat flash.",
      "b+1 at ranges where flash cannot reach but his pokes can.",
    ],
    avoid: [
      "Panicking at unfamiliar animations; that is the entire character working as designed.",
      "Chasing him during health-regen stance at range; approach behind block, then punish.",
    ],
  },
  {
    name: "Zafina",
    archetype: "Low-profile stances and creeping chip",
    verdict: "Even; mid discipline dismantles her stances",
    overview:
      "Zafina's stances low-profile highs and her Azazel arm chips you constantly. Steve needs the same fix as against Xiaoyu: lead with mids and punish her stance lows on block.",
    doThis: [
      "Feed her stances mids: qcf+1 and d+2,1 tag her low-profile postures.",
      "Punish her launch-punishable stance lows every time.",
      "Pressure her health directly; her Azazel moves cost her own life bar.",
    ],
    dodge: [
      "Hold your highs when she is in mantis or tarantula; they whiff into launches.",
      "Block low patiently against tarantula; her mids from it are the lesser threat.",
    ],
    utilise: [
      "LNH 1 homing against her slithering stance movement.",
      "Counter hits as she rises out of stances needing to press.",
    ],
    avoid: [
      "Flicker autopilot; half your high offense does not exist in this matchup.",
      "Chasing her into stances; let her come out and punish the exit.",
    ],
  },
];

function getOkizemeUrl(search: string) {
  return `https://okizeme.gg/database/steve?search=${encodeURIComponent(search)}`;
}

function getClipUrl(search: string) {
  return `https://okizeme.b-cdn.net/steve/${encodeURIComponent(search)}.mp4`;
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
          ? "border-sky-300 bg-sky-300 text-slate-950"
          : "border-sky-400/35 text-sky-200 hover:border-sky-300 hover:text-white"
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
      <aside className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm leading-7 text-slate-400 xl:sticky xl:top-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Video player
        </p>
        <p className="mt-3">
          Pick any clip button and the video will open here in a larger player.
        </p>
      </aside>
    );
  }

  const title = getClipTitle(activeClip.clip.label);

  return (
    <aside className="overflow-hidden rounded-3xl border border-sky-400/25 bg-slate-950/80 shadow-2xl shadow-slate-950/40 xl:sticky xl:top-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Now watching
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        </div>
        <a
          href={getOkizemeUrl(activeClip.clip.search)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-sky-400/60 hover:text-white"
        >
          Full move card
        </a>
      </div>
      <video
        key={activeClip.clipKey}
        className="aspect-video w-full bg-black"
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
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
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

export function SteveGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("dojo");
  const [activeClip, setActiveClip] = useState<{
    clipKey: string;
    clip: Clip;
  } | null>(null);
  const activeClipKey = activeClip?.clipKey ?? null;
  const [activeMatchupName, setActiveMatchupName] = useState<string | null>(
    null,
  );

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
        return "A Steve-focused training tab built like a practical study board: drills, cues, and embedded clips beside each drill button.";
      case "gameplan":
        return "The round flow behind the drills: how Steve gets control, when he cashes out, and what he should stop pretending to be.";
      case "toolkit":
        return "The buttons that hold the character together, with quick notes on when to use them and what they are really for.";
      case "clips":
        return "Play Steve move clips inside each pack, then jump to okizeme.gg only if you want the full move card and frame breakdown.";
      case "secrets":
        return "The layer above the guide: hidden inputs, buried move properties, and the flowcharts high-level Steves actually run. Built for players who already know the character.";
      case "matchups":
        return "Pick your opponent and get a loading-screen briefing: what to do, what to dodge, what to lean on, and what will get you killed.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-10 space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/30 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          Tekken 8
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Steve Fox Study Hall
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Steve is at his best when he turns every small hesitation into
              awkward, layered pressure. This guide pulls together Steve
              priorities from tournament-level guide material, community advice,
              and filtered Steve move pages on okizeme.gg so you can study the
              character like a training plan instead of a random note dump.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            Focus: counter hits, stance pressure, wall snowballing
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-2 shadow-inner shadow-black/30 sm:grid-cols-2 lg:grid-cols-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const hasIcon = "icon" in tab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveClip(null);
                }}
                className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition duration-200 ${
                  isActive
                    ? "border-sky-300/70 bg-sky-300 text-slate-950 shadow-lg shadow-sky-950/30"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-sky-300/40 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span
                  className={`absolute inset-x-3 top-0 h-px transition ${
                    isActive
                      ? "bg-slate-950/30"
                      : "bg-gradient-to-r from-transparent via-sky-300/40 to-transparent opacity-0 group-hover:opacity-100"
                  }`}
                />
                <span className="flex items-center gap-3">
                  {hasIcon ? (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[0.7rem] font-black tracking-[0.16em] ${
                        isActive
                          ? "border-slate-950/20 bg-slate-950/10 text-slate-950"
                          : tab.tone === "rose"
                            ? "border-rose-300/25 bg-rose-300/10 text-rose-200"
                            : tab.tone === "amber"
                            ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
                            : tab.tone === "emerald"
                              ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                              : tab.tone === "violet"
                                ? "border-violet-300/25 bg-violet-300/10 text-violet-200"
                                : tab.tone === "cyan"
                                  ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                                  : "border-sky-300/25 bg-sky-300/10 text-sky-200"
                      }`}
                    >
                      {tab.icon}
                    </span>
                  ) : null}
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
            title="Daily Steve drills"
            copy="Run one or two of these per session instead of trying to learn every stance at once. Steve improves fastest when you isolate one layer, repeat it until it feels natural, then stack the next layer on top."
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
            title="How Steve should feel"
            copy="Think of Steve as a pressure sculptor, not a basic launcher character. The round should feel increasingly uncomfortable for the opponent until they gamble into the counter hit or freeze long enough for you to take the wall."
          />

          <div className="grid gap-4">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
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
            title="The buttons doing the real work"
            copy="These are the tools most worth revisiting when your Steve feels flat. If one of these is missing from your rounds, the character usually starts to feel fake or overcomplicated."
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5">
              {toolkit.map((tool) => (
                <article
                  key={tool.move}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                        {tool.role}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">
                        {tool.move}
                      </h3>
                    </div>
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
            title="Embedded Steve clip packs"
            copy="Each button opens its own embedded clip in place. Use these as quick presets when you want to study Steve by theme instead of hunting for each move one by one."
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="grid gap-5">
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

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm leading-7 text-slate-400">
            Source blend: high-level Steve identity and stance priorities were
            cross-checked against the Steve guide on TekkenDocs, community
            breakdowns, and live move searches on okizeme.gg. Treat this page
            like a study board, then verify exact frame details in-game if a
            patch shifts something important.
          </div>
        </section>
      ) : null}

      {activeTab === "secrets" ? (
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Secrets"
            title="The tech nobody puts on the front page"
            copy="Everything here assumes you already play Steve. These are the hidden inputs, buried move properties, and battle-tested flowcharts that separate a solid Steve from one that feels genuinely unfair to fight."
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-start">
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                  Hidden tech
                </h3>
                <div className="grid gap-5">
                  {secretTech.map((tech) => (
                    <article
                      key={tech.title}
                      className="rounded-3xl border border-amber-400/15 bg-white/5 p-6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                        {tech.tag}
                      </p>
                      <h4 className="mt-3 text-xl font-semibold text-white">
                        {tech.title}
                      </h4>
                      <p className="mt-4 text-sm leading-7 text-slate-300">
                        {tech.secret}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        <span className="font-medium text-slate-200">
                          How to do it:
                        </span>{" "}
                        {tech.execution}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        <span className="font-medium text-slate-200">
                          Why it wins:
                        </span>{" "}
                        {tech.payoff}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {tech.clips.map((clip) => (
                          <ClipButton
                            key={`${tech.title}-${clip.search}`}
                            clip={clip}
                            clipKey={`secrets-tech-${tech.title}-${clip.search}`}
                            activeClipKey={activeClipKey}
                            onPlay={playClip}
                          />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                  Flowcharts that catch people
                </h3>
                <div className="grid gap-5">
                  {secretFlowcharts.map((flow) => (
                    <article
                      key={flow.title}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <h4 className="text-xl font-semibold text-white">
                        {flow.title}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {flow.hook}
                      </p>

                      <ol className="mt-5 space-y-2">
                        {flow.steps.map((step, index) => (
                          <li
                            key={step}
                            className="flex gap-3 rounded-2xl bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
                          >
                            <span className="font-semibold text-amber-300">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>

                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        <span className="font-medium text-slate-200">
                          If they adapt:
                        </span>{" "}
                        {flow.escapeHatch}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {flow.clips.map((clip) => (
                          <ClipButton
                            key={`${flow.title}-${clip.search}`}
                            clip={clip}
                            clipKey={`secrets-flow-${flow.title}-${clip.search}`}
                            activeClipKey={activeClipKey}
                            onPlay={playClip}
                          />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <ClipPlayer activeClip={activeClip} />
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
              Habits of scary Steves
            </h3>
            <div className="grid gap-4">
              {secretHabits.map((habit) => (
                <article
                  key={habit.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
                >
                  <h4 className="text-lg font-semibold text-white">
                    {habit.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {habit.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "matchups" ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Matchups"
            title="Loading-screen briefings"
            copy="Tap the character you're about to fight. Each briefing is written to be scanned in under a minute: the plan, the dodges, the tools to lean on, and the mistakes that lose the match."
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
                      ? "border-rose-300 bg-rose-300 text-slate-950"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-rose-300/60 hover:text-white"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <article className="rounded-3xl border border-rose-300/20 bg-slate-950/70 p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
                    {activeMatchup.archetype}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    Steve vs {activeMatchup.name}
                  </h3>
                </div>
                <div className="rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100 lg:max-w-xs">
                  {activeMatchup.verdict}
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {activeMatchup.overview}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                    Do this
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeMatchup.doThis.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-sky-300/20 bg-sky-300/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                    How to dodge
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeMatchup.dodge.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                    Utilise
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeMatchup.utilise.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
                    Don't do
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {activeMatchup.avoid.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm leading-6 text-slate-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm leading-7 text-slate-400">
              No character selected yet. Pick who you're fighting and the
              briefing appears here, laid out for a quick scan while the
              loading screen counts down.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

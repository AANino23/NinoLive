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

const OKIZEME_CHARACTER = "kazuya";

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
  { id: "dojo", label: "Dojo", icon: "EWG" },
  { id: "gameplan", label: "Gameplan", icon: "GP" },
  { id: "toolkit", label: "Toolkit", icon: "12" },
  { id: "clips", label: "Clips", icon: "REC" },
  { id: "secrets", label: "Secrets", icon: "EX" },
  { id: "matchups", label: "Matchups", icon: "VS" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const dojoDrills: Drill[] = [
  {
    title: "Wavedash until it disappears",
    summary: "Kazuya is a movement character wearing a mixup character's clothes. The crouch dash is the engine for every threat he owns.",
    why: "f,n,d,df is how the electric, the hellsweep, and the mid all come out of the same motion. If the dash is slow or inconsistent, the 50/50 stops existing and you are just a slow poke character.",
    drill:
      "Five minutes of wavedash with no attack at all. Advance, retreat, and hold the dash at mid-range. Only after that, add one f,n,d,df+2 per screen crossing.",
    cues: [
      "The dash is the threat; the button is the payment.",
      "Practise wavedash backwards too — it is your best defensive movement.",
      "If the electric drops, slow the dash down rather than mashing faster.",
    ],
    clips: [
      { label: "Watch f,n,d,df+2", search: "f,n,d,df+2" },
      { label: "Watch f,n,d,DF+4", search: "f,n,d,DF+4" },
      { label: "Watch df+1", search: "df+1" },
    ],
  },
  {
    title: "Electric as a whiff punish first",
    summary: "The electric is not an opener. It is the reward for their impatience, and it is why Kazuya rounds end suddenly.",
    why: "f,n,d,df+2 launches on hit and is plus on block. Fished in neutral it trades and loses; used on a whiff it converts a mistake into most of a health bar.",
    drill:
      "Set the dummy to throw a long string, then block it and wavedash back. On the recovery, electric. Repeat until you stop pressing on the ones you cannot reach.",
    cues: [
      "Wavedash back first, then punish — do not walk into the whiff.",
      "A blocked electric is still your turn; do not abandon pressure.",
      "If it keeps coming out as a normal Wind God Fist, you are still plus, but stop pressing after it.",
    ],
    clips: [
      { label: "Watch f,n,d,df+2", search: "f,n,d,df+2" },
      { label: "Watch df+2", search: "df+2" },
      { label: "Watch uf+4", search: "uf+4" },
    ],
  },
  {
    title: "Hellsweep only after the mid lands",
    summary: "The famous 50/50 is a reward for conditioning, not a first-round opener.",
    why: "f,n,d,DF+4 is around -23 on block. Against anyone who knows the matchup, a raw hellsweep is a donated combo. It becomes unfair only once they are already standing still for the electric.",
    drill:
      "From wavedash, throw four mids for every one hellsweep. Track when the opponent starts holding block standing — that is the only moment the low is worth it.",
    cues: [
      "Mid first, low second. Always in that order.",
      "One blocked hellsweep costs more than three landed ones earn.",
      "f,n,d,df+4,4 is the version that keeps you moving on hit.",
    ],
    clips: [
      { label: "Watch f,n,d,DF+4", search: "f,n,d,DF+4" },
      { label: "Watch f,n,d,df+4,4", search: "f,n,d,df+4,4" },
      { label: "Watch f,n,d,df+2", search: "f,n,d,df+2" },
    ],
  },
  {
    title: "The boring layer: df+1 and b+2,4",
    summary: "Between electrics, Kazuya still needs honest buttons that do not cost the round on block.",
    why: "df+1 is the safe mid check and b+2,4 is the range extender. Players who only wavedash and hellsweep get stepped, blocked, and launched; the boring buttons are what buy the space for the scary ones.",
    drill:
      "Play a round where you are only allowed df+1, b+2,4, and 4. Note how much of your damage still arrives simply because they cannot press.",
    cues: [
      "df+1 checks steps and keeps you safe.",
      "b+2,4 is the reach tool when they respect the dash from further out.",
      "4 is the fast high check when they start creeping forward.",
    ],
    clips: [
      { label: "Watch df+1", search: "df+1" },
      { label: "Watch b+2,4", search: "b+2,4" },
      { label: "Watch 4", search: "4" },
    ],
  },
  {
    title: "Punisher ladder: i10, i13, i15",
    summary: "Kazuya punishes harder than almost anyone, but only if you know your tier before the block ends.",
    why: "1,2 at i10, electric at i13, df+2 at i15. Settling for a jab on a -15 launcher throws away the reason to play this character.",
    drill:
      "Set the dummy to -10, -13, and -15 and drill 1,2, f,n,d,df+2, and df+2 in turn. Then set it to a blocked low and drill ws2.",
    cues: [
      "-13 is already a launch if the electric is clean.",
      "df+2 is the no-execution launch punish from -15 up.",
      "After blocking a low, punish from crouch with ws2 — do not stand up first.",
    ],
    clips: [
      { label: "Watch 1,2", search: "1,2" },
      { label: "Watch df+2", search: "df+2" },
      { label: "Watch ws2", search: "ws2" },
    ],
  },
  {
    title: "Defence drill: Kazuya has none",
    summary: "This character has no parry, no armour, and no cheap escape. Movement and blocking are the entire defensive kit.",
    why: "Most Kazuya losses are self-inflicted: mashing electric out of blockstun, hellsweeping on defence, hopkicking into a mid. The character is built to lose the exchanges he starts from behind.",
    drill:
      "Play three rounds where you never press a button while blocking. Escape only with backdash, sidestep, and low parry. Count how many turns you were actually given for free.",
    cues: [
      "Blocking is a real option; mashing electric from -8 is not.",
      "Sidestep left or right depending on their string, then punish.",
      "d+2 and uf+4 are turn-stealers, not defence.",
    ],
    clips: [
      { label: "Watch d+2", search: "d+2" },
      { label: "Watch uf+4", search: "uf+4" },
      { label: "Watch df+1", search: "df+1" },
    ],
  },
  {
    title: "Heat on momentum, not on panic",
    summary: "Devil pressure is a lead extender. It does not rescue a round you are already losing at neutral.",
    why: "Heat gives Kazuya chip, faster approach, and Devil follow-ups that make blocking expensive. Spending it while you are being pushed to the wall gets you the same bad position with no Heat left.",
    drill:
      "Activate only after an electric launch, a wall splat, or a confirmed counter hit. Then run one f+1+2 or db+1,2 route per opening rather than emptying the bar.",
    cues: [
      "Heat belongs on a lead, not on a recovery.",
      "Devil routes make the wall carry brutal — save it for wall-side rounds.",
      "Do not burn Heat to escape bad spacing; wavedash back instead.",
    ],
    clips: [
      { label: "Watch f+1+2", search: "f+1+2" },
      { label: "Watch db+1,2", search: "db+1,2" },
      { label: "Watch f,n,d,df+2", search: "f,n,d,df+2" },
    ],
  },
];

const gameplan = [
  {
    title: "The dash is the gameplan",
    copy:
      "Kazuya does not open people up with novelty. He walks into electric range, holds the crouch dash, and forces the opponent to guess whether to press, step, or wait. Everything else is a follow-up to that pressure.",
  },
  {
    title: "Punish first, mix second",
    copy:
      "Take every free punish before you gamble on a hellsweep. A player who never drops an i13 punish is already winning most rounds without touching the 50/50.",
  },
  {
    title: "Condition with mids, cash with lows",
    copy:
      "Show them the electric and df+1 until they hold standing block. The hellsweep exists to punish that stillness, not to create it.",
  },
  {
    title: "Respect your own risk",
    copy:
      "Hellsweep and hopkick are launch-punishable. Kazuya loses to opponents who simply block and take their turn, so throw the risky options with a reason, not a rhythm.",
  },
  {
    title: "Spend Heat when you are ahead",
    copy:
      "Heat is worth the most on wall carry and after a confirmed launch. Activating it to escape pressure trades your best comeback resource for nothing.",
  },
];

const toolkit: ToolCard[] = [
  {
    move: "f,n,d,df+2",
    role: "Electric — the entire character",
    when: "Whiff punish, i13 block punish, and plus-on-block pressure once you are in range.",
    risk: "Dropped inputs give the normal Wind God Fist, which is far less plus. Fished at neutral it gets stepped and launched.",
    clip: { label: "Play f,n,d,df+2", search: "f,n,d,df+2" },
  },
  {
    move: "f,n,d,DF+4",
    role: "Hellsweep",
    when: "Only after they have stopped pressing and started standing still for the electric.",
    risk: "Around -23 on block. One read from them and you lose most of the health bar.",
    clip: { label: "Play f,n,d,DF+4", search: "f,n,d,DF+4" },
  },
  {
    move: "df+1",
    role: "Safe mid check",
    when: "Use it to interrupt steps, hold your space, and keep a turn when the electric is not worth the risk.",
    risk: "No real reward on its own. If you only throw df+1 you will get walked down.",
    clip: { label: "Play df+1", search: "df+1" },
  },
  {
    move: "df+2",
    role: "Standing launch punish",
    when: "Use it from -15 and up, and any time you do not trust the electric input under pressure.",
    risk: "Launch-punishable itself. It is a punish, not a poke.",
    clip: { label: "Play df+2", search: "df+2" },
  },
  {
    move: "ws2",
    role: "Crouch launcher",
    when: "After blocking a low, or out of the crouch dash when they press into it.",
    risk: "Around -18 on block. Only throw it when you actually blocked something.",
    clip: { label: "Play ws2", search: "ws2" },
  },
  {
    move: "b+2,4",
    role: "Range extender",
    when: "Use it when they are respecting the dash from just outside electric range.",
    risk: "The ender is duckable if you become predictable with it. Mix in b+2 alone.",
    clip: { label: "Play b+2,4", search: "b+2,4" },
  },
  {
    move: "df+4,4",
    role: "Mid into low chip",
    when: "A cheaper opener than the hellsweep when you want low damage without a launch risk.",
    risk: "The follow-up is minus. Do not repeat it against players who punish from crouch.",
    clip: { label: "Play df+4,4", search: "df+4,4" },
  },
  {
    move: "uf+4",
    role: "Hopkick and panic launcher",
    when: "Use it to launch predictable lows and to escape a rhythm they have set.",
    risk: "Launch-punishable on block and it loses to every mid. Reads only.",
    clip: { label: "Play uf+4", search: "uf+4" },
  },
];

const clipPacks: ClipPack[] = [
  {
    title: "Wavedash pack",
    notes: "The crouch dash tools that make the whole character work.",
    clips: [
      { label: "f,n,d,df+2", search: "f,n,d,df+2" },
      { label: "f,n,d,DF+4", search: "f,n,d,DF+4" },
      { label: "f,n,d,df+4,4", search: "f,n,d,df+4,4" },
      { label: "f,n,d,df+1", search: "f,n,d,df+1" },
    ],
  },
  {
    title: "Poke pack",
    notes: "The honest buttons that buy space between electrics.",
    clips: [
      { label: "df+1", search: "df+1" },
      { label: "b+2,4", search: "b+2,4" },
      { label: "4", search: "4" },
      { label: "df+4,4", search: "df+4,4" },
      { label: "1,1,2", search: "1,1,2" },
    ],
  },
  {
    title: "Punish pack",
    notes: "Drill these until each tier is automatic — this is where Kazuya rounds are won.",
    clips: [
      { label: "1,2", search: "1,2" },
      { label: "df+2", search: "df+2" },
      { label: "ws2", search: "ws2" },
      { label: "ws1,2", search: "ws1,2" },
      { label: "uf+4", search: "uf+4" },
    ],
  },
  {
    title: "Devil pack",
    notes: "The heavier routes worth reviewing for wall carry and Heat pressure.",
    clips: [
      { label: "f+1+2", search: "f+1+2" },
      { label: "db+1,2", search: "db+1,2" },
      { label: "b+1+2", search: "b+1+2" },
      { label: "d+1+2", search: "d+1+2" },
    ],
  },
];

const secrets: Secret[] = [
  {
    title: "Plus frames are the real mixup",
    tag: "Core identity",
    copy:
      "A blocked electric leaves Kazuya plus. That is the moment the 50/50 becomes genuinely unfair, because they cannot press and cannot leave. Most players throw the hellsweep at neutral instead, where it is just a gamble.",
    route:
      "Electric on block, then immediately wavedash again. From there, mid or hellsweep with a real read behind it.",
    counter:
      "If they start ducking after the electric, take the standing punish with df+2 or a throw instead.",
    clips: [
      { label: "f,n,d,df+2", search: "f,n,d,df+2" },
      { label: "f,n,d,DF+4", search: "f,n,d,DF+4" },
      { label: "df+1", search: "df+1" },
    ],
  },
  {
    title: "Wavedash back is a defensive tool",
    tag: "Movement secret",
    copy:
      "Everyone drills the forward dash. The retreating version is what makes opponents whiff long strings into your best punish, and it costs nothing when it does not work.",
    route:
      "After a blocked poke, wavedash back once instead of pressing. Punish the swing with electric or df+2.",
    counter:
      "Against patient opponents who do not chase, stop retreating and go back to df+1 pressure.",
    clips: [
      { label: "f,n,d,df+2", search: "f,n,d,df+2" },
      { label: "df+2", search: "df+2" },
      { label: "b+2,4", search: "b+2,4" },
    ],
  },
  {
    title: "The hellsweep is a tax on standing still",
    tag: "Mixup rule",
    copy:
      "It is not a random low. It is the punishment for a specific habit: opponents who freeze in standing block because they are scared of the electric. If they have not frozen yet, the hellsweep is just a free launch for them.",
    route:
      "Count their reactions. Two blocked mids in a row with no press means the low is live. Otherwise keep taking chip.",
    counter:
      "If they start low-parrying or ducking on your dash, switch to electric and throws until they stand again.",
    clips: [
      { label: "f,n,d,DF+4", search: "f,n,d,DF+4" },
      { label: "f,n,d,df+4,4", search: "f,n,d,df+4,4" },
      { label: "df+1", search: "df+1" },
    ],
  },
  {
    title: "Kazuya has no defence button",
    tag: "Weakness",
    copy:
      "No parry, no armour, no long-range reversal. Kazuya only wins the turn back by blocking and stepping, which is exactly what most Kazuya players refuse to do.",
    route:
      "When you are minus, block. When their string ends, punish. That loop alone beats most of the ladder.",
    counter:
      "If they never end their pressure, look for a specific gap and use d+2 or uf+4 as a read — once, not as a habit.",
    clips: [
      { label: "d+2", search: "d+2" },
      { label: "uf+4", search: "uf+4" },
      { label: "ws2", search: "ws2" },
    ],
  },
  {
    title: "Punishes are worth more than the 50/50",
    tag: "Punish secret",
    copy:
      "A Kazuya who launches every -13 wins more rounds than one who lands two extra hellsweeps. The i13 launch punish is the strongest thing on the character sheet and it involves no guessing at all.",
    route:
      "Block the whole string. Identify the ender. Take 1,2, electric, or df+2 by tier and confirm into your full combo.",
    counter:
      "If your electric is unreliable under pressure, use df+2 from -15 and jab punish everything else. Consistency beats optimisation.",
    clips: [
      { label: "1,2", search: "1,2" },
      { label: "df+2", search: "df+2" },
      { label: "ws2", search: "ws2" },
    ],
  },
  {
    title: "Heat turns wall carry into rounds",
    tag: "Heat rule",
    copy:
      "Kazuya combos already carry. In Heat they carry further and cost chip on block, which turns one launch into a full round. Activating on defence throws that away.",
    route:
      "Launch, carry to the wall, then activate to extend and keep the pressure on the wall splat.",
    counter:
      "If they start blocking everything in Heat, use throws and the hellsweep rather than forcing more chip.",
    clips: [
      { label: "f+1+2", search: "f+1+2" },
      { label: "db+1,2", search: "db+1,2" },
      { label: "f,n,d,df+2", search: "f,n,d,df+2" },
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
  "Kazuya (mirror)",
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
      "She wants to fly away and come back with chainsaws. Kazuya wins by refusing to chase and punishing every approach and stance entry with the electric.",
    doThis: [
      "Wavedash back and whiff punish her flight approaches on landing.",
      "Block full chainsaw strings, then take the punish by tier.",
    ],
    dodge: [
      "Sidestep her rocket approach instead of blocking in place.",
      "Backdash after blocked DES sequences rather than pressing into them.",
    ],
    utilise: [
      "Electric whiff punish the moment she reaches with a linear tool.",
      "Hellsweep once she starts standing still to respect the dash.",
    ],
    avoid: [
      "Do not hopkick into her mids while she is plus.",
      "Do not chase her backdash across the screen.",
    ],
  },
  Asuka: {
    briefing:
      "Her parry eats predictable strings and her panic buttons eat lazy pressure. Keep sequences short and let her reversal whiff on nothing.",
    doThis: [
      "Stagger single mids instead of committing to strings.",
      "Throw her when she starts holding for the reversal.",
    ],
    dodge: [
      "Step her linear panic launchers and punish the recovery.",
      "Duck her obvious high enders for a full launch.",
    ],
    utilise: [
      "df+1 into wavedash to reset the threat without committing.",
      "df+2 on every blocked hopkick.",
    ],
    avoid: [
      "Do not autopilot long strings into the parry.",
      "Do not hellsweep when she is already waiting to low parry.",
    ],
  },
  Bryan: {
    briefing:
      "Bryan wants you to swing at kick range and eat a counter hit. Kazuya wins by holding the dash outside his range and punishing snake edge every single time.",
    doThis: [
      "Punish snake edge from crouch with ws2 without exception.",
      "Hold block against his taunt pressure instead of guessing.",
    ],
    dodge: [
      "Sidestep his linear keepout kicks and whiff punish.",
      "Backdash after his blocked mids rather than contesting the frames.",
    ],
    utilise: [
      "Electric whiff punish on his slow committed swings.",
      "Wall carry — he takes far more damage there than at neutral.",
    ],
    avoid: [
      "Do not trade buttons with him; he wins counter-hit exchanges.",
      "Do not press after his blocked strings without checking the gap.",
    ],
  },
  Dragunov: {
    briefing:
      "He has better frames, better lows, and better pressure at neutral. Kazuya wins by punishing his committed lows and taking the launch every time he overreaches.",
    doThis: [
      "Punish his committed low from crouch immediately.",
      "Block Sneak-stance entries and take the free turn.",
    ],
    dodge: [
      "Sidestep his approach rather than backdashing into the wall.",
      "Stay off the wall — his pressure is far worse there.",
    ],
    utilise: [
      "df+2 on every blocked stance launcher.",
      "Electric on his hop mid landings.",
    ],
    avoid: [
      "Do not gamble hellsweep against a player already holding low.",
      "Do not mash out of his plus frames.",
    ],
  },
  Fahkumram: {
    briefing:
      "Long limbs and heavy counter-hit damage. Stay outside his range, make him step forward, and punish the commitment.",
    doThis: [
      "Whiff punish his long pokes with the electric.",
      "Block his stance entries and take the guaranteed punish.",
    ],
    dodge: [
      "Sidestep his linear knees and long-range kicks.",
      "Wavedash back when he starts advancing rather than trading.",
    ],
    utilise: [
      "df+1 to check his approach without committing.",
      "Hellsweep once he starts blocking standing at range.",
    ],
    avoid: [
      "Do not contest his counter-hit buttons.",
      "Do not walk forward into his range with no plan.",
    ],
  },
  Feng: {
    briefing:
      "His back-sway makes committed strings whiff and his kenpo mix punishes impatience. Keep sequences short and make him press first.",
    doThis: [
      "Use single mids so his sway has nothing to evade.",
      "Punish his blocked shoulder and sweep every time.",
    ],
    dodge: [
      "Step his linear power mids instead of blocking in place.",
      "Backdash out of kenpo range when you are minus.",
    ],
    utilise: [
      "Electric on his whiffed sway recovery.",
      "Throws once he starts holding low for the kenpo mix.",
    ],
    avoid: [
      "Do not throw long strings into back-sway.",
      "Do not hellsweep against a player already crouch-blocking.",
    ],
  },
  Hwoarang: {
    briefing:
      "Stance flow and endless kicks. Kazuya wins by blocking properly, punishing the enders, and refusing to guess mid-string.",
    doThis: [
      "Block whole flamingo sequences before pressing anything.",
      "Punish every blocked stance ender by tier.",
    ],
    dodge: [
      "Sidestep into his back once he commits to a stance.",
      "Duck his high enders and launch on reaction.",
    ],
    utilise: [
      "ws2 after blocking his lows.",
      "Wavedash back to make his approach whiff entirely.",
    ],
    avoid: [
      "Do not mash between his stance hits.",
      "Do not hopkick into his mid flow.",
    ],
  },
  "Kazuya (mirror)": {
    briefing:
      "Whoever drops fewer punishes wins. The mirror is a discipline test, not a mixup contest — both of you launch from -13.",
    doThis: [
      "Punish every hellsweep from crouch without hesitation.",
      "Take the i13 launch punish every time he is minus.",
    ],
    dodge: [
      "Wavedash back to bait his electric whiff.",
      "Sidestep his linear dash approach rather than blocking still.",
    ],
    utilise: [
      "Patience — the first player to gamble the low loses the round.",
      "Wall carry, because the mirror ends fast at the wall.",
    ],
    avoid: [
      "Do not fish electrics at neutral against another Kazuya.",
      "Do not hellsweep first; let him do it and punish.",
    ],
  },
  King: {
    briefing:
      "Grabs, chain throws, and heavy wall damage. Kazuya wins at range where the grab game does not exist.",
    doThis: [
      "Break throws on reaction rather than pre-guessing.",
      "Keep the fight at electric range instead of grab range.",
    ],
    dodge: [
      "Step his running approaches and punish the recovery.",
      "Stay away from the wall where his damage doubles.",
    ],
    utilise: [
      "Punish his committed lows from crouch every time.",
      "Electric whiff punish his big committed swings.",
    ],
    avoid: [
      "Do not stand next to him with no plan.",
      "Do not hopkick into his armour and grab reads.",
    ],
  },
  Law: {
    briefing:
      "Fast, high-reward, and hugely unsafe if you block. Kazuya beats him by simply not pressing during his flowchart.",
    doThis: [
      "Block his full strings and punish the enders by tier.",
      "Take the crouch punish on his committed lows.",
    ],
    dodge: [
      "Step his linear dragon charge approaches.",
      "Duck the high enders he leans on and launch.",
    ],
    utilise: [
      "df+2 on his blocked launchers.",
      "Hellsweep once he starts blocking rather than mashing.",
    ],
    avoid: [
      "Do not contest his fast counter-hit buttons.",
      "Do not press between his string hits.",
    ],
  },
  Leroy: {
    briefing:
      "Parries and stance make greedy pressure expensive. Play short sequences and make him commit first.",
    doThis: [
      "Throw single mids and reset the dash instead of stringing.",
      "Punish blocked stance entries hard.",
    ],
    dodge: [
      "Sidestep his linear cane pokes.",
      "Backdash when he holds parry timing.",
    ],
    utilise: [
      "Throws once he starts holding for the parry.",
      "Electric whiff punish when his stance option misses.",
    ],
    avoid: [
      "Do not autopilot strings into his parry.",
      "Do not hellsweep against a player already looking for low parry.",
    ],
  },
  Lili: {
    briefing:
      "Evasive movement and long punish reach. Keep your own commitments short and make her land before you press.",
    doThis: [
      "Punish her blocked acrobatic mids on landing.",
      "Keep strings short so her evasion has nothing to duck.",
    ],
    dodge: [
      "Step her linear approaches instead of blocking still.",
      "Backdash her long-range lows and punish from crouch.",
    ],
    utilise: [
      "Electric on her whiffed evasive tools.",
      "df+1 to check her when she starts creeping in.",
    ],
    avoid: [
      "Do not throw slow committed mids into her sidestep.",
      "Do not chase her backdash with the wavedash.",
    ],
  },
  Nina: {
    briefing:
      "Fast frames, strong lows, and heavy throw pressure. Kazuya wins by punishing the lows and refusing to mash in her blockstrings.",
    doThis: [
      "Punish her committed lows from crouch every time.",
      "Block her full sequences before taking a turn.",
    ],
    dodge: [
      "Step her linear pokes and whiff punish.",
      "Break her throws instead of pre-emptively ducking.",
    ],
    utilise: [
      "The electric on her whiffed pokes — she reaches often.",
      "Hellsweep once she starts blocking standing.",
    ],
    avoid: [
      "Do not mash between her jabs.",
      "Do not hopkick into her mid checks.",
    ],
  },
  Paul: {
    briefing:
      "One read and he takes half your health. Kazuya wins by blocking the deathfist and punishing it, which is entirely free.",
    doThis: [
      "Punish blocked deathfist with a full launch, every time.",
      "Take the crouch punish on his demo man low.",
    ],
    dodge: [
      "Sidestep his linear power mids.",
      "Backdash out of his counter-hit range instead of trading.",
    ],
    utilise: [
      "df+2 on his committed swings.",
      "Patience — his damage only lands if you press first.",
    ],
    avoid: [
      "Do not trade buttons with him at close range.",
      "Do not gamble hellsweep when he is waiting to low parry.",
    ],
  },
  Steve: {
    briefing:
      "Weaves, flickers, and no kicks to fear at low. He beats impatience, so make him commit and punish the recovery.",
    doThis: [
      "Keep strings short so his weave evasion has nothing to slip.",
      "Punish blocked flicker sequences by tier.",
    ],
    dodge: [
      "Step his linear punches rather than blocking still.",
      "Backdash out of his weave range when you are minus.",
    ],
    utilise: [
      "Electric on his whiffed evasive entries.",
      "Lows — his low defence is the weak point.",
    ],
    avoid: [
      "Do not throw long high strings into his ducking stances.",
      "Do not press during his plus-frame flicker pressure.",
    ],
  },
  Xiaoyu: {
    briefing:
      "AOP ducks your highs and her stances evade linear mids. This is the matchup where discipline matters more than damage.",
    doThis: [
      "Use mids only — highs are a free launch for her.",
      "Punish every blocked stance transition.",
    ],
    dodge: [
      "Step her Rain Dance mix instead of guessing.",
      "Backdash out of AOP range rather than pressing into it.",
    ],
    utilise: [
      "df+1 and df+2 which beat her low-profile stances.",
      "Throws when she starts holding stance forever.",
    ],
    avoid: [
      "Do not throw highs at any point in this matchup.",
      "Do not chase her spin — let her come back to you.",
    ],
  },
  Zafina: {
    briefing:
      "Three stances, evasive low profiles, and unsafe stance exits. Block the stance, punish the exit, and use mids only.",
    doThis: [
      "Punish blocked stance moves rather than respecting them.",
      "Stick to mids that beat her low-profile entries.",
    ],
    dodge: [
      "Step her linear stance approaches.",
      "Backdash her long-range lows and punish from crouch.",
    ],
    utilise: [
      "Electric whiff punish when a stance option misses entirely.",
      "df+1 to check her when she stands still.",
    ],
    avoid: [
      "Do not throw highs into Mantis or Scarecrow.",
      "Do not hopkick into her stance mids.",
    ],
  },
};

const defaultMatchups: Record<(typeof matchupNames)[number], Matchup> =
  Object.fromEntries(
    matchupNames.map((name) => [
      name,
      {
        name,
        briefing: `${name} is a loading-screen fundamentals check for Kazuya: hold the wavedash, punish everything they leave minus, and only sell the hellsweep once they stop pressing.`,
        doThis: [
          "Take every block punish by tier before gambling on the low.",
          "Use df+1 and b+2,4 to hold space between electrics.",
        ],
        dodge: [
          "Wavedash back to make their committed strings whiff.",
          "Sidestep linear approaches instead of blocking in place.",
        ],
        utilise: [
          "Electric whiff punishes the moment they overreach.",
          "The hellsweep once standing block becomes their habit.",
        ],
        avoid: [
          "Do not throw raw hellsweeps at neutral.",
          "Do not mash electric out of blockstun — Kazuya has no defence button.",
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
  return `https://okizeme.gg/database/kazuya?search=${encodeURIComponent(search)}`;
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
          ? "border-violet-300 bg-violet-300 text-slate-950 shadow-lg shadow-violet-950/20"
          : "border-violet-400/35 bg-violet-400/5 text-violet-700 hover:border-violet-300 hover:bg-violet-400/10 hover:text-slate-950"
      }`}
    >
      <ClipButtonLabel label={clip.label} accent="violet" active={isActive} />
    </button>
  );
}

export function KazuyaGuide() {
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
        return "Daily reps for the wavedash, electric punishes, hellsweep discipline, and defence.";
      case "gameplan":
        return "A short round map: hold the dash, punish everything, then sell the low.";
      case "toolkit":
        return "The moves worth recognising fast, with a clean reminder of value and risk.";
      case "clips":
        return "Visual packs for wavedash tools, honest pokes, punishes, and Devil routes.";
      case "secrets":
        return "The habits that make Kazuya unfair, presented as short study cards.";
      case "matchups":
        return "Pick a character for a quick loading-screen plan and fast action cards.";
      default:
        return "";
    }
  }, [activeTab]);

  return (
    <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-xl shadow-slate-300/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
          Tekken 8
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:mt-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Kazuya Devil Lab
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Kazuya wins when the wavedash is clean and no punish is ever
              dropped. This guide leans on visual move chips, shorter drill
              cards, and live clips instead of long notes.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-400/25 bg-violet-400/10 px-4 py-3 text-sm text-violet-700">
            Focus: wavedash, electrics, hellsweep discipline, punishment
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
                    ? "border-violet-300/70 bg-violet-300 text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-violet-300/40 hover:bg-white hover:text-slate-950"
                }`}
              >
                <span className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <GuideTabGlyph tabId={tab.id} accent="violet" active={isActive} />
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
            title="Daily Kazuya drills"
            copy="Run these as isolated reps. Each card focuses on one dash, punish, or discipline idea so the clips can do the teaching."
            accent="violet"
          />
          <GuideClipSection
            accent="violet"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                    Drill board
                  </p>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {drill.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {drill.summary}
                  </p>
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
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
            title="How Kazuya should feel"
            copy="The dash should do the threatening. Once they freeze for the electric, the low finally becomes worth its risk."
            accent="violet"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {gameplan.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 sm:p-6"
              >
                <StepBadge step={index + 1} accent="violet" />
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
            accent="violet"
          />
          <GuideClipSection
            accent="violet"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                    {tool.role}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MoveNotation notation={tool.move} accent="violet" size="lg" />
                    <ClipButton
                      clip={tool.clip}
                      clipKey={`toolkit-${tool.move}-${tool.clip.search}`}
                      activeClipKey={activeClipKey}
                      onPlay={playClip}
                    />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
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
            title="Embedded Kazuya clip packs"
            copy="Use these as quick visual presets for the moves you should actually be drilling."
            accent="violet"
          />
          <GuideClipSection
            accent="violet"
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
            title="The things that make Kazuya unfair"
            copy="The character becomes much scarier when you can see the dash pressure, punish tiers, and Heat routes at a glance."
            accent="violet"
          />
          <GuideClipSection
            accent="violet"
            characterSlug={OKIZEME_CHARACTER}
            activeClip={activeClip}
            onDismiss={() => setActiveClip(null)}
            getHref={getClipDatabaseUrl}
            contentClassName="lg:grid-cols-2"
          >
              {secrets.map((secret) => (
                <article
                  key={secret.title}
                  className="rounded-3xl border border-violet-400/15 bg-white/80 p-4 sm:p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                    {secret.tag}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    {secret.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {secret.copy}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-3 sm:p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
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
            copy="Tap a character for a fast Kazuya-specific plan with action cards you can scan between rounds."
            accent="violet"
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
                      ? "border-violet-300 bg-violet-300 text-slate-950"
                      : "border-slate-200 bg-white/80 text-slate-600 hover:border-violet-300/60 hover:text-slate-950"
                  }`}
                >
                  {matchup.name}
                </button>
              );
            })}
          </div>

          {activeMatchup ? (
            <GuideClipSection
              accent="violet"
              characterSlug={OKIZEME_CHARACTER}
              activeClip={activeClip}
              onDismiss={() => setActiveClip(null)}
              getHref={getClipDatabaseUrl}
              contentClassName="grid-cols-1"
            >
              <article className="rounded-3xl border border-violet-300/20 bg-white/85 p-4 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
                  Kazuya vs {activeMatchup.name}
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
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
                    ["Do this", activeMatchup.doThis, "text-violet-600"],
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
                  characterId="kazuya"
                  opponentName={activeMatchup.name}
                  accent="violet"
                  onPlayClip={playClip}
                  activeClipKey={activeClipKey}
                />

                <MatchupBeatAdviceSection
                  characterId="kazuya"
                  opponentName={activeMatchup.name}
                  accent="violet"
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

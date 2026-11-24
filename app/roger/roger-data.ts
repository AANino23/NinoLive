import moveRows from "./roger-moves.json" with { type: "json" };

export const ROGER_CHECKED = "24 November 2026";
export const ROGER_SOURCES = [
  { title: "Official developer introduction", href: "https://www.tekken-official.jp/tekken_news/?lang=en&p=3712", detail: "Character identity and stance design." },
  { title: "Official starter video", href: "https://www.youtube.com/watch?v=1HsRz8zm4-Q", detail: "Bandai Namco’s introduction to playing Roger Jr." },
  { title: "Current move records", href: "https://okizeme.gg/database/roger-jr", detail: "Commands, startup, block frames, hit properties and individual clips." },
  { title: "Wavu character reference", href: "https://wavu.wiki/t/Roger_Jr.", detail: "Launcher conditions, stance names and key properties." },
  { title: "Wavu combo reference", href: "https://wavu.wiki/t/Roger_Jr._combos", detail: "Source-listed routes; RS in this reference means Rocket Stance, shown here as ROC." },
];
export const ROGER_MOVES = moveRows;
export function rogerMove(command: string) {
  const row = moveRows.find(row => row.command === command);
  if (!row) throw new Error(`Missing Roger move record: ${command}`);
  return row;
}

export const ROGER_TOOLS = [
  { move: "1", role: "Start here", use: "A small commitment to test whether they respect you. +1 on block gives a slight advantage, not an uninterruptible string.", risk: "High: ducking and evasive reads can beat it." },
  { move: "2,1", role: "Punishment", use: "Your i10 natural hit punish. Hit puts you in Rocket at +9; hold B to cancel and remain standing at +6.", risk: "Do not confuse the +9 on hit with its -1 on block. A blocked entry is a defensive decision." },
  { move: "3", role: "Poking", use: "i13 mid check. A compact way to contest crouching opponents without spending a launcher.", risk: "-6 on block: stop pressing automatically." },
  { move: "df+1", role: "Poking", use: "Mid check at i14–15, -1 on block. Use one poke, then observe their reply.", risk: "The df+1,2 extension ends at -10. The first hit’s safety does not carry over." },
  { move: "df+1,2", role: "Punishment", use: "Natural mid-mid string. Useful to recognise and punish in the mirror.", risk: "-10 on block. Finishing every df+1 is an easy habit to punish." },
  { move: "d+2", role: "Poking", use: "i18 low that leaves +1 on hit. Take a little damage without building the round around risky sweep guesses.", risk: "-12 on block. It is not a free approach tool." },
  { move: "d+3", role: "Poking", use: "i16 high-crushing low. A different timing from d+2, with a stronger counter-hit reaction.", risk: "-1 on normal hit and -14 on block: normal hit does not buy another turn." },
  { move: "b+1+2", role: "Pressure", use: "i15 mid, +1 on block and forces crouch. A modest frame advantage with a different response tree from jab pressure.", risk: "Do not turn +1 into a claim that slow stance entries cannot be interrupted." },
  { move: "f+2", role: "Pressure", use: "i13 high with +3 on block; wall splat is a situational punishment reward. In Heat it gains string choices.", risk: "High. Compare wall reward with the reliable 2,1 punish instead of treating it as universally better." },
  { move: "b+2,4", role: "Punishment", use: "i14 natural mid-mid Heat engager. A clear step up from the i10 punish when the block window and range fit.", risk: "-13 on block when thrown out as offense." },
  { move: "uf+4", role: "Launcher", use: "i15–16 normal-hit hopkick launch. This is the default standing launch punish in the ladder.", risk: "-13 on block. The jump is not protection from all attacks." },
  { move: "df+2", role: "Launcher", use: "i15 mid that launches on COUNTER HIT. Normal hit gives +9 Rocket entry.", risk: "Safe at -7 on block, but it is not a normal-hit launch punish. Read the hit condition." },
  { move: "f,F+2", role: "Approach", use: "Forward-forward mid Heat engager. Use after confirming a whiff or entering behind movement; the dash adds execution time to i15 move startup.", risk: "-9 on block. Do not promise a frame-perfect i15 block punish with a dash input." },
  { move: "f,f,F+3", role: "Approach", use: "Running mid with +6 on block. A way to enter pressure after earning the space to run.", risk: "Large approach commitment; practise against sidestep instead of assuming plus means tracking." },
  { move: "uf+2", role: "Pressure", use: "Low-crushing mid with +5 on block. Establish it when the opponent gives you time to use an i21–22 attack.", risk: "Slower than your small checks; +5 does not remove their movement options." },
  { move: "df+3", role: "Movement", use: "Homing mid at i19–20. Use when you have a reason to expect lateral movement.", risk: "-8 on block. Tracking does not make it your turn afterward." },
  { move: "uf+1", role: "Movement", use: "i17 homing high. An alternative tracking check when its high hit level fits the situation.", risk: "Can be ducked; uf+1,2 has a different risk from the single hit." },
  { move: "db+3,3", role: "Stance entry", use: "Natural low-mid string into Rocket on hit. The second hit and transition are the commitment you must recognise.", risk: "-16 on block. This is not interchangeable with the safer d+2 low poke." },
  { move: "db+1+2", role: "Defense", use: "Power-crush mid and Tornado move. A situational answer when you have a read on an incoming attack.", risk: "-13 on block. Armour is not a throw/low-proof escape." },
  { move: "b+3+4", role: "Stance entry", use: "Leaping mid into Astronauts, +5 AST on block and +13g AST on hit. Learn the block and hit branches separately.", risk: "i25–35 commitment. Do not replace neutral with repeated leap-ins." },
  { move: "ub+3", role: "Stance entry", use: "Low-crushing mid that leaves you back turned, -4 BT on block and +8 BT on hit.", risk: "Back-turned defense differs from standing. Know how you exit before entering." },
  { move: "f+4", role: "Stance entry", use: "i16–17 mid into back turn. A compact entry to study after Rocket fundamentals.", risk: "-2 BT on block and -1 BT on hit: entry alone does not mean advantage." },
  { move: "ws4", role: "Punishment", use: "i11–12 mid from crouch. Your baseline after small unsafe lows.", risk: "Keep using this at -12/-13 rather than inventing a faster ws2." },
  { move: "ws2,1", role: "Punishment", use: "i14 natural mid-high string with a wall-splat role.", risk: "Choose only when the punish is guaranteed; the high finish is a separate offensive risk." },
  { move: "ws1", role: "Launcher", use: "i15–16 Tornado launcher from crouch. It spends Tornado immediately, so use the appropriate continuation.", risk: "-16 on block. Normal-launch and Tornado-launch combo routes are different." },
];

export const ROGER_STANCES = [
  { code: "ROC", title: "Rocket Stance", entry: "Manual b+3; also hit transitions such as 2,1 and normal-hit df+2.", rule: "Enter after a confirmed hit first. A +9 hit entry and a -1 blocked entry cannot use the same timing chart.", choices: [
    { move: "ROC.2", use: "i15 high, +3 on block. Pressure option once the opponent respects the stance.", risk: "High: loses to a duck read." },
    { move: "ROC.3", use: "i18 low, +6 on hit.", risk: "-11 on block. A low choice, not a guaranteed follow-up from every entry." },
    { move: "ROC.4,3", use: "i17–18 mid-mid natural string and Heat engager.", risk: "-13 on block; the single ROC.4 is only -5." },
    { move: "ROC.1", use: "Slower i28–29 mid, +7 on block and a launch reaction on hit.", risk: "The reward is not permission to ignore its startup gap." },
    { move: "ROC.3+4", use: "i14–15 safe mid ender, -9 on block.", risk: "Safe on block still ends your turn." },
    { move: "ROC.1+2,1+2", use: "Tornado combo tool used in the source-listed air routes.", risk: "-19 on block. Keep the juggle route separate from neutral pressure." },
  ] },
  { code: "AST", title: "Astronauts", entry: "f+1+3 throw, b+3+4, Heat Smash on block and listed hit transitions.", rule: "This stance contains mids, a homing high and an unbreakable throw. It is a decision tree, not one guaranteed sequence.", choices: [
    { move: "AST.1", use: "i18–19 mid Heat engager.", risk: "-5 on block; accept that the opponent can act afterward." },
    { move: "AST.3", use: "i21 mid with +3 on block.", risk: "Choose it against ducking/throw defense; test entry-specific interrupts." },
    { move: "AST.4", use: "i20–21 homing high, +4 on block.", risk: "A duck read still beats a homing high." },
    { move: "AST.3+4", use: "i22–23 unbreakable stance throw.", risk: "Unbreakable does not mean unavoidable. Test ducking and movement against the entry." },
  ] },
  { code: "BOB", title: "Bobbin Dance · Heat only", entry: "H.f+3+4, H.d+3+4, or blocked H.f+2,1,2.", rule: "BOB is a Heat stance code, not the opponent Bob. Practise how each entry changes the opponent’s available answers.", choices: [
    { move: "BOB.1", use: "i13 unblockable high.", risk: "Unblockable high is still high: do not describe it as a guaranteed hit." },
    { move: "BOB.2", use: "i17–18 mid Tornado launcher, 0 on block.", risk: "Neutral on block is a reset, not continuing frame advantage." },
  ] },
  { code: "BT", title: "Back turned", entry: "f+4, ub+3, or B transitions from d+1+2 strings.", rule: "Use the entry’s hit/block state. Being back turned carries defensive restrictions, so learn one option and an exit before expanding.", choices: [
    { move: "BT.1", use: "i8 high check from back turn.", risk: "-3 on block and can be ducked." },
    { move: "BT.4", use: "i17–18 low, +7c BT on hit.", risk: "You remain back turned; it is -8 BT on block." },
    { move: "BT.3+4", use: "i14–15 mid Tornado launcher.", risk: "-13 on block. Reserve the launch commitment for a read." },
    { move: "BT.3", use: "Slower mid with +5c BT on block.", risk: "Do not confuse its i22–23 startup with the faster launcher." },
  ] },
];

const comboSource = "https://wavu.wiki/t/Roger_Jr._combos";
export const ROGER_COMBOS = [
  { title: "Regular airborne launch", kind: "Launch", starter: "Normal-hit uf+4 is your standing launch-punish starter. This is the reference’s regular-launch category.", moves: ["4", "df+4,3", "df+2", "ROC.1+2,1+2", "uf+3", "f,F+2"], cue: "Tornado occurs at ROC.1+2,1+2. Add the source’s optional dash before uf+3 when spacing requires it. Do not expect normal-hit df+2 alone to launch.", source: comboSource },
  { title: "Tornado already used", kind: "Launch", starter: "Opponent is airborne and Tornado has already been spent. The source gives SS+4 as its example, but that starter conflicts with the current move record; use this as a state reference, not a verified ws1 conversion.", moves: ["uf+3", "df+4", "df+2", "ROC.1+2,1+2"], cue: "No second Tornado is available. Confirm pickup height and range in practice for your exact starter.", source: comboSource },
  { title: "Counter-hit string conversion", kind: "Short", starter: "Only the final 1 of (1,2),1 counter-hits; the first two hits are setup notation.", moves: ["f,n,d,df+1"], cue: "Source lists Nature Step 1 after this specific counter hit. This is not a guaranteed route from normal-hit 1,2,1.", source: comboSource },
  { title: "CH f+3 → short follow-up", kind: "Short", starter: "f+3 counter hit, outside Heat.", moves: ["f+2"], cue: "Recognise the counter-hit state before committing. Test reach; do not transfer this to normal hit.", source: comboSource },
  { title: "CH f+3 → engage Heat", kind: "Heat", starter: "f+3 counter hit with Heat engagement available.", moves: ["b+2,4"], cue: "The source lists the Heat-engaging follow-up. Keep it separate from the Heat-active string below.", source: comboSource },
  { title: "CH f+3 → Heat string", kind: "Heat", starter: "f+3 counter hit while Heat is already active.", moves: ["H.f+2,1,2"], cue: "Requires the Heat version. Ending on block enters BOB; that block branch is a mixup, not combo damage.", source: comboSource },
  { title: "Wall carry → delayed finish", kind: "Wall", starter: "The source’s regular-carry wall state (24% scaling), aligned and within reach.", moves: ["2", "b+2,1,1+2"], cue: "Delay the final 1+2 of b+2,1,1+2. Wall height matters; this is not a clean-splat or arbitrary wall-break guarantee.", source: comboSource },
  { title: "Wall carry → Rocket ender", kind: "Wall", starter: "Same regular-carry wall state in the source.", moves: ["2,1", "ROC.3+4"], cue: "Use the Rocket transition after 2,1. Check wall height before choosing this alternative.", source: comboSource },
];

export const ROGER_THROWS = [
  { move: "1+3", break: "1 or 2", use: "Generic throw; the source lists a floor break." },
  { move: "2+4", break: "1 or 2", use: "Generic throw with the other animation. Do not teach it as a command throw with a fixed 2 break." },
  { move: "f+1+4", break: "1", use: "Command throw. A practical first distinct break to train." },
  { move: "f+2+3", break: "2", use: "Command throw with floor-break property." },
  { move: "uf+1+2", break: "1+2", use: "i12 command throw with floor break. Do not confuse this with the mid u+1+2." },
  { move: "f,b,db,d,df,F+1", break: "1", use: "Motion-input command throw. Train clean execution before trying it under pressure." },
  { move: "f,b,db,d,df,F+2", break: "2", use: "Motion-input command throw with floor break." },
  { move: "f+1+3", break: "Unbreakable", use: "Stance-entry throw leading to +13 AST. Unbreakable does not remove pre-throw counterplay." },
  { move: "AST.3+4", break: "Unbreakable", use: "Astronauts throw. The stance entry is part of the opponent’s chance to respond." },
];

export const ROGER_HEAT = [
  { move: "H.f+2,1,2", use: "High string: +10 BOB on block. Compare it with the mid-ending H.f+2,1,df+2 instead of calling the two endings a guaranteed sequence." },
  { move: "H.f+2,1,df+2", use: "Mid finish at -9 on block with Tornado property. It changes the ducking decision after the high opening, not whether the opening can be ducked." },
  { move: "H.f+3+4", use: "i15–40 power crush with Tornado; 0 BOB on block. The listed armour begins at frame 6, not frame 1." },
  { move: "H.d+3+4", use: "i20–21 low, -14 on block and +10 BOB on hit. The BOB entry is the hit reward; a blocked low does not give that advantage." },
  { move: "H.2+3", use: "Mid Heat Smash at i18–33; +13 AST on block with floor break. Train the resulting stance choices against multiple recorded defenses." },
];

export const ROGER_DRILLS = [
  { title: "A small neutral game", minutes: "4 min", task: "Play only 1, df+1, d+2, movement and block. After each poke, name whether you are plus, minus or merely safe.", pass: "Ten exchanges without adding a panic launcher.", moves: ["1", "df+1", "d+2"] },
  { title: "Punish without guessing", minutes: "5 min", task: "Set block punishment windows to -10, -14 and -15. Rotate 2,1, b+2,4 and uf+4; confirm range before increasing speed.", pass: "Ten correct punishes per window, then randomise the recordings.", moves: ["2,1", "b+2,4", "uf+4"] },
  { title: "The crouching gap", minutes: "4 min", task: "After blocking lows at -11, -12 and -13, keep ws4. Switch to ws2,1 at -14 and ws1 at -15.", pass: "No standing launcher after a blocked low and no ws2 at -13.", moves: ["ws4", "ws2,1", "ws1"] },
  { title: "Rocket hit versus block", minutes: "5 min", task: "Alternate dummy guard and normal hit on 2,1. On hit explore ROC.2/ROC.3/ROC.4,3; on block test defending or cancelling instead of insisting on the same sequence.", pass: "Say 'hit +9 ROC' or 'block -1' correctly before choosing.", moves: ["2,1", "ROC.2", "ROC.3", "ROC.4,3"] },
  { title: "Earn the running entry", minutes: "4 min", task: "Record the opponent checking, stepping and waiting at range. Approach behind block; use f,f,F+3 only after observing the space they give you.", pass: "Recognise all three responses without repeating the run-in automatically.", moves: ["f,f,F+3", "df+3"] },
  { title: "Astronauts answers", minutes: "5 min", task: "After b+3+4 on block, record jab, stand guard, duck and sidestep-duck. Test each AST option against every recording. Write down losses as well as wins.", pass: "One tested answer per defense, without claiming any option beats all four.", moves: ["b+3+4", "AST.1", "AST.3", "AST.4", "AST.3+4"] },
  { title: "Throw breaks and throw choice", minutes: "5 min", task: "Randomise the 1, 2 and 1+2 command throws in the mirror. First train the defender’s break, then practise choosing a throw when the opponent freezes.", pass: "Ten correct breaks of each type before adding movement.", moves: ["f+1+4", "f+2+3", "uf+1+2"] },
  { title: "Counter hit is a condition", minutes: "4 min", task: "Toggle counter hit off/on for df+2. Normal hit is a Rocket entry; counter hit launches. Practise switching decisions on recognition.", pass: "Never start the air combo after an ordinary df+2 hit.", moves: ["df+2"] },
  { title: "One wall finish", minutes: "5 min", task: "Practise one regular-carry wall ender at close, medium and slightly off-axis wall contact. Note when the final hit drops rather than extending the notation by guesswork.", pass: "Ten clean finishes at the tested height, then a clear list of failures.", moves: ["2,1", "ROC.3+4"] },
  { title: "Heat is a new decision tree", minutes: "5 min", task: "Block the Heat high string and the mid-ending variation, then test the BOB high/mid choices. Repeat after Heat Smash into AST.", pass: "Explain which branch is combo, block pressure or a duckable high.", moves: ["H.f+2,1,2", "H.f+2,1,df+2", "BOB.1", "BOB.2", "H.2+3"] },
];

export const ROGER_MATCHUP_FOCUS: Record<string, string> = {
  Bob: "Punish blocked df+1,2 with 2,1. Use ws4 against -12 db+3/db+4; reserve ws1 for the stagger crouch-dash low (-28). Bob’s df+2 is safe: do not confuse it with an unsafe uppercut.",
  "Roger Jr.": "In the mirror, block uf+4 or 3,4 for an i13 window: 2,1 remains your reliable standing choice. Launch blocked db+4 with uf+4; launch the blocked db+3 low with ws1. Respect b+1+2 on block.",
  Feng: "Do not feed back-sway with a long committed string. Check with single mids, use df+3 when you have a sidestep read, and confirm the whiff before spending uf+4. Use the sourced punish chart for the blocked move.",
  King: "Separate the throw-break practice from movement practice. Keep short mids and a clear escape route; do not duck every approach and give away a launcher.",
  Steve: "Do not contest repeated close-range exchanges by habit. Give his counter-hit fishing room to miss, and check with mids rather than a long high string.",
  Xiaoyu: "Use a mid you have tested against her exact stance and axis. Homing is not a promise that an attack hits low-profile postures; record the interaction before relying on it.",
  Yoshimitsu: "Leave space for the defensive response after your plus-on-block move. Bait the interrupt rather than completing a slow stance choice on autopilot.",
  Dragunov: "Avoid trying to win every plus-frame exchange immediately. Block the approach, identify the follow-up, then punish the unsafe low or string instead of treating all forward pressure as punishable.",
};

/** The full searchable movelist includes transitions with no video; only teaching
 * commands get a play button, and every one is checked by audit:clips. */
export const ROGER_CLIP_COMMANDS = [...new Set([
  ...ROGER_TOOLS.map(x => x.move), ...ROGER_STANCES.flatMap(x => x.choices.map(y => y.move)),
  ...ROGER_COMBOS.flatMap(x => x.moves), ...ROGER_THROWS.map(x => x.move),
  ...ROGER_HEAT.map(x => x.move), ...ROGER_DRILLS.flatMap(x => x.moves),
])];

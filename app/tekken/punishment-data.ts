export type GuideCharacterId =
  | "steve"
  | "feng"
  | "ling"
  | "dragunov"
  | "fahkumram";

export type PunishTier = {
  frames: string;
  move: string;
  /** True when this punish gives a full combo launch — the max-reward option at its tier. */
  launch?: boolean;
  note?: string;
};

export type OpponentPunishableMove = {
  move: string;
  /** Frames of disadvantage on block, stored as a positive magnitude (12 means -12). */
  minus: number;
  /**
   * True when blocking the move leaves you crouching — lows, plus the mids Wavu marks
   * with a "c" on their block frames. Those have to be punished while standing, so the
   * recommendation comes from the crouch ladder instead of the standing one.
   */
  crouching?: boolean;
  note: string;
};

export type CharacterPunishProfile = {
  displayName: string;
  /** Punishes from a standing block. */
  ladder: PunishTier[];
  /** Punishes after blocking a low, i.e. from crouch. */
  crouchLadder: PunishTier[];
  whiffPunish: string;
};

export const CHARACTER_PROFILES: Record<GuideCharacterId, CharacterPunishProfile> = {
  steve: {
    displayName: "Steve",
    whiffPunish: "u+2 / qcf+1",
    ladder: [
      { frames: "i10", move: "1,2", note: "Fastest block punish." },
      { frames: "i13", move: "b+1", note: "i13 high. Keeps your turn, no reward beyond frames." },
      {
        frames: "i14",
        move: "1+2",
        note: "Sonic Fang. Small float for a mini-combo — better reward than b+1 from -14.",
      },
      {
        frames: "i17",
        move: "u+2",
        launch: true,
        note: "Dreadnought Uppercut. Steve's real launch punish; take it from -17 up.",
      },
    ],
    crouchLadder: [
      { frames: "i11", move: "ws1", note: "Fastest option after blocking a low." },
      { frames: "i13", move: "ws2", note: "Slightly more damage than ws1 from -13." },
      {
        frames: "i16",
        move: "FC.df+2",
        launch: true,
        note: "Finishing Blow out of full crouch — full combo on any low that is -16 or worse.",
      },
    ],
  },
  feng: {
    displayName: "Feng Wei",
    whiffPunish: "uf+4 / df+3",
    ladder: [
      { frames: "i10", move: "1,2", note: "Jab punish. No launch." },
      {
        frames: "i13",
        move: "b+1+2",
        launch: true,
        note: "Iron Fortress. Feng launches from -13 — never settle for a jab here.",
      },
      { frames: "i15", move: "uf+4", launch: true, note: "Soaring Eagle. Bigger launch than b+1+2." },
      {
        frames: "i18",
        move: "df+3",
        launch: true,
        note: "Lift Kick. Highest-damage launcher; only guaranteed from -18.",
      },
    ],
    crouchLadder: [
      { frames: "i11", move: "ws4", note: "Fastest while-standing option." },
      { frames: "i13", move: "ws1", note: "Mid check from crouch, no launch." },
      { frames: "i15", move: "ws3", launch: true, note: "Bow Kick. Launches any low that is -15 or worse." },
    ],
  },
  ling: {
    displayName: "Ling Xiaoyu",
    whiffPunish: "3 / b+1+2",
    ladder: [
      { frames: "i10", move: "1,2", note: "Jab punish into stance routes. No launch." },
      { frames: "i12", move: "f+1+2", note: "Clouded Peak. Knockdown and oki from -12." },
      {
        frames: "i14",
        move: "3",
        launch: true,
        note: "Cloud Kick. High, but they are in blockstun — free launch from -14.",
      },
      {
        frames: "i15",
        move: "b+1+2",
        launch: true,
        note: "Cross Lifting Palms. Mid launcher with more damage than 3.",
      },
    ],
    crouchLadder: [
      {
        frames: "i11",
        move: "ws4",
        launch: true,
        note: "Skyscraper Kick. i11 and it launches — Xiaoyu punishes lows harder than almost anyone.",
      },
    ],
  },
  dragunov: {
    displayName: "Dragunov",
    whiffPunish: "df+2 / f,F+2",
    ladder: [
      { frames: "i10", move: "1,2", note: "Jab punish. No launch." },
      { frames: "i13", move: "df+1,4", note: "Switchblade Ripper. Small float and wall carry from -13." },
      {
        frames: "i15",
        move: "df+2",
        launch: true,
        note: "Scimitar. Full launch — this is the -15 punish, not b+4,3.",
      },
    ],
    crouchLadder: [
      { frames: "i11", move: "ws4", note: "Gelid Smash. Fastest option out of crouch." },
      { frames: "i12", move: "ws1+2", note: "Frost Tackle. Mini-launch from -12, but -14 if you are wrong." },
      { frames: "i15", move: "ws2", launch: true, note: "Ballistic Upper. Same combo as df+2, from crouch." },
    ],
  },
  fahkumram: {
    displayName: "Fahkumram",
    whiffPunish: "b,f+4 / uf+4",
    ladder: [
      { frames: "i10", move: "1,2", note: "Jab punish from limb range." },
      { frames: "i14", move: "b+1", note: "Surging Elbow. Knockdown into a mini-combo — no launch." },
      {
        frames: "i18",
        move: "b,f+4",
        launch: true,
        note: "Lashing Squall. High, but guaranteed in blockstun — full launch from -18.",
      },
      {
        frames: "i20",
        move: "uf+4",
        launch: true,
        note: "Tyrant Teep. Biggest reward Fahkumram has; needs -20 to be guaranteed.",
      },
    ],
    crouchLadder: [
      { frames: "i11", move: "ws4", note: "Toe Smash. Fastest while-standing punish." },
      { frames: "i13", move: "ws1", note: "Quick Elbow from crouch." },
      { frames: "i15", move: "ws3", launch: true, note: "Sumeru Knee. Launches any low that is -15 or worse." },
    ],
  },
};

const tierStartup = (frames: string) => parseInt(frames.replace(/\D/g, ""), 10);

/**
 * The best-reward guaranteed punish for a given minus: the slowest (highest-damage)
 * ladder tier whose startup still fits inside the opponent's minus frames. Blocked lows
 * come off the crouch ladder, because you cannot use a standing launcher from crouch.
 */
function tierFor(
  profile: CharacterPunishProfile,
  minus: number,
  crouching: boolean,
): PunishTier {
  const ladder = crouching ? profile.crouchLadder : profile.ladder;
  const usable = ladder
    .filter((tier) => tierStartup(tier.frames) <= minus)
    .sort((a, b) => tierStartup(b.frames) - tierStartup(a.frames))[0];
  return usable ?? ladder[0];
}

/**
 * Signature minus-on-block moves per opponent — shared across all guide characters.
 * Frames are taken from wavu.wiki's Tekken 8 move tables; `crouching` mirrors Wavu's
 * low / "-Nc" markers.
 */
const OPPONENT_MOVES: Record<string, OpponentPunishableMove[]> = {
  Alisa: [
    { move: "uf+3", minus: 52, note: "Spinning flip. She lands helpless — take the biggest thing you own." },
    { move: "f,F+2", minus: 18, note: "Her running mid. Block it and she owes you a launch." },
    { move: "db+2", minus: 18, note: "Committed mid poke; punish it every time she reaches with it." },
    { move: "db+4 (Deep Web)", minus: 14, crouching: true, note: "Chip low she uses to reset pressure." },
  ],
  Anna: [
    { move: "db+3 (Mudslide)", minus: 26, crouching: true, note: "Her long-range low. Blocking it is a free combo." },
    { move: "f,f,F+3", minus: 20, crouching: true, note: "Running low. Duck-block and punish from crouch." },
    { move: "uf+4 (Quick Somersault Kick)", minus: 18, note: "Panic launcher; heavily minus if you just block it." },
    { move: "3+4 (Aphrodite's Scorn)", minus: 16, note: "i14 mid she throws out to steal turns." },
  ],
  "Armor King": [
    { move: "db+3 (Foot Sweep)", minus: 26, crouching: true, note: "Slow sweep. Block low and launch." },
    { move: "wr4 (Dashing Low Drop Kick)", minus: 21, crouching: true, note: "Running low into oki — hugely minus on block." },
    { move: "f+1+4 (Shoulder Impact)", minus: 19, note: "i13 mid, but the recovery is awful on block." },
    { move: "d+3+4", minus: 16, crouching: true, note: "Low he uses to open you up after grab pressure." },
  ],
  Asuka: [
    { move: "df+3+4 (Sacred Blade)", minus: 26, crouching: true, note: "Her big low. Blocking it ends the round in your favour." },
    { move: "b+3 (Dragon Wheel Kick)", minus: 19, note: "Long mid she uses to keep out. Punish, do not trade." },
    { move: "f+2 (Demon Slayer)", minus: 18, note: "Committed mid poke; free launch on block." },
    { move: "d+1+2 (Sashiro)", minus: 18, crouching: true, note: "Low chop into pressure — punish from crouch." },
  ],
  Azucena: [
    { move: "LIB.d+4", minus: 31, crouching: true, note: "Libertador low. Block it and she loses the round." },
    { move: "db+1+2 (Kilimanjaro Uppercut)", minus: 21, note: "Her launcher. Blocking it is your turn to launch." },
    { move: "db+3+4 (El Cóndor Pasa)", minus: 16, note: "Committed mid she uses to close distance." },
    { move: "db+4 (Bitter Low Kick)", minus: 14, crouching: true, note: "Poking low; punish from crouch, do not stand up." },
  ],
  Bryan: [
    { move: "df+3 (Snake Edge)", minus: 26, crouching: true, note: "The classic. Block low, full combo, every time." },
    { move: "b,B+4 (Flying Knee Kick)", minus: 19, note: "Backdash-cancel knee. Very unsafe if you just block." },
    { move: "ub+1+2", minus: 16, note: "Committed mid string starter." },
    { move: "SWA.3 (Hatchet Kick)", minus: 13, crouching: true, note: "Snake Eyes low — only -13, so take a fast ws punish." },
  ],
  Claudio: [
    { move: "f+2,2 (Deadly Sin)", minus: 26, note: "The second hit is a free launch if you block it." },
    { move: "d+1+2 (Superbia)", minus: 18, note: "i13 mid with terrible recovery on block." },
    { move: "f,F+2", minus: 18, note: "Approach mid. Block and punish instead of backing off." },
    { move: "db+3 (Acedia)", minus: 15, crouching: true, note: "Starburst-setup low; punish from crouch." },
  ],
  Clive: [
    { move: "df+3", minus: 26, crouching: true, note: "Long sweep. Block low and take the full combo." },
    { move: "uf+2", minus: 17, note: "Multi-hit jumping mid; block all of it, then punish." },
    { move: "df+1,2", minus: 16, note: "High ender — duck it for even more, or just block and punish." },
    { move: "GAR.2", minus: 15, note: "Garuda-stance mid. Block the stance move, then hit back." },
  ],
  "Devil Jin": [
    { move: "u+4 (Samsara)", minus: 25, note: "Big committed mid. Free launch on block." },
    { move: "f,n,d,DF+4 (Spinning Demon)", minus: 23, crouching: true, note: "Hellsweep. Block low, punish from crouch." },
    { move: "b+3 (Wicked Jambu Spear)", minus: 18, note: "Range mid he uses to poke; heavily minus." },
    {
      move: "f,n,d,df+2 (Wind God Fist)",
      minus: 10,
      note: "Only the non-electric version. A real EWGF is +5 — do not press after it.",
    },
  ],
  Dragunov: [
    { move: "db+3+4 (Deadly Scorpion)", minus: 31, crouching: true, note: "His committed low. Block it and it is your round." },
    { move: "ub+3", minus: 17, note: "Hop mid he uses to escape pressure. Punish the landing." },
    { move: "qcb+2 (Mass Elbow)", minus: 15, note: "Slow mid he throws out at range." },
    { move: "SNK.2 (Stinger Elbow)", minus: 14, note: "Sneak-stance launcher — blocking it hands you the turn." },
  ],
  Eddy: [
    { move: "RLX.3", minus: 26, crouching: true, note: "Relax-stance low. Block low, punish from crouch." },
    { move: "FC.df+4 (Tornada)", minus: 21, crouching: true, note: "Spinning low out of crouch." },
    { move: "df+3 (Mirage)", minus: 18, note: "i15 mid with heavy recovery on block." },
    { move: "ws2 (Machado)", minus: 18, note: "His while-standing mid. Punish it after you block low." },
  ],
  Fahkumram: [
    { move: "f,F+4~3", minus: 23, crouching: true, note: "Running low mixup. Block low and take everything." },
    { move: "uf+4 (Tyrant Teep)", minus: 16, note: "His biggest launcher — and his biggest liability on block." },
    { move: "d+4 (Rumbling Thunder)", minus: 15, crouching: true, note: "Fast low he leans on. Punish from crouch." },
    { move: "b+2 (Backhand Blow)", minus: 15, note: "i14 high. Duck it for a whiff punish, or block and punish." },
  ],
  Feng: [
    { move: "KNP.4", minus: 31, crouching: true, note: "Kenpo-stance low. Block low and punish from crouch." },
    { move: "db+4 (Mighty Sweep Kick)", minus: 26, crouching: true, note: "Slow sweep — a free combo if you block it." },
    { move: "b+1+2 (Iron Fortress)", minus: 19, note: "His i13 launcher. Blocking it flips the turn completely." },
    { move: "f+2,1,2 (Boar's Tusk)", minus: 19, note: "String ender. Block all three hits, then launch." },
  ],
  Heihachi: [
    { move: "f,n,d,DF+4 (Spinning Demon)", minus: 23, crouching: true, note: "Hellsweep. Block low, punish from crouch." },
    { move: "qcf+2 (Iron Hand)", minus: 17, note: "i14 mid. Very unsafe if you do not respect the follow-ups." },
    { move: "f,F+2 (Demon God Fist)", minus: 16, note: "Approach mid; blocking it is a launch." },
    {
      move: "f,n,d,df+2 (Wind God Fist)",
      minus: 10,
      note: "Non-electric only. The electric is +5 — do not contest it.",
    },
  ],
  Hwoarang: [
    { move: "RFS.d+4", minus: 23, crouching: true, note: "Right Flamingo low. Block low, punish from crouch." },
    { move: "b+3 (Left Plasma Blade)", minus: 19, note: "Long mid he uses to poke out of flamingo." },
    { move: "CD.4 (Sky Rocket)", minus: 18, note: "Crouch-dash mid. Punish rather than trying to sidestep." },
    { move: "d+4", minus: 17, crouching: true, note: "Low he uses to end flamingo pressure." },
  ],
  "Jack-8": [
    { move: "db+1+2 (Megaton Earthquake)", minus: 70, crouching: true, note: "Blocking it gives you the whole life bar back." },
    { move: "df+2,1 (Cosmic Sweeper)", minus: 32, note: "Charged high ender. Duck or block and take the biggest punish you own." },
    { move: "df+3+4 (Dump Truck)", minus: 23, note: "i13 mid that he throws at range. Free launch on block." },
    { move: "b+1+2 (Tyulpan Blast)", minus: 19, note: "Power-crush mid; punish it instead of trading." },
  ],
  Jin: [
    { move: "CD.DF+4", minus: 31, crouching: true, note: "Hellsweep. Block low and punish from crouch." },
    { move: "d+3+4 (Double Lift Kick)", minus: 19, note: "Two-hit mid. Block both hits, then launch." },
    { move: "f+3 (Left Sidekick)", minus: 16, note: "Range mid he pokes with; punish rather than backdash." },
    {
      move: "CD.df+2 (Wind Hook Fist)",
      minus: 10,
      note: "Non-electric only. His EWGF is +5 on block.",
    },
  ],
  Jun: [
    { move: "IZU.4", minus: 37, crouching: true, note: "Izumo-stance low. Block it and the round is yours." },
    { move: "d+3+4 (Double Lift Kicks)", minus: 25, crouching: true, note: "Low into high — block low and punish from crouch." },
    { move: "ws3+4 (Flowing Moon Scent)", minus: 21, note: "Her while-standing commitment; free launch on block." },
    { move: "b+3 (Dragon Wheel Kick)", minus: 19, note: "Range mid. Punish it every time." },
  ],
  Kazuya: [
    { move: "f,n,d,DF+4 (Spinning Demon)", minus: 23, crouching: true, note: "Hellsweep. Block low, punish from crouch — the matchup tax." },
    { move: "db+1,2 (Goutsuiken)", minus: 19, note: "String ender. Block both hits, then launch." },
    { move: "ws2 (Demon God Fist)", minus: 18, note: "His while-standing launcher. Block it and it is your turn." },
    {
      move: "f,n,d,df+2 (Wind God Fist)",
      minus: 10,
      note: "Non-electric only. Electric is +5 — press nothing after it.",
    },
  ],
  King: [
    { move: "d+3+4", minus: 25, crouching: true, note: "Stagger-kick low starter. Block low and punish from crouch." },
    { move: "d+1+2 (Atlas Hammer)", minus: 24, note: "Slow mid he uses for wall pressure. Free launch." },
    { move: "JGR.4 (Jaguar Sprint low)", minus: 21, crouching: true, note: "Sprint low — block it instead of guessing the grab." },
    { move: "f,F+4 (Konvict Kick)", minus: 15, note: "Approach mid into grab pressure. Punish it." },
  ],
  "Kuma / Panda": [
    { move: "b+3+4 (High Jinks)", minus: 28, note: "Hopping mid. Blocking it is free damage." },
    { move: "db+4 (Spinning Kuma)", minus: 23, crouching: true, note: "Bear sweep. Block low and punish from crouch." },
    { move: "f,F+2 (Demon Uppercut)", minus: 19, note: "Their approach launcher — very unsafe on block." },
    { move: "db+2 (Bear Lariat)", minus: 15, crouching: true, note: "Low they use to reset pressure." },
  ],
  Kunimitsu: [
    { move: "SS.4 (Will-O-the-Wisp)", minus: 37, crouching: true, note: "Sidestep low. Block it and take everything." },
    { move: "b+3,4 (Kodama Flip)", minus: 20, note: "Flip ender. Block both hits, then punish the landing." },
    { move: "f,F+4", minus: 17, note: "i9 running mid. Fast, but hugely minus if blocked." },
    { move: "db+3", minus: 15, crouching: true, note: "Poking low; punish from crouch." },
  ],
  Lars: [
    { move: "f,F+4", minus: 31, crouching: true, note: "Running low. Block low and take the full combo." },
    { move: "uf+3 (Lightning Screw)", minus: 26, note: "Two-hit jumping mid. Block it and launch." },
    { move: "d+1+2 (Earth Battery)", minus: 20, crouching: true, note: "Charging low; punish from crouch." },
    { move: "f+1+4 (Power Slug)", minus: 18, note: "i13 mid with awful recovery on block." },
  ],
  Law: [
    { move: "db+4 (Dragon's Tail)", minus: 37, crouching: true, note: "His big low. Blocking it is a whole combo." },
    { move: "FC.df,d,df+3 (Slide Kick)", minus: 23, crouching: true, note: "The slide. Block low and punish from crouch." },
    { move: "ws3+4 (Catapult Kick)", minus: 21, note: "While-standing commitment; free launch on block." },
    { move: "ws2 (Dragon Uppercut)", minus: 18, note: "His while-standing launcher — punish it, do not respect it." },
  ],
  Lee: [
    { move: "ws3", minus: 21, note: "i10 while-standing mid. Fast, but a free launch when blocked." },
    { move: "f+3", minus: 18, note: "The start of his mid strings; punish before he can continue." },
    { move: "1,3:3:3 (Acid Rain)", minus: 17, note: "High ender. Duck it for a whiff punish, or block and launch." },
    { move: "db+4", minus: 15, crouching: true, note: "Fast low he leans on; punish from crouch." },
  ],
  Leo: [
    { move: "db+4", minus: 31, crouching: true, note: "Slow low. Block it and take the full combo." },
    { move: "b+1+2", minus: 24, note: "Committed mid. Free launch on block." },
    { move: "db+4,1", minus: 16, note: "Mid ender off the low; block both hits, then punish." },
    { move: "f+1+2 (Bei Zhe Kao)", minus: 14, note: "Shoulder mid used in stance pressure." },
  ],
  Leroy: [
    { move: "HRM.b+3", minus: 26, crouching: true, note: "Hermit-stance low. Block low and punish from crouch." },
    { move: "df+2,1+2 (Rising Dragons)", minus: 18, note: "String ender; block all of it, then launch." },
    { move: "f+3,1+2,4", minus: 16, note: "Mid string ender. Punish rather than pressing after block." },
    { move: "db+4 (Fan Sweep)", minus: 15, crouching: true, note: "His poking low; punish from crouch." },
  ],
  Lidia: [
    { move: "f,F+4,3 (Hazy Moon Double Kick)", minus: 27, note: "String ender. Block both hits, then launch." },
    { move: "FC.df+3 (Odd-tooth Snake)", minus: 26, crouching: true, note: "Crouching low. Block it and take everything." },
    { move: "HRS.1+2 (Low Chop)", minus: 18, crouching: true, note: "Stance low; punish from crouch." },
    { move: "qcf+2,2,1+2 (Blossom Fury)", minus: 17, note: "Mid string ender — block all of it, then punish." },
  ],
  Lili: [
    { move: "db+4 (Edelweiss)", minus: 24, crouching: true, note: "Her slow low. Block low and take the combo." },
    { move: "d+3+4 (Matterhorn Ascension)", minus: 21, note: "Committed mid; free launch on block." },
    { move: "ws3", minus: 21, note: "While-standing mid she uses after lows — punish it." },
    { move: "FC.df+3 (Horizon Slide)", minus: 18, crouching: true, note: "The slide; punish from crouch." },
  ],
  "Miary Zo": [
    { move: "FC.df+4 (Mpiady Mierona)", minus: 26, crouching: true, note: "Crouching low. Block low and punish from crouch." },
    { move: "db+3 (Daka Zavona)", minus: 26, crouching: true, note: "Long sweep — blocking it is a full combo." },
    { move: "f+1+2,1+2,3+4 (Oram-Baratra)", minus: 22, note: "String ender. Block all of it, then launch." },
    { move: "d+1+2 (Dandrok'ady)", minus: 17, note: "Committed mid she uses to close space." },
  ],
  Nina: [
    { move: "d,DF+4 (Wipe the Floor)", minus: 37, crouching: true, note: "Her big low. Block it and take everything." },
    { move: "CD.3 (Sideslip)", minus: 20, crouching: true, note: "Crouch-dash low; punish from crouch." },
    { move: "db+3+4 (Geyser Cannon)", minus: 17, note: "Committed mid. Free launch on block." },
    { move: "3", minus: 16, note: "i14 high she pokes with. Duck it, or block and punish." },
  ],
  Paul: [
    { move: "d+4", minus: 31, crouching: true, note: "His fast low. Block low and punish from crouch." },
    { move: "qcf+2 (Phoenix Smasher)", minus: 17, note: "Deathfist. Every blocked one is a launch — this is the matchup." },
    { move: "f,F+3", minus: 17, note: "Running mid; punish it rather than backing off." },
    { move: "qcf+3 (Gengetsu)", minus: 14, crouching: true, note: "Demoman low. Punish from crouch, not standing." },
  ],
  Raven: [
    { move: "b+2,2,1+2 (Deadly Talon)", minus: 30, crouching: true, note: "Low ender. Block low and take the full combo." },
    { move: "BT.d+3 (Shinobi Cyclone)", minus: 26, crouching: true, note: "Back-turned low; punish from crouch." },
    { move: "FC.df+3+4 (Tornado Destruction)", minus: 23, crouching: true, note: "Crouching low commitment — free combo on block." },
    { move: "b+2,2,3 (Unicorn's Tail)", minus: 19, note: "Mid ender. Block all of it, then launch." },
  ],
  Reina: [
    { move: "SEN.3+4 (Yaksha Sweep)", minus: 29, crouching: true, note: "Sentai low. Block low and punish from crouch." },
    { move: "WGS.DF+4", minus: 23, crouching: true, note: "Her hellsweep. Same rule: block low, punish from crouch." },
    { move: "WGS.1 (Thunder God Fist)", minus: 22, note: "Wind God Step mid. Free launch when blocked." },
    {
      move: "WGS.2 (Wind God Fist)",
      minus: 10,
      note: "Non-electric only. Her EWGF is +5 — do not press after it.",
    },
  ],
  Shaheen: [
    { move: "FC.df,d,DF+3 (Sand Storm)", minus: 23, crouching: true, note: "The slide. Block low, punish from crouch." },
    { move: "db+3 (Snake's Bite)", minus: 17, crouching: true, note: "His main low; punish from crouch." },
    { move: "ws2 (Hawk Edge)", minus: 17, note: "While-standing mid he uses after lows. Punish it." },
    { move: "b+4 (Broken Mirage)", minus: 15, note: "Range mid; free punish on block." },
  ],
  Steve: [
    { move: "PAB.b+1", minus: 19, note: "Peekaboo mid. Blocking it hands you a launch." },
    { move: "qcf+2 (Low Cross Blaster)", minus: 18, crouching: true, note: "His low. Block low and punish from crouch." },
    { move: "d+2", minus: 18, crouching: true, note: "Poking low into pressure; punish from crouch." },
    { move: "u+2 (Dreadnought Uppercut)", minus: 15, note: "His launcher — blocking it flips the turn." },
  ],
  Victor: [
    { move: "IAI.d+1+2 (Espee Aventureuse)", minus: 29, crouching: true, note: "Stance low. Block low and take everything." },
    { move: "db+4 (Welcome Sweep)", minus: 26, crouching: true, note: "Slow sweep; punish from crouch." },
    { move: "b+1+4 (Dun Stallion)", minus: 21, note: "Committed mid. Free launch on block." },
    { move: "uf+4 (Chatoyant Courage)", minus: 19, note: "Jumping mid into special mid — punish the landing." },
  ],
  Xiaoyu: [
    { move: "AOP.3+4 (Sliding Firecracker)", minus: 33, crouching: true, note: "AOP slide. Block low and take the full combo." },
    { move: "df+3 (Phoenix Tail)", minus: 23, crouching: true, note: "Her long low; punish from crouch." },
    { move: "f+3,1,4 (Talons of Fury)", minus: 22, note: "Mid string ender. Block all of it, then launch." },
    { move: "f+1+2 (Clouded Peak)", minus: 16, note: "i12 mid she uses to steal turns — punish it." },
  ],
  Yoshimitsu: [
    { move: "db+3", minus: 25, crouching: true, note: "His sweep. Block low and punish from crouch." },
    { move: "1+4 (Soul Stealer)", minus: 20, note: "i6 mid, but the recovery is enormous on block." },
    { move: "f,F+3+4 (Reverse Cartwheel)", minus: 20, note: "Cartwheel approach; punish the landing." },
    { move: "d+3 (Low Sweep)", minus: 18, crouching: true, note: "Poking low; punish from crouch." },
  ],
  Zafina: [
    { move: "WR.f+4 (Tarantula Dive)", minus: 36, crouching: true, note: "Running low dive, -36 at its safest. Blocking it is a free round." },
    { move: "MNT.4,3 (Neti)", minus: 30, note: "Mantis mid ender. Block both hits, then launch." },
    { move: "FC.df+3 (Spinning Sweep)", minus: 26, crouching: true, note: "Crouching sweep; punish from crouch." },
    { move: "SCR.4 (Spinning Sappara)", minus: 18, note: "Scarecrow mid. Free launch on block." },
  ],
};

/** Guides label the player's own character "X (mirror)" in their matchup list. */
const MIRROR_ALIASES: Record<string, string> = {
  "Dragunov (mirror)": "Dragunov",
  "Fahkumram (mirror)": "Fahkumram",
  "Feng (mirror)": "Feng",
  "Steve (mirror)": "Steve",
  "Xiaoyu (mirror)": "Xiaoyu",
};

export const OPPONENT_PUNISHABLE_MOVES: Record<string, OpponentPunishableMove[]> = {
  ...OPPONENT_MOVES,
  ...Object.fromEntries(
    Object.entries(MIRROR_ALIASES).map(([alias, base]) => [alias, OPPONENT_MOVES[base]]),
  ),
};

const GENERIC_FALLBACK: OpponentPunishableMove[] = [
  { move: "Blocked sweep", minus: 23, crouching: true, note: "Most sweeps sit around -23. Block low, then punish from crouch." },
  { move: "Blocked launcher", minus: 15, note: "Hopkicks and uppercuts land around -15 on block." },
  { move: "String ender", minus: 13, note: "Block the whole string before pressing — most enders finish around -13." },
];

export type ResolvedOpponentPunish = OpponentPunishableMove & {
  punish: string;
  /** True when the recommended punish launches for a full combo. */
  punishLaunches: boolean;
};

export type MatchupPunishmentData = {
  characterName: string;
  ladder: PunishTier[];
  crouchLadder: PunishTier[];
  whiffPunish: string;
  opponentName: string;
  opponentPunishes: ResolvedOpponentPunish[];
};

export function getMatchupPunishment(
  characterId: GuideCharacterId,
  opponentName: string,
): MatchupPunishmentData {
  const profile = CHARACTER_PROFILES[characterId];
  const moves = OPPONENT_PUNISHABLE_MOVES[opponentName] ?? GENERIC_FALLBACK;

  return {
    characterName: profile.displayName,
    ladder: profile.ladder,
    crouchLadder: profile.crouchLadder,
    whiffPunish: profile.whiffPunish,
    opponentName,
    opponentPunishes: moves.map((entry) => {
      const tier = tierFor(profile, entry.minus, entry.crouching ?? false);
      return {
        ...entry,
        punish: tier.move,
        punishLaunches: tier.launch ?? false,
      };
    }),
  };
}

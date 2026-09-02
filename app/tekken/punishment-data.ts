export type GuideCharacterId =
  | "steve"
  | "feng"
  | "ling"
  | "dragunov"
  | "fahkumram";

export type PunishTier = {
  frames: string;
  move: string;
  note?: string;
};

export type OpponentPunishableMove = {
  move: string;
  minus: number;
  note: string;
};

export type CharacterPunishProfile = {
  displayName: string;
  ladder: PunishTier[];
  whiffPunish: string;
};

const FRAME_TIERS = [10, 11, 12, 13, 14, 15, 16] as const;

export const CHARACTER_PROFILES: Record<GuideCharacterId, CharacterPunishProfile> = {
  steve: {
    displayName: "Steve",
    whiffPunish: "qcf+1 / 1+2",
    ladder: [
      { frames: "i10", move: "1", note: "Default jab punish." },
      { frames: "i12", move: "ws1+2", note: "While-standing launch on tight frames." },
      { frames: "i13", move: "b+1 / ws4", note: "Steve lacks a clean i15; take damage here." },
      { frames: "i15", move: "ws launch route", note: "Use your best standing launcher on -15." },
      { frames: "i16+", move: "1+2 / qcf+1", note: "Heavy whiff or block punish at range." },
    ],
  },
  feng: {
    displayName: "Feng Wei",
    whiffPunish: "qcf+1",
    ladder: [
      { frames: "i10", move: "1", note: "Jab punish and CH starter." },
      { frames: "i13", move: "ws4", note: "Standing launcher; confirm spacing." },
      { frames: "i15", move: "u/f+2", note: "Main -15 launcher with wall carry." },
      { frames: "i16+", move: "f+1+2", note: "Heavy punish when they overcommit." },
    ],
  },
  ling: {
    displayName: "Ling Xiaoyu",
    whiffPunish: "qcf+1 / b+4",
    ladder: [
      { frames: "i10", move: "1", note: "Jab punish into stance routes." },
      { frames: "i13", move: "ws4", note: "Standing launcher." },
      { frames: "i15", move: "b+4 / u/f+2", note: "b+4 splats; u/f+2 carries." },
      { frames: "i16+", move: "f+3 CH route", note: "Use on big whiffs or wall reads." },
    ],
  },
  dragunov: {
    displayName: "Dragunov",
    whiffPunish: "wr2 / 1+2",
    ladder: [
      { frames: "i10", move: "1 / 1,2,1", note: "CH wall-splat string on mash." },
      { frames: "i12", move: "ws1+2", note: "Heat crouch punish." },
      { frames: "i13", move: "ws4", note: "Safe standing poke punish." },
      { frames: "i15", move: "b+4,3", note: "Wall-splatting -15 punish." },
      { frames: "i16+", move: "b+4,2,1", note: "Heavy confirm on big minus." },
    ],
  },
  fahkumram: {
    displayName: "Fahkumram",
    whiffPunish: "3,4 / b,f+4",
    ladder: [
      { frames: "i10", move: "1", note: "Jab punish from limb range." },
      { frames: "i13", move: "ws4", note: "Standing launcher." },
      { frames: "i15", move: "df+2", note: "Hopkick launcher on -15." },
      { frames: "i16+", move: "b,f+4", note: "Launch on heavy whiffs." },
    ],
  },
};

function tierMove(profile: CharacterPunishProfile, minus: number): string {
  const ladder = profile.ladder;
  const pick = (label: string) =>
    ladder.find((tier) => tier.frames.startsWith(label))?.move ?? ladder[ladder.length - 1].move;

  if (minus <= 10) return pick("i10");
  if (minus <= 11) return ladder.find((t) => t.frames === "i11")?.move ?? pick("i10");
  if (minus <= 12) return pick("i12");
  if (minus <= 13) return pick("i13");
  if (minus <= 14) return ladder.find((t) => t.frames === "i14")?.move ?? pick("i13");
  if (minus <= 15) return pick("i15");
  return pick("i16");
}

/** Signature minus-on-block moves per opponent — shared across all guide characters. */
export const OPPONENT_PUNISHABLE_MOVES: Record<string, OpponentPunishableMove[]> = {
  Alisa: [
    { move: "Boots (b+3)", minus: 11, note: "Backdash trap; jab or sidestep before chasing." },
    { move: "Hopkick (df+2)", minus: 13, note: "Whiff or block, then launch." },
    { move: "DES.2 chainsaw", minus: 14, note: "Block first swing, punish minus enders." },
  ],
  Anna: [
    { move: "Chaos low (db+4)", minus: 15, note: "Launch on block." },
    { move: "Hopkick (df+2)", minus: 13, note: "Standard -13 launcher punish." },
    { move: "df+1 string ender", minus: 12, note: "Many Anna strings finish -12." },
  ],
  "Armor King": [
    { move: "Dark Upper whiff", minus: 16, note: "Whiff punish the recovery." },
    { move: "Command grab setup highs", minus: 13, note: "Block and ws4 on minus." },
    { move: "Jaguar Sprint approach", minus: 15, note: "Sidestep and launch the recovery." },
  ],
  Asuka: [
    { move: "Big string finishers", minus: 14, note: "Lab her -12 to -14 enders." },
    { move: "Parry whiff", minus: 18, note: "Whiff punish after baiting parry." },
    { move: "df+2 hopkick", minus: 13, note: "Block or whiff, then launch." },
  ],
  Azucena: [
    { move: "Libertador stance lows", minus: 15, note: "Launch blocked lows." },
    { move: "df+2", minus: 13, note: "Standard hopkick punish." },
    { move: "Coffee break charge whiff", minus: 16, note: "Whiff punish the charge." },
  ],
  Bryan: [
    { move: "Hatchet kick (f+3)", minus: 22, note: "Free launch every time on block." },
    { move: "b+4", minus: 14, note: "Kick punish on block." },
    { move: "df+2 hopkick", minus: 13, note: "Respect and launch." },
  ],
  Claudio: [
    { move: "Orb whiff", minus: 16, note: "Whiff punish orb setups." },
    { move: "df+2", minus: 13, note: "Launcher punish." },
    { move: "Starburst pressure highs", minus: 12, note: "Duck or jab after block." },
  ],
  Clive: [
    { move: "Big sword swings", minus: 15, note: "Several sword commits are -15." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Projectile follow-ups", minus: 14, note: "Block and launch minus enders." },
  ],
  "Devil Jin": [
    { move: "Hellsweep (d,d/f+4)", minus: 15, note: "Block low, launch — highest-value punish." },
    { move: "EWGF (f,n,d,d/f+2)", minus: 10, note: "High; block and i10 jab." },
    { move: "Laser whiff", minus: 18, note: "Whiff punish at range." },
  ],
  Dragunov: [
    { move: "d+2 sweep", minus: 13, note: "Tracking low; launch on block." },
    { move: "b+4,3", minus: 14, note: "High follow-up; duck-launch on read." },
    { move: "SNK.2", minus: 12, note: "Sneak punch minus; jab or launch." },
  ],
  Eddy: [
    { move: "Capoeira sweep", minus: 15, note: "Launch blocked sweep." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Handstand kick whiff", minus: 16, note: "Whiff punish acrobatics." },
  ],
  Fahkumram: [
    { move: "d+4 low", minus: 15, note: "Launch-punishable low." },
    { move: "db+4", minus: 13, note: "Slide low; ws4 on block." },
    { move: "GRF f+2,1,2 finish", minus: 14, note: "Sidestep before final hit." },
  ],
  "Feng (mirror)": [
    { move: "Shoulder (b+1+2)", minus: 14, note: "Launch or heavy punish on block." },
    { move: "Sweep (d+2)", minus: 13, note: "Standard -13 punish." },
    { move: "qcf+1 whiff", minus: 16, note: "Whiff punish kenpo swings." },
  ],
  Feng: [
    { move: "Shoulder (b+1+2)", minus: 14, note: "Launch or heavy punish on block." },
    { move: "Sweep (d+2)", minus: 13, note: "Standard -13 punish." },
    { move: "qcf+1 whiff", minus: 16, note: "Whiff punish kenpo swings." },
  ],
  Heihachi: [
    { move: "Hellsweep (d,d/f+4)", minus: 15, note: "Block low, launch." },
    { move: "EWGF", minus: 10, note: "High; i10 jab after block." },
    { move: "f+3+4 power crush whiff", minus: 16, note: "Whiff punish the recovery." },
  ],
  Hwoarang: [
    { move: "Flamingo high strings", minus: 14, note: "Duck known highs and launch." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Left Flamingo lows", minus: 15, note: "Launch blocked lows." },
  ],
  "Jack-8": [
    { move: "Arm swings whiff", minus: 18, note: "Whiff punish slow recovery." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Command grab whiff", minus: 20, note: "Launch whiffed grabs." },
  ],
  Jin: [
    { move: "Hellsweep (d,d/f+4)", minus: 15, note: "Block low, launch." },
    { move: "EWGF", minus: 10, note: "High; jab on block." },
    { move: "ZEN cancel strings", minus: 12, note: "Lab minus enders after block." },
  ],
  Jun: [
    { move: "String finishers", minus: 12, note: "Many flows end -12 or worse." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Parry whiff", minus: 16, note: "Punish whiffed parry attempts." },
  ],
  Kazuya: [
    { move: "Hellsweep (d,d/f+4)", minus: 15, note: "Block low, launch — the matchup tax." },
    { move: "EWGF (f,n,d,d/f+2)", minus: 10, note: "High; i10 jab after block." },
    { move: "Wavedash approach whiff", minus: 16, note: "Whiff punish with keepout." },
  ],
  King: [
    { move: "Giant Swing whiff", minus: 20, note: "Launch whiffed throw attempts." },
    { move: "Jaguar Sprint", minus: 15, note: "Sidestep and punish recovery." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  "Kuma / Panda": [
    { move: "Bear sweep", minus: 15, note: "Launch blocked sweep." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Hunting stance whiff", minus: 16, note: "Whiff punish stance exits." },
  ],
  Kunimitsu: [
    { move: "Flip follow-ups", minus: 14, note: "Block, label, then punish." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Teleport whiff", minus: 18, note: "Whiff punish reposition." },
  ],
  Lars: [
    { move: "WR+1,2 finish", minus: 14, note: "Minus string ender on block." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Lightning screw whiff", minus: 16, note: "Whiff punish screw attempts." },
  ],
  Law: [
    { move: "DSS slide (f+3)", minus: 15, note: "While-standing launch on block." },
    { move: "Dragon Charge whiff", minus: 16, note: "Whiff punish the charge." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Lee: [
    { move: "Hitman stance low", minus: 15, note: "Launch blocked stance low." },
    { move: "Acid Rain strings", minus: 12, note: "Lab -12 enders after block." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Leo: [
    { move: "B+4,2 string", minus: 14, note: "High ender; duck-launch on read." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Jinau stance lows", minus: 15, note: "Launch blocked lows." },
  ],
  Leroy: [
    { move: "Hermit parry whiff", minus: 16, note: "Punish after baiting parry." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "b+2,1 string ender", minus: 14, note: "Minus on block; launch." },
  ],
  Lidia: [
    { move: "Cat stance mix lows", minus: 15, note: "Launch blocked lows." },
    { move: "Power crush stance", minus: 14, note: "Block and punish minus exits." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Lili: [
    { move: "Matterhorn (f+3)", minus: 15, note: "Launch on block." },
    { move: "Backturn flip return", minus: 14, note: "Punish the landing." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  "Miary Zo": [
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Stance mix lows", minus: 15, note: "Launch blocked lows." },
    { move: "Big string whiff", minus: 16, note: "Whiff punish committed strings." },
  ],
  Nina: [
    { move: "Blonde Bomb (db+3+4)", minus: 15, note: "Launch on block." },
    { move: "ss1 evasion whiff", minus: 14, note: "Homing or whiff punish." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Paul: [
    { move: "Deathfist (qcf+2)", minus: 15, note: "Launch every blocked deathfist." },
    { move: "Demoman (qcf+3)", minus: 16, note: "Launch or heavy punish." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Raven: [
    { move: "Teleport follow-ups", minus: 14, note: "Block and punish minus exits." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Soulzone whiff", minus: 16, note: "Whiff punish setup." },
  ],
  Reina: [
    { move: "Sentai stance lows", minus: 15, note: "Launch blocked lows." },
    { move: "Electric (EWGF)", minus: 10, note: "High; jab on block." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Shaheen: [
    { move: "Slide (d/b+3)", minus: 15, note: "While-standing launch on block." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Step kick whiff", minus: 16, note: "Whiff punish approach." },
  ],
  Steve: [
    { move: "db+3,2 low string", minus: 15, note: "Launch blocked low." },
    { move: "FLK 1,d+1", minus: 12, note: "Walk back and whiff punish b+1." },
    { move: "qcf+1 whiff", minus: 16, note: "Whiff punish at range." },
  ],
  Victor: [
    { move: "Sword commitments", minus: 15, note: "Launch unsafe sword swings." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Parry whiff", minus: 16, note: "Punish whiffed parry." },
  ],
  Xiaoyu: [
    { move: "AOP stance lows", minus: 15, note: "Launch blocked stance lows." },
    { move: "Hypnotist gimmicks", minus: 14, note: "Block and punish minus exits." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
  ],
  Yoshimitsu: [
    { move: "Unblockable attempts", minus: 18, note: "Launch slow unblockables." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Suicide moves whiff", minus: 20, note: "Free launch on whiff." },
  ],
  Zafina: [
    { move: "Stance lows (Mantis/Tarantula)", minus: 15, note: "Launch blocked stance lows." },
    { move: "df+2", minus: 13, note: "Hopkick punish." },
    { move: "Azazel arm whiff", minus: 16, note: "Whiff punish arm swings." },
  ],
};

const GENERIC_FALLBACK: OpponentPunishableMove[] = [
  { move: "Hopkick (df+2)", minus: 13, note: "Standard -13 launcher punish." },
  { move: "Hellsweep / -15 sweep", minus: 15, note: "Block low, launch." },
  { move: "Big string whiff", minus: 16, note: "Use your whiff punish tool." },
];

export type ResolvedOpponentPunish = OpponentPunishableMove & {
  punish: string;
};

export type MatchupPunishmentData = {
  characterName: string;
  ladder: PunishTier[];
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
    whiffPunish: profile.whiffPunish,
    opponentName,
    opponentPunishes: moves.map((entry) => ({
      ...entry,
      punish: tierMove(profile, entry.minus),
    })),
  };
}

export { FRAME_TIERS };

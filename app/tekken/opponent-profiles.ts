export type OpponentThreat = {
  label: string;
  search: string;
  note: string;
};

export type OpponentProfile = {
  slug: string;
  archetype: string;
  /** What this character is trying to accomplish — read this first. */
  gamePlan: string;
  /** Signature patterns to recognise mid-round. */
  watchFor: string[];
  threats: OpponentThreat[];
};

export const OPPONENT_PROFILES: Record<string, OpponentProfile> = {
  "Alisa": {
    slug: "alisa",
    archetype: "Aerial mobility and chainsaw pressure",
    gamePlan: "Alisa wants to dance around backdashes, boots, and destructive form chainsaw pressure",
    watchFor: ["Her primary backdash punisher. If you chase with dashing highs, this is what clips you.","Destructive form pressure. Block first — most entries are minus or interruptible on block.","Her main launcher from neutral. Whiff punish with qcf+1 or a full launch."],
    threats: [
        {
            "label": "Boots (b+3)",
            "search": "b+3",
            "note": "Her primary backdash punisher. If you chase with dashing highs, this is what clips you."
        },
        {
            "label": "Chainsaw stance (DES.2)",
            "search": "DES.2",
            "note": "Destructive form pressure. Block first — most entries are minus or interruptible on block."
        },
        {
            "label": "Hopkick (df+2)",
            "search": "df+2",
            "note": "Her main launcher from neutral. Whiff punish with qcf+1 or a full launch."
        }
    ],
  },
  "Anna": {
    slug: "anna",
    archetype: "Chaotic 50/50s and counter-hit traps",
    gamePlan: "Anna throws out risky lows and counter-hit highs constantly. She wins rounds fast when you freeze, but nearly everything she opens with is punishable if you block it.",
    watchFor: ["One of her signature risky lows. Block it and the punish is enormous — launch or heavy.","Fast launcher she throws out constantly. Respect it, block, then take your turn.","Her plus-looking pressure starter. Block through the string before answering."],
    threats: [
        {
            "label": "Chaos low (db+4)",
            "search": "db+4",
            "note": "One of her signature risky lows. Block it and the punish is enormous — launch or heavy."
        },
        {
            "label": "Hopkick (df+2)",
            "search": "df+2",
            "note": "Fast launcher she throws out constantly. Respect it, block, then take your turn."
        },
        {
            "label": "Mid check (df+1)",
            "search": "df+1",
            "note": "Her plus-looking pressure starter. Block through the string before answering."
        }
    ],
  },
  "Armor King": {
    slug: "armor-king",
    archetype: "Throw mixups with heavyweight strikes",
    gamePlan: "Armor King mixes King-style command grabs with stronger mid pokes and the Dark Upper. The matchup is a throw-break exam first and a footsie fight second.",
    watchFor: ["Classic King-style command grab. Watch the arms: break with 1 or 2 depending on the animation.","Mid command grab that catches duck attempts. Do not crouch randomly near him.","Linear approach move into grab range. Sidestep after blocking rather than eating the follow-up."],
    threats: [
        {
            "label": "Giant Swing (1+2)",
            "search": "1+2",
            "note": "Classic King-style command grab. Watch the arms: break with 1 or 2 depending on the animation."
        },
        {
            "label": "Dark Upper (f+1+2)",
            "search": "f+1+2",
            "note": "Mid command grab that catches duck attempts. Do not crouch randomly near him."
        },
        {
            "label": "Shoulder (b+1+2)",
            "search": "b+1+2",
            "note": "Linear approach move into grab range. Sidestep after blocking rather than eating the follow-up."
        }
    ],
  },
  "Asuka": {
    slug: "asuka",
    archetype: "Defensive reversals and counter-hit whiff punishing",
    gamePlan: "Asuka's parry and counter-hit tools are built to punish exactly the punch pressure Steve lives on",
    watchFor: ["Her core defensive tool. Feeding rhythmic punch strings is exactly what she wants.","Launcher that catches panic presses during her frame traps.","Safe pressure she loops. Most of her offense is minus when you stand block."],
    threats: [
        {
            "label": "Parry (1+4)",
            "search": "1+4",
            "note": "Her core defensive tool. Feeding rhythmic punch strings is exactly what she wants."
        },
        {
            "label": "Can-can (3+4)",
            "search": "3+4",
            "note": "Launcher that catches panic presses during her frame traps."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Safe pressure she loops. Most of her offense is minus when you stand block."
        }
    ],
  },
  "Azucena": {
    slug: "azucena",
    archetype: "Relentless forward pressure with evasive stance",
    gamePlan: "Azucena runs at you all day and her Libertador stance ducks under highs mid-pressure. Steve has to be deliberate about which buttons he checks her with.",
    watchFor: ["Her evasive stance ducks under highs mid-pressure. Do not Flicker spam into it.","Relentless forward pressure. Punish on block rather than trying to move away.","Her counter-hit fishing button. Contest with your own b+1 timing."],
    threats: [
        {
            "label": "Libertador stance (df+1)",
            "search": "df+1",
            "note": "Her evasive stance ducks under highs mid-pressure. Do not Flicker spam into it."
        },
        {
            "label": "Running attack (f+2)",
            "search": "f+2",
            "note": "Relentless forward pressure. Punish on block rather than trying to move away."
        },
        {
            "label": "Mid check (b+1)",
            "search": "b+1",
            "note": "Her counter-hit fishing button. Contest with your own b+1 timing."
        }
    ],
  },
  "Bryan": {
    slug: "bryan",
    archetype: "Keepout and counter-hit destruction",
    gamePlan: "Bryan wants you at the tip of his kicks where his counter-hit machine is safest. Steve wants chest-to-chest where Bryan's minus frames actually matter",
    watchFor: ["Signature keepout kick. Block it every time — the punish is a full launch.","Slow low that Bryan players love to throw out. Block and launch — no guessing required.","Long-range poke that controls neutral. Weave on approach rather than running straight in."],
    threats: [
        {
            "label": "Hatchet kick (f+2,1)",
            "search": "f+2,1",
            "note": "Signature keepout kick. Block it every time — the punish is a full launch."
        },
        {
            "label": "Snake edge (b+4)",
            "search": "b+4",
            "note": "Slow low that Bryan players love to throw out. Block and launch — no guessing required."
        },
        {
            "label": "Keepout kick (f+3)",
            "search": "f+3",
            "note": "Long-range poke that controls neutral. Weave on approach rather than running straight in."
        }
    ],
  },
  "Claudio": {
    slug: "claudio",
    archetype: "Simple, strong mids with Starburst spikes",
    gamePlan: "Claudio's game is honest: strong mids, a hopkick, and scary Starburst-empowered moves. His lows are famously weak, which means Steve can stand block a frightening amount of this match.",
    watchFor: ["Scary when Starburst is loaded. Do not duck during empowered states.","Honest, strong mid he loops constantly. Stand block is your default here.","His main whiff-punish tool. Do not swing at mid-range without a read."],
    threats: [
        {
            "label": "Starburst launcher (b+4)",
            "search": "b+4",
            "note": "Scary when Starburst is loaded. Do not duck during empowered states."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Honest, strong mid he loops constantly. Stand block is your default here."
        },
        {
            "label": "Hopkick (df+2)",
            "search": "df+2",
            "note": "His main whiff-punish tool. Do not swing at mid-range without a read."
        }
    ],
  },
  "Clive": {
    slug: "clive",
    archetype: "Ranged zoning with stance shift cancels",
    gamePlan: "Clive controls half the screen with sword range and projectile-style pokes",
    watchFor: ["Controls half the screen. Advance behind block — most ranged moves are minus enough to keep walking.","Big sword commitment. Several are heavily punishable on block once labbed.","His main close-range threat. Stay glued once you get inside."],
    threats: [
        {
            "label": "Sword poke (df+1)",
            "search": "df+1",
            "note": "Controls half the screen. Advance behind block — most ranged moves are minus enough to keep walking."
        },
        {
            "label": "Mid swing (f+2)",
            "search": "f+2",
            "note": "Big sword commitment. Several are heavily punishable on block once labbed."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "His main close-range threat. Stay glued once you get inside."
        }
    ],
  },
  "Devil Jin": {
    slug: "devil-jin",
    archetype: "Wavedash 50/50s and aerial control",
    gamePlan: "Devil Jin's threat is the wavedash mix between hellsweep and mid launcher, backed by lasers and flight nonsense",
    watchFor: ["The wavedash mix low. Launch blocked hellsweep every single time — it is the matchup.","The other half of the 50/50. Do not duck early out of fear.","High that ends rounds on counter hit. Weave under it for a free launch."],
    threats: [
        {
            "label": "Hellsweep (f+4)",
            "search": "f+4",
            "note": "The wavedash mix low. Launch blocked hellsweep every single time — it is the matchup."
        },
        {
            "label": "Mid launcher (d+2)",
            "search": "d+2",
            "note": "The other half of the 50/50. Do not duck early out of fear."
        },
        {
            "label": "Electric (f,n,d,df+2)",
            "search": "f,n,d,df+2",
            "note": "High that ends rounds on counter hit. Weave under it for a free launch."
        }
    ],
  },
  "Dragunov": {
    slug: "dragunov",
    archetype: "Suffocating plus frames and running offense",
    gamePlan: "Dragunov gets more plus frames than almost anyone, and Steve's instinct to press back is exactly what feeds him. This matchup rewards the most patient version of your defense.",
    watchFor: ["Plus-frame running offense. Sidestep instead of backdashing — he catches retreat.","Suffocating frame advantage. Respect fully, then take your turn only when minus.","Committal low you can punish with while-standing offense every time."],
    threats: [
        {
            "label": "Running mid (f+2)",
            "search": "f+2",
            "note": "Plus-frame running offense. Sidestep instead of backdashing — he catches retreat."
        },
        {
            "label": "Plus mid (df+2)",
            "search": "df+2",
            "note": "Suffocating frame advantage. Respect fully, then take your turn only when minus."
        },
        {
            "label": "Sweep (d+2)",
            "search": "d+2",
            "note": "Committal low you can punish with while-standing offense every time."
        }
    ],
  },
  "Eddy": {
    slug: "eddy",
    archetype: "Stance flow and unfamiliar rhythm",
    gamePlan: "Eddy wins on unfamiliarity: negativa, handstand, and constant transitions. Once you know when he is actually vulnerable, Steve's homing mids take the character apart.",
    watchFor: ["Ground stance low that low-profiles your highs. Hit negativa with mids on reaction.","Unfamiliar rhythm mid. Stand block first when unsure.","Stance transition that looks scarier than it is. Most flow is not real on block."],
    threats: [
        {
            "label": "Negativa sweep (d+4)",
            "search": "d+4",
            "note": "Ground stance low that low-profiles your highs. Hit negativa with mids on reaction."
        },
        {
            "label": "Capoeira mid (df+2)",
            "search": "df+2",
            "note": "Unfamiliar rhythm mid. Stand block first when unsure."
        },
        {
            "label": "Handstand kick (b+3)",
            "search": "b+3",
            "note": "Stance transition that looks scarier than it is. Most flow is not real on block."
        }
    ],
  },
  "Fahkumram": {
    slug: "fahkumram",
    archetype: "Range tyrant with plus-frame kicks",
    gamePlan: "Fahkumram's limbs control a zone Steve simply cannot poke into. But his up-close game and defense are much weaker, and Steve is one of the best characters at living inside someone's chest.",
    watchFor: ["Long-range keepout that controls the zone Steve cannot poke into.","Frame-advantaged mid kick. Weave under his high kicks on approach.","Committal mid he throws out up close. Punish on block."],
    threats: [
        {
            "label": "Knee (f+3)",
            "search": "f+3",
            "note": "Long-range keepout that controls the zone Steve cannot poke into."
        },
        {
            "label": "Plus kick (df+2)",
            "search": "df+2",
            "note": "Frame-advantaged mid kick. Weave under his high kicks on approach."
        },
        {
            "label": "Launcher (b+4)",
            "search": "b+4",
            "note": "Committal mid he throws out up close. Punish on block."
        }
    ],
  },
  "Feng": {
    slug: "feng",
    archetype: "Evasive kenpo and punish-everything defense",
    gamePlan: "Feng's back-sway makes committed offense whiff, and his keepout punishes impatience brutally. Steve has to play the mirror of his own game: bait, whiff punish, and refuse to overcommit.",
    watchFor: ["Kenpo approach move. Know the exact block punish cold.","Low from kenpo step. Punish properly on block.","Safe pressure that baits overextension. Short, safe pokes only."],
    threats: [
        {
            "label": "Shoulder (b+1+2)",
            "search": "b+1+2",
            "note": "Kenpo approach move. Know the exact block punish cold."
        },
        {
            "label": "Sweep (d+2)",
            "search": "d+2",
            "note": "Low from kenpo step. Punish properly on block."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Safe pressure that baits overextension. Short, safe pokes only."
        }
    ],
  },
  "Heihachi": {
    slug: "heihachi",
    archetype: "Mishima power with warrior instinct stance",
    gamePlan: "Heihachi hits harder than nearly anyone and his stance pressure is real, but his approach lives on highs and hard commitments that Steve's evasion was built for.",
    watchFor: ["Wavedash mix low. Launch on block every time.","High with devastating counter-hit damage. Weave for free launch.","Hard-hitting linear move. Fight at range 1 where your counter hits win."],
    threats: [
        {
            "label": "Hellsweep (f+4)",
            "search": "f+4",
            "note": "Wavedash mix low. Launch on block every time."
        },
        {
            "label": "Electric (f,n,d,df+2)",
            "search": "f,n,d,df+2",
            "note": "High with devastating counter-hit damage. Weave for free launch."
        },
        {
            "label": "Power mid (f+2)",
            "search": "f+2",
            "note": "Hard-hitting linear move. Fight at range 1 where your counter hits win."
        }
    ],
  },
  "Hwoarang": {
    slug: "hwoarang",
    archetype: "Flamingo kick pressure and tempo control",
    gamePlan: "Hwoarang buries you in kicks and stance switches, but most of his pressure is high-heavy and gap-riddled",
    watchFor: ["High kick from stance. Weave and duck his right-leg loops.","Gap-riddled pressure. Learn the two or three real gaps and jab them.","Launch-punishable low. Punish hard once blocked."],
    threats: [
        {
            "label": "Flamingo kick (f+3)",
            "search": "f+3",
            "note": "High kick from stance. Weave and duck his right-leg loops."
        },
        {
            "label": "Kick string (4,3)",
            "search": "4,3",
            "note": "Gap-riddled pressure. Learn the two or three real gaps and jab them."
        },
        {
            "label": "Low ender (d+4)",
            "search": "d+4",
            "note": "Launch-punishable low. Punish hard once blocked."
        }
    ],
  },
  "Jack-8": {
    slug: "jack-8",
    archetype: "Long-limb spacing and crushing damage",
    gamePlan: "Jack's arms occupy the space Steve wants to walk through, and his punishment is enormous",
    watchFor: ["Arms occupy the space you want to walk through. Sidestep linear pokes.","Slow recovery on whiff. Approach in short blocks and punish.","Round-ending mid near him. Do not duck without a read."],
    threats: [
        {
            "label": "Long poke (f+1)",
            "search": "f+1",
            "note": "Arms occupy the space you want to walk through. Sidestep linear pokes."
        },
        {
            "label": "Mid swing (f+2)",
            "search": "f+2",
            "note": "Slow recovery on whiff. Approach in short blocks and punish."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Round-ending mid near him. Do not duck without a read."
        }
    ],
  },
  "Jin": {
    slug: "jin",
    archetype: "Complete all-rounder with electric pressure",
    gamePlan: "Jin does everything well, so there is no cheese to hide behind",
    watchFor: ["Core Mishima tool. Weave under it between strings.","Low from wavedash. Launch on block without fail.","All-rounder pressure. Vary timing against his parry."],
    threats: [
        {
            "label": "Electric (f,n,d,df+2)",
            "search": "f,n,d,df+2",
            "note": "Core Mishima tool. Weave under it between strings."
        },
        {
            "label": "Hellsweep (f+4)",
            "search": "f+4",
            "note": "Low from wavedash. Launch on block without fail."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "All-rounder pressure. Vary timing against his parry."
        }
    ],
  },
  "Jun": {
    slug: "jun",
    archetype: "Sabaki-laden flow with health-cost power",
    gamePlan: "Jun's parries and sabakis punish punch-heavy offense, which sounds like a Steve nightmare until you remember his elbow and reversal-break exist. Her strings are also more punishable than they feel.",
    watchFor: ["Sabaki-laden flow that punishes punch-heavy offense.","Flow that feels plus but is punishable when finished. Learn ender punishes.","Her main kill condition. Delay string enders so parry timing whiffs."],
    threats: [
        {
            "label": "Parry (1+2)",
            "search": "1+2",
            "note": "Sabaki-laden flow that punishes punch-heavy offense."
        },
        {
            "label": "Mid string (df+1)",
            "search": "df+1",
            "note": "Flow that feels plus but is punishable when finished. Learn ender punishes."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Her main kill condition. Delay string enders so parry timing whiffs."
        }
    ],
  },
  "Kazuya": {
    slug: "kazuya",
    archetype: "Pure 50/50 wavedash intimidation",
    gamePlan: "Kazuya has the scariest mixup in the game but one of the weakest approaches",
    watchFor: ["The scariest mixup in the game. Launch blocked hellsweep — most valuable punish.","High with launch-level reward on CH. Weave under for round-swinging punish.","Other half of wavedash 50/50. Do not duck early out of fear."],
    threats: [
        {
            "label": "Hellsweep (f,n,d,df+4)",
            "search": "f,n,d,df+4",
            "note": "The scariest mixup in the game. Launch blocked hellsweep — most valuable punish."
        },
        {
            "label": "Electric (f,n,d,df+2)",
            "search": "f,n,d,df+2",
            "note": "High with launch-level reward on CH. Weave under for round-swinging punish."
        },
        {
            "label": "Mid launcher (d+2)",
            "search": "d+2",
            "note": "Other half of wavedash 50/50. Do not duck early out of fear."
        }
    ],
  },
  "King": {
    slug: "king",
    archetype: "Throw mixups and momentum bullying",
    gamePlan: "King's entire threat is conditioning you to freeze so his grabs and Jaguar Sprint bowl you over",
    watchFor: ["Signature command grab. Watch arms — break 1 or 2. Default break on setups you know.","Mid command grab that catches crouch attempts. Do not panic-duck.","Approach into grab mix. Interrupt with fast mid rather than blocking and guessing."],
    threats: [
        {
            "label": "Giant Swing (1+2)",
            "search": "1+2",
            "note": "Signature command grab. Watch arms — break 1 or 2. Default break on setups you know."
        },
        {
            "label": "Jaguar Bomb (f+1+2)",
            "search": "f+1+2",
            "note": "Mid command grab that catches crouch attempts. Do not panic-duck."
        },
        {
            "label": "Jaguar Sprint (f+1+4)",
            "search": "f+1+4",
            "note": "Approach into grab mix. Interrupt with fast mid rather than blocking and guessing."
        }
    ],
  },
  "Kuma / Panda": {
    slug: "kuma",
    archetype: "Giant hitbox with deceptive range",
    gamePlan: "The bears out-range and out-damage you in raw trades, but their giant frame makes every Steve combo and string more consistent, and their movement cannot handle disciplined mids.",
    watchFor: ["Deceptive range on a giant hitbox. Sidestep linear paws.","Big commitment. Punish on block or whiff.","Round-ending mid at their range. Keep them at range 1."],
    threats: [
        {
            "label": "Bear claw (f+1+2)",
            "search": "f+1+2",
            "note": "Deceptive range on a giant hitbox. Sidestep linear paws."
        },
        {
            "label": "Rolling bear (f+1+2)",
            "search": "f+1+2",
            "note": "Big commitment. Punish on block or whiff."
        },
        {
            "label": "Mid paw (f+2)",
            "search": "f+2",
            "note": "Round-ending mid at their range. Keep them at range 1."
        }
    ],
  },
  "Kunimitsu": {
    slug: "kunimitsu",
    archetype: "Ninja hit-and-run with kunai tricks",
    gamePlan: "Kunimitsu darts in, stabs, teleports, and leaves. Most of her gimmicks are minus or punishable once identified, and Steve's homing tools punish her constant repositioning.",
    watchFor: ["Hit-and-run poke from backturn. Weave high approach pokes.","Minus once identified. Block first, then punish.","Gimmick entry. Block until you know which follow-ups are real."],
    threats: [
        {
            "label": "Backturn stab (BT.1)",
            "search": "BT.1",
            "note": "Hit-and-run poke from backturn. Weave high approach pokes."
        },
        {
            "label": "Teleport follow-up (df+1)",
            "search": "df+1",
            "note": "Minus once identified. Block first, then punish."
        },
        {
            "label": "Flip mix (b+3)",
            "search": "b+3",
            "note": "Gimmick entry. Block until you know which follow-ups are real."
        }
    ],
  },
  "Lars": {
    slug: "lars",
    archetype: "Burst offense through stance entries",
    gamePlan: "Lars surges in with Silent Entry and Dynamic Entry transitions that look overwhelming but are frequently interruptible or minus",
    watchFor: ["Stance entry that looks overwhelming. Jab or b+1 interruptible ones.","Dynamic Entry offense. Block and punish unsafe enders.","Committal mid from stance. Know which entries are genuinely plus."],
    threats: [
        {
            "label": "Silent Entry (f+2,1)",
            "search": "f+2,1",
            "note": "Stance entry that looks overwhelming. Jab or b+1 interruptible ones."
        },
        {
            "label": "Burst string (f+2)",
            "search": "f+2",
            "note": "Dynamic Entry offense. Block and punish unsafe enders."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Committal mid from stance. Know which entries are genuinely plus."
        }
    ],
  },
  "Law": {
    slug: "law",
    archetype: "Dragon sign flow and slide mixups",
    gamePlan: "Law's DSS flow and junkyard strings punish impatience, and his punch parry directly targets Steve's offense. The counters exist, but you have to actually use them.",
    watchFor: ["DSS flow entry. Mix PAB df+2 elbow once he shows parry attempts.","Junkyard mixup tool. React at range — do not pre-emptively crouch.","Plus-on-block DSS mids. Respect, then counter."],
    threats: [
        {
            "label": "Dragon sign (f+1+2)",
            "search": "f+1+2",
            "note": "DSS flow entry. Mix PAB df+2 elbow once he shows parry attempts."
        },
        {
            "label": "Slide (f+3)",
            "search": "f+3",
            "note": "Junkyard mixup tool. React at range — do not pre-emptively crouch."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Plus-on-block DSS mids. Respect, then counter."
        }
    ],
  },
  "Lee": {
    slug: "lee",
    archetype: "Precision keepout and just-frame execution",
    gamePlan: "Lee wants perfect spacing where his kicks and acid rain punish everything. His up-close defense and damage without walls are much weaker — Steve should turn this into a phone-booth fight.",
    watchFor: ["Precision keepout. Do not backdash predictably — he farms retreat.","Stance low to punish. Punish on block at range 0.","Range control tool. Weave high kick keepout on approach."],
    threats: [
        {
            "label": "Acid rain (f+2,1)",
            "search": "f+2,1",
            "note": "Precision keepout. Do not backdash predictably — he farms retreat."
        },
        {
            "label": "Hitman low (d+2)",
            "search": "d+2",
            "note": "Stance low to punish. Punish on block at range 0."
        },
        {
            "label": "Kick check (f+3)",
            "search": "f+3",
            "note": "Range control tool. Weave high kick keepout on approach."
        }
    ],
  },
  "Leo": {
    slug: "leo",
    archetype: "Solid mids with stance layering",
    gamePlan: "Leo's fundamentals mirror Steve's: strong mids, stance pressure, few weaknesses. Neither side gets gimmicks here, so the counter-hit war and wall control decide it.",
    watchFor: ["Stance layering with lows. Block through KNK first — guessing early feeds the stance.","Honest fundamentals mirror Steve's. Contest mid-range with df+2 and qcf+1.","Strong mid — stand block is safer than ducking here."],
    threats: [
        {
            "label": "KNK stance (KNK.2)",
            "search": "KNK.2",
            "note": "Stance layering with lows. Block through KNK first — guessing early feeds the stance."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Honest fundamentals mirror Steve's. Contest mid-range with df+2 and qcf+1."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Strong mid — stand block is safer than ducking here."
        }
    ],
  },
  "Leroy": {
    slug: "leroy",
    archetype: "Parry-centric counter fighting",
    gamePlan: "Leroy's parry directly answers punch offense, which makes lazy Steve play miserable. But Steve owns the cleanest parry counters in the game, and Leroy without parry momentum is just a slower poker.",
    watchFor: ["His entire gameplan. Do not feed the same string twice.","Low from sway-back. Punish committal strings on block.","Slow poker when parry is not working. Weave his high pokes."],
    threats: [
        {
            "label": "Parry (df+1)",
            "search": "df+1",
            "note": "His entire gameplan. Do not feed the same string twice."
        },
        {
            "label": "Sway low (d+2)",
            "search": "d+2",
            "note": "Low from sway-back. Punish committal strings on block."
        },
        {
            "label": "Mid poke (b+1)",
            "search": "b+1",
            "note": "Slow poker when parry is not working. Weave his high pokes."
        }
    ],
  },
  "Lidia": {
    slug: "lidia",
    archetype: "Karate stance 50/50s with heavy commitment",
    gamePlan: "Lidia's cat stance mixups and power crush stance make her terrifying to guess against, but nearly everything she commits to is punishable when read. Discipline beats aggression here.",
    watchFor: ["50/50 stance mix. Default to blocking mid and punish lows you catch.","Armoured mid. Do not press into it without a mid ready.","Unsafe on block when read. Her mids hurt more than her lows."],
    threats: [
        {
            "label": "Cat stance (df+1)",
            "search": "df+1",
            "note": "50/50 stance mix. Default to blocking mid and punish lows you catch."
        },
        {
            "label": "Power crush (b+1)",
            "search": "b+1",
            "note": "Armoured mid. Do not press into it without a mid ready."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Unsafe on block when read. Her mids hurt more than her lows."
        }
    ],
  },
  "Lili": {
    slug: "lili",
    archetype: "Evasive flips and whiff-punish royalty",
    gamePlan: "Lili converts your missed buttons into full combos better than almost anyone, and her flips make chasing feel useless. The fix is unglamorous: whiff less, block more, punish her risk-taking.",
    watchFor: ["Flip commitment she converts on whiff. Punish on block or landing.","Acrobatic mix entry. Block first, label it, then punish.","Safe pressure. Play tight, short pokes — she feeds on your whiffs."],
    threats: [
        {
            "label": "Matterhorn (f+2)",
            "search": "f+2",
            "note": "Flip commitment she converts on whiff. Punish on block or landing."
        },
        {
            "label": "Dew glide (f+3)",
            "search": "f+3",
            "note": "Acrobatic mix entry. Block first, label it, then punish."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Safe pressure. Play tight, short pokes — she feeds on your whiffs."
        }
    ],
  },
  "Miary Zo": {
    slug: "miary-zo",
    archetype: "Spirit-powered stance shifting",
    gamePlan: "Miary Zo cycles through empowered states and unfamiliar stance rhythms that most players simply have not labbed yet. Treat her like every new-generation stance character: block first, learn which transitions are real, and tax her entries with counter hits.",
    watchFor: ["Unfamiliar stance rhythm. Block first rounds and bank which enders are minus.","Buffed state move with real recovery. Punish on block.","Committal kill tool. Pressure her the moment she buffs."],
    threats: [
        {
            "label": "Spirit stance (df+1)",
            "search": "df+1",
            "note": "Unfamiliar stance rhythm. Block first rounds and bank which enders are minus."
        },
        {
            "label": "Empowered mid (f+2)",
            "search": "f+2",
            "note": "Buffed state move with real recovery. Punish on block."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Committal kill tool. Pressure her the moment she buffs."
        }
    ],
  },
  "Nina": {
    slug: "nina",
    archetype: "Frame-tight pressure with evasive weaving",
    gamePlan: "Nina's blonde-bomb pressure, ss1 evasion, and wall loops make her one of the scariest offensive characters alive",
    watchFor: ["Frame-tight pressure. Take your turn after minus strings.","Evasive approach tool — contest with homing LNH 1.","Wall loop starter. Fight for centre stage."],
    threats: [
        {
            "label": "Blonde bomb (df+1)",
            "search": "df+1",
            "note": "Frame-tight pressure. Take your turn after minus strings."
        },
        {
            "label": "Sidestep kick (f+3)",
            "search": "f+3",
            "note": "Evasive approach tool — contest with homing LNH 1."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Wall loop starter. Fight for centre stage."
        }
    ],
  },
  "Paul": {
    slug: "paul",
    archetype: "Deathfist deterrence and demolition mixups",
    gamePlan: "Paul's damage is legendary but nearly all of it rides on committal, punishable moves",
    watchFor: ["Round-erasing swing. Block and punish hard every single time.","Committal entry. Counter hit with b+1.","Launch-punishable low. Punish without mercy on block."],
    threats: [
        {
            "label": "Deathfist (qcf+2)",
            "search": "qcf+2",
            "note": "Round-erasing swing. Block and punish hard every single time."
        },
        {
            "label": "Demolition Man (f+2)",
            "search": "f+2",
            "note": "Committal entry. Counter hit with b+1."
        },
        {
            "label": "Sweep (d+2)",
            "search": "d+2",
            "note": "Launch-punishable low. Punish without mercy on block."
        }
    ],
  },
  "Raven": {
    slug: "raven",
    archetype: "Teleport trickery and back-turn shenanigans",
    gamePlan: "Raven's clones, teleports, and back-turn stance sell an illusion of safety that mostly is not real",
    watchFor: ["Stance that sells safety. Hit it with quick mids — do not stand next to it respectfully.","Minus once labbed. Hold position when he teleports.","Theatre to make you swing at air. Block first, always."],
    threats: [
        {
            "label": "Backturn (BT.1)",
            "search": "BT.1",
            "note": "Stance that sells safety. Hit it with quick mids — do not stand next to it respectfully."
        },
        {
            "label": "Teleport follow-up (qcf+1)",
            "search": "qcf+1",
            "note": "Minus once labbed. Hold position when he teleports."
        },
        {
            "label": "Clone approach (df+1)",
            "search": "df+1",
            "note": "Theatre to make you swing at air. Block first, always."
        }
    ],
  },
  "Reina": {
    slug: "reina",
    archetype: "Mishima mix with Sentai stance flow",
    gamePlan: "Reina blends electric pressure with Sentai stance transitions that punish passive blocking. She is at her best when you freeze and at her worst when you contest her entries with fast buttons.",
    watchFor: ["Mishima mix low. Launch on block.","Weave under for free launch.","Flow that punishes passive blocking. Interrupt with jabs and b+1."],
    threats: [
        {
            "label": "Hellsweep (f+4)",
            "search": "f+4",
            "note": "Mishima mix low. Launch on block."
        },
        {
            "label": "Electric (f,n,d,df+2)",
            "search": "f,n,d,df+2",
            "note": "Weave under for free launch."
        },
        {
            "label": "Sentai stance (df+1)",
            "search": "df+1",
            "note": "Flow that punishes passive blocking. Interrupt with jabs and b+1."
        }
    ],
  },
  "Shaheen": {
    slug: "shaheen",
    archetype: "Honest mids with a slide wildcard",
    gamePlan: "Shaheen fights clean: great mids, solid pokes, and the snake-step slide as his one trick. Steve simply has better counter-hit tools in the same weight class, so the fundamentals fight leans your way.",
    watchFor: ["His one trick slide. React at range and block for full launch punish.","Honest keepout. Out-poke with b+1 and df+2 in the CH war.","Solid check button. Weave high pokes between his turns."],
    threats: [
        {
            "label": "Snake step (b+4)",
            "search": "b+4",
            "note": "His one trick slide. React at range and block for full launch punish."
        },
        {
            "label": "Mid poke (df+1)",
            "search": "df+1",
            "note": "Honest keepout. Out-poke with b+1 and df+2 in the CH war."
        },
        {
            "label": "Kick (f+3)",
            "search": "f+3",
            "note": "Solid check button. Weave high pokes between his turns."
        }
    ],
  },
  "Steve (mirror)": {
    slug: "steve",
    archetype: "The knowledge war",
    gamePlan: "The mirror is a test of who actually understands Steve's weaknesses",
    watchFor: ["Backbone of mirror pressure. Duck flicker highs on read.","Launch punish on block — never let the low loop start.","His best neutral button. Sidestep left and duck option-selects your offense too."],
    threats: [
        {
            "label": "Flicker jab (FLK.1)",
            "search": "FLK.1",
            "note": "Backbone of mirror pressure. Duck flicker highs on read."
        },
        {
            "label": "Low loop (db+3,2)",
            "search": "db+3,2",
            "note": "Launch punish on block — never let the low loop start."
        },
        {
            "label": "Counter-hit jab (b+1)",
            "search": "b+1",
            "note": "His best neutral button. Sidestep left and duck option-selects your offense too."
        }
    ],
  },
  "Victor": {
    slug: "victor",
    archetype: "Iai flash offense with stance loops",
    gamePlan: "Victor's perfumer stance and sword dashes look overwhelming, but his pressure is riddled with duckable highs and minus transitions. Once labbed, Steve turns his flash into launch practice.",
    watchFor: ["Flash stance flow. Duck known high enders for full launches.","Linear sword commitment. Sidestep rather than blocking passively.","Minus transition once labbed. Interrupt with jabs where not plus."],
    threats: [
        {
            "label": "Perfumer stance (df+1)",
            "search": "df+1",
            "note": "Flash stance flow. Duck known high enders for full launches."
        },
        {
            "label": "Iai dash (f+2)",
            "search": "f+2",
            "note": "Linear sword commitment. Sidestep rather than blocking passively."
        },
        {
            "label": "Launcher (df+2)",
            "search": "df+2",
            "note": "Minus transition once labbed. Interrupt with jabs where not plus."
        }
    ],
  },
  "Xiaoyu": {
    slug: "xiaoyu",
    archetype: "AOP evasion and scrambling chaos",
    gamePlan: "Art of Phoenix ducks under Steve's beloved highs, which deletes half your usual offense. The matchup flips once you commit to a mid-heavy game plan and stop feeding her evasion.",
    watchFor: ["Ducks under your highs. Go mid-first — qcf+1, df+2, d+2,1 all tag AOP.","Low from AOP. Punish on block.","Scramble tool. Keep her at range 1 where scramble needs closeness."],
    threats: [
        {
            "label": "Art of Phoenix (AOP.1)",
            "search": "AOP.1",
            "note": "Ducks under your highs. Go mid-first — qcf+1, df+2, d+2,1 all tag AOP."
        },
        {
            "label": "Hypnotist low (d+4)",
            "search": "d+4",
            "note": "Low from AOP. Punish on block."
        },
        {
            "label": "Flip (b+3)",
            "search": "b+3",
            "note": "Scramble tool. Keep her at range 1 where scramble needs closeness."
        }
    ],
  },
  "Yoshimitsu": {
    slug: "yoshimitsu",
    archetype: "Gimmick arsenal and flash punishment",
    gamePlan: "Yoshimitsu owns the game's strangest toolkit: flash, sword unblockables, self-damage stances. None of it survives an opponent who blocks first and refuses to press into flash range.",
    watchFor: ["Gimmick stance. Block and identify before pressing.","Beats buttons at point-blank. Never press immediately after blocked strings.","Unblockable attempts and commitments. Punish with full launches."],
    threats: [
        {
            "label": "Backturn (BT.1)",
            "search": "BT.1",
            "note": "Gimmick stance. Block and identify before pressing."
        },
        {
            "label": "Flash (b+1+2)",
            "search": "b+1+2",
            "note": "Beats buttons at point-blank. Never press immediately after blocked strings."
        },
        {
            "label": "Sword (f+2)",
            "search": "f+2",
            "note": "Unblockable attempts and commitments. Punish with full launches."
        }
    ],
  },
  "Zafina": {
    slug: "zafina",
    archetype: "Low-profile stances and creeping chip",
    gamePlan: "Zafina's stances low-profile highs and her Azazel arm chips you constantly. Steve needs the same fix as against Xiaoyu: lead with mids and punish her stance lows on block.",
    watchFor: ["Low-profile posture chip. Feed stances mids — qcf+1 and d+2,1 tag them.","Launch-punishable stance low. Punish every time.","Costs her own health. Pressure her life bar directly."],
    threats: [
        {
            "label": "Stance mid (df+1)",
            "search": "df+1",
            "note": "Low-profile posture chip. Feed stances mids — qcf+1 and d+2,1 tag them."
        },
        {
            "label": "Tarantula low (d+2)",
            "search": "d+2",
            "note": "Launch-punishable stance low. Punish every time."
        },
        {
            "label": "Azazel arm (f+2)",
            "search": "f+2",
            "note": "Costs her own health. Pressure her life bar directly."
        }
    ],
  },
};

export function getOpponentProfile(name: string): OpponentProfile | null {
  return OPPONENT_PROFILES[name] ?? OPPONENT_PROFILES[name.replace(/\s*\(mirror\)$/u, "").trim()] ?? null;
}
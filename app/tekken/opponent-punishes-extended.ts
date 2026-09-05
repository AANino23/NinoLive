import type { OpponentPunishableMove } from "./punishment-data";

/** Extra minus-on-block entries merged into every matchup punish chart. */
export const EXTRA_OPPONENT_PUNISHES: Record<string, OpponentPunishableMove[]> = {
  "Alisa": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick. Block and launch — her default reach tool."
    },
    {
      "move": "b+3 (Boot)",
      "minus": 14,
      "note": "Backdash punisher. Do not chase her with dashing highs."
    },
    {
      "move": "DES.2",
      "minus": 14,
      "note": "Chainsaw swing. Stand block, then jab interrupt or punish."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Committed mid from destruct form approach."
    },
    {
      "move": "d+4",
      "minus": 14,
      "crouching": true,
      "note": "Fast low in chainsaw flow — punish from crouch."
    }
  ],
  "Anna": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick she throws out constantly. Block, launch."
    },
    {
      "move": "db+4",
      "minus": 26,
      "crouching": true,
      "note": "Chaos low — enormous punish on block."
    },
    {
      "move": "qcf+2,1",
      "minus": 16,
      "note": "Artemis Arrow. Two mids — block both, then launch."
    },
    {
      "move": "d+4",
      "minus": 14,
      "crouching": true,
      "note": "Fast low in her 50/50 layers."
    },
    {
      "move": "ws2",
      "minus": 17,
      "note": "While-standing launcher. Punish when blocked."
    }
  ],
  "Armor King": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick. Standard launch punish on block."
    },
    {
      "move": "1+2 (Giant Swing)",
      "minus": 21,
      "note": "Command grab attempt — break it, do not eat it."
    },
    {
      "move": "f+1+2",
      "minus": 19,
      "note": "Dark Upper grab setup. Sidestep after blocking linear approach."
    },
    {
      "move": "b+1+2",
      "minus": 19,
      "note": "Shoulder into grab range. Punish, do not freeze."
    },
    {
      "move": "d+2,4",
      "minus": 14,
      "note": "Mid string ender. Block both hits, then punish."
    }
  ],
  "Asuka": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick. Respect it, block, launch."
    },
    {
      "move": "df+1,4",
      "minus": 14,
      "note": "String ender. Minus enough for your jab punish."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Mid poke she uses to keep space."
    },
    {
      "move": "3+4",
      "minus": 16,
      "note": "Can-can launcher on block — free turn."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low chop in pressure. Punish from crouch."
    }
  ],
  "Azucena": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick from Libertador flow."
    },
    {
      "move": "f+2",
      "minus": 17,
      "note": "Running attack. Punish on block instead of retreating."
    },
    {
      "move": "f+2,1,4",
      "minus": 14,
      "note": "Danza Del Cóndor. Block the full string, then answer."
    },
    {
      "move": "LIB.d+4",
      "minus": 31,
      "crouching": true,
      "note": "Stance low — already in chart; block low every time."
    },
    {
      "move": "b+1",
      "minus": 14,
      "note": "Mid check. Contest with your own timing."
    }
  ],
  "Bryan": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick. Block and launch."
    },
    {
      "move": "f+2,1 (Hatchet)",
      "minus": 17,
      "note": "Keepout kick string. Block both, launch."
    },
    {
      "move": "b+4 (Snake Edge)",
      "minus": 26,
      "crouching": true,
      "note": "Slow sweep — the classic launch punish."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Long keepout kick. Weave on approach."
    },
    {
      "move": "DF+1,2",
      "minus": 15,
      "note": "Double Body Blow. His df+1 string ender — launch it."
    }
  ],
  "Claudio": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — his main whiff punish tool."
    },
    {
      "move": "b+4",
      "minus": 18,
      "note": "Starburst launcher. Scary on CH, minus on block."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "Honest string ender."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Approach mid with heavy recovery."
    },
    {
      "move": "d+4",
      "minus": 13,
      "crouching": true,
      "note": "One of his few lows — punish from crouch."
    }
  ],
  "Clive": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick at sword range."
    },
    {
      "move": "df+1",
      "minus": 11,
      "note": "Safe poke — not launch punishable, but note the range."
    },
    {
      "move": "f+2,1",
      "minus": 16,
      "note": "Sword swing string ender."
    },
    {
      "move": "GAR.1",
      "minus": 14,
      "note": "Garuda stance poke. Block, punish."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low from stance transition."
    }
  ],
  "Devil Jin": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Mid launcher half of the wavedash 50/50."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender. Do not duck early."
    },
    {
      "move": "b+3",
      "minus": 18,
      "note": "Range mid poke — punish every block."
    },
    {
      "move": "f+4",
      "minus": 23,
      "crouching": true,
      "note": "Hellsweep variant — block low, launch."
    },
    {
      "move": "ws2",
      "minus": 18,
      "note": "While-standing launcher on block."
    }
  ],
  "Dragunov": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Plus mid in many situations — respect, then punish when minus."
    },
    {
      "move": "f+2",
      "minus": 17,
      "note": "Running mid. Sidestep instead of backdash."
    },
    {
      "move": "d+2",
      "minus": 16,
      "crouching": true,
      "note": "Committal sweep — ws launch punish."
    },
    {
      "move": "df+1,4",
      "minus": 14,
      "note": "String ender off df+1."
    },
    {
      "move": "WR.F+3",
      "minus": 15,
      "crouching": true,
      "note": "Chernobog Sweep. His running low — block it and punish from crouch."
    }
  ],
  "Eddy": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Capoeira mid — stand block when unsure."
    },
    {
      "move": "d+4 (Negativa)",
      "minus": 14,
      "crouching": true,
      "note": "Ground stance low — tag with mids on reaction."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Handstand transition mid."
    },
    {
      "move": "RLX.4",
      "minus": 18,
      "crouching": true,
      "note": "Relax stance low ender."
    },
    {
      "move": "b+3,3",
      "minus": 15,
      "note": "Knee Thruster into Relâmpago. Block through, then answer."
    }
  ],
  "Fahkumram": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Plus kick — respect frames, punish when actually minus."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Knee keepout. Weave under on approach."
    },
    {
      "move": "b+4",
      "minus": 15,
      "note": "Committal mid launcher on block."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender at limb range."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Fast low in close range mix."
    }
  ],
  "Feng": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — whiff punish his sway swings."
    },
    {
      "move": "f+3,4",
      "minus": 16,
      "note": "Climbing Dragon. Committed mid string — launch it."
    },
    {
      "move": "d+2",
      "minus": 16,
      "crouching": true,
      "note": "Sweep from kenpo step."
    },
    {
      "move": "f+2,1,2",
      "minus": 19,
      "note": "Boar's Tusk string — block all three, launch."
    },
    {
      "move": "ws3",
      "minus": 21,
      "note": "While-standing kick — punish on block."
    }
  ],
  "Heihachi": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Mid launcher in wavedash mix."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender. Weave highs between strings."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Power mid approach."
    },
    {
      "move": "f+4",
      "minus": 23,
      "crouching": true,
      "note": "Hellsweep — block low, launch."
    },
    {
      "move": "b+2",
      "minus": 14,
      "note": "High ender — duck for whiff punish option."
    }
  ],
  "Hwoarang": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick from flamingo."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Flamingo kick check."
    },
    {
      "move": "4,3",
      "minus": 14,
      "note": "Kick string — learn the real gaps, jab them."
    },
    {
      "move": "RFS.f+3",
      "minus": 17,
      "note": "Right flamingo approach kick."
    },
    {
      "move": "d+3",
      "minus": 14,
      "crouching": true,
      "note": "Low ender in flamingo flow."
    }
  ],
  "Jack-8": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick at arm range."
    },
    {
      "move": "f+1",
      "minus": 12,
      "note": "Long poke — not launch punishable, but note the space it takes."
    },
    {
      "move": "f+2",
      "minus": 19,
      "note": "Slow mid swing — whiff and block punishes."
    },
    {
      "move": "df+3+4",
      "minus": 23,
      "note": "Dump truck mid — free launch on block."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low at close range."
    }
  ],
  "Jin": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Mid in wavedash mix — do not duck early."
    },
    {
      "move": "1,2,1",
      "minus": 16,
      "note": "Black Wing Rondo ender. Block the jab string out, then launch."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Range mid poke."
    },
    {
      "move": "b+3",
      "minus": 18,
      "note": "Committed mid — punish on block."
    },
    {
      "move": "f+4",
      "minus": 23,
      "crouching": true,
      "note": "Hellsweep — block low, punish from crouch."
    }
  ],
  "Jun": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Launcher she fishes with."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "Flow string ender — often minus when finished."
    },
    {
      "move": "b+3",
      "minus": 19,
      "note": "Range mid wheel kick."
    },
    {
      "move": "d+3+4",
      "minus": 25,
      "crouching": true,
      "note": "Double low — block low, launch."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Committed mid in genjitsu flow."
    }
  ],
  "Kazuya": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Mid half of wavedash 50/50."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender. Vary timing vs parry."
    },
    {
      "move": "b+3",
      "minus": 18,
      "note": "Range mid poke."
    },
    {
      "move": "db+1,2",
      "minus": 19,
      "note": "String ender — block both hits, launch."
    },
    {
      "move": "ws2",
      "minus": 18,
      "note": "While-standing launcher on block."
    }
  ],
  "King": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — break throws first, but punish this too."
    },
    {
      "move": "1+2",
      "minus": 21,
      "note": "Giant Swing — break 1 or 2, do not eat it."
    },
    {
      "move": "f+1+2",
      "minus": 19,
      "note": "Jaguar Bomb grab — do not panic duck."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender when he has to strike."
    },
    {
      "move": "b+1+2",
      "minus": 19,
      "note": "Shoulder into grab mix."
    }
  ],
  "Kuma / Panda": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick from bear range."
    },
    {
      "move": "f+1+2",
      "minus": 19,
      "note": "Rolling bear approach — punish landing."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Fast low in hunting stance."
    },
    {
      "move": "f+2",
      "minus": 19,
      "note": "Mid paw — keep them at range 1."
    }
  ],
  "Kunimitsu": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick on re-entry."
    },
    {
      "move": "b+3,4",
      "minus": 20,
      "note": "Flip ender — block both hits."
    },
    {
      "move": "BT.1",
      "minus": 14,
      "note": "Backturn stab — press with mids, do not respect the stance."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender after teleport."
    },
    {
      "move": "db+3,3",
      "minus": 19,
      "crouching": true,
      "note": "Sweep repeat in her hit-and-run flow. Punish from crouch."
    }
  ],
  "Lars": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Launcher from stance entries."
    },
    {
      "move": "f+2,1",
      "minus": 16,
      "note": "Silent Entry string — jab interruptible gaps."
    },
    {
      "move": "df+3,3",
      "minus": 15,
      "note": "Outpost Blitz. Mid string ender."
    },
    {
      "move": "d+1+2",
      "minus": 20,
      "crouching": true,
      "note": "Charging low — punish from crouch."
    },
    {
      "move": "f+1+4",
      "minus": 18,
      "note": "Power slug mid on block."
    }
  ],
  "Law": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — duck DSS highs on read."
    },
    {
      "move": "f+3 (Slide)",
      "minus": 23,
      "crouching": true,
      "note": "Junkyard slide — block low, ws launch."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender vs parry — vary timing."
    },
    {
      "move": "f+1+2",
      "minus": 19,
      "note": "Dragon sign entry."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "DSS low ender."
    }
  ],
  "Lee": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick in hitman flow."
    },
    {
      "move": "f+2,1",
      "minus": 17,
      "note": "Acid rain keepout — do not backdash predictably."
    },
    {
      "move": "f+3,3",
      "minus": 18,
      "note": "Two mids from his kick flow. Block both and launch."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Hitman low."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Kick check at his spacing."
    }
  ],
  "Leo": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — fundamentals mirror."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender."
    },
    {
      "move": "KNK.2",
      "minus": 14,
      "note": "Stance mid — block through KNK first."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Stance low layer."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Committed mid."
    }
  ],
  "Leroy": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — do not feed parry twice."
    },
    {
      "move": "df+1",
      "minus": 11,
      "note": "Parry stance — vary timing, do not autopilot strings."
    },
    {
      "move": "df+2,1+2",
      "minus": 18,
      "note": "Rising dragons string ender."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Sway low."
    },
    {
      "move": "f+3,1+2,4",
      "minus": 16,
      "note": "Mid string ender — punish rather than pressing."
    }
  ],
  "Lidia": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — block mid first in stance mix."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender."
    },
    {
      "move": "HRS.1+2",
      "minus": 18,
      "crouching": true,
      "note": "Horse stance low chop."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Power crush or mid commitment."
    },
    {
      "move": "d+4",
      "minus": 14,
      "crouching": true,
      "note": "Cat stance low layer."
    }
  ],
  "Lili": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — whiff less, block more."
    },
    {
      "move": "f+2",
      "minus": 19,
      "note": "Matterhorn flip — punish on block."
    },
    {
      "move": "f+2,3",
      "minus": 15,
      "note": "Mars Sword. High into mid — block, then launch."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Dew glide entry."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low in acrobatic flow."
    }
  ],
  "Miary Zo": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick from spirit stance."
    },
    {
      "move": "df+1,1,1+2",
      "minus": 17,
      "note": "Tandrokin'ny Ala. The df+1 string ender — launch it."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Empowered mid when buffed."
    },
    {
      "move": "BAO.4",
      "minus": 24,
      "crouching": true,
      "note": "Bao stance low. Huge punish from crouch."
    },
    {
      "move": "f+1+2,1+2,3+4",
      "minus": 22,
      "note": "Long string ender — block all of it."
    }
  ],
  "Nina": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — fight for centre stage."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "Blonde bomb string ender."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Sidestep kick approach."
    },
    {
      "move": "d+4",
      "minus": 14,
      "crouching": true,
      "note": "Fast low in pressure."
    },
    {
      "move": "b+3",
      "minus": 18,
      "note": "Backflip kick on block."
    }
  ],
  "Paul": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — deathfist is the real tax, but punish this too."
    },
    {
      "move": "qcf+2",
      "minus": 17,
      "note": "Deathfist — block and launch every time."
    },
    {
      "move": "f+2",
      "minus": 17,
      "note": "Demolition man approach."
    },
    {
      "move": "d+1,2",
      "minus": 17,
      "note": "Phoenix Smasher ender. Block the mid string, then launch."
    },
    {
      "move": "b+4",
      "minus": 14,
      "note": "High ender — duck option available."
    }
  ],
  "Raven": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick through the theatre."
    },
    {
      "move": "df+2,4",
      "minus": 15,
      "note": "Bolt Stunner. Mid string ender — hold position on teleport."
    },
    {
      "move": "BT.1",
      "minus": 14,
      "note": "Backturn poke — press with mids."
    },
    {
      "move": "qcf+1",
      "minus": 16,
      "note": "Teleport follow-up once labbed."
    },
    {
      "move": "d+3",
      "minus": 18,
      "crouching": true,
      "note": "Shinobi cyclone low."
    }
  ],
  "Reina": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Mid in Mishima-style mix."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender."
    },
    {
      "move": "f+4",
      "minus": 23,
      "crouching": true,
      "note": "Hellsweep — block low, launch."
    },
    {
      "move": "SEN.3+4",
      "minus": 29,
      "crouching": true,
      "note": "Sentai sweep — full combo on block."
    },
    {
      "move": "f+2",
      "minus": 16,
      "note": "Sentai entry mid."
    }
  ],
  "Shaheen": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick in poke war."
    },
    {
      "move": "df+4,1,3",
      "minus": 13,
      "note": "Al-Faras. Three mids — block the full string, then answer."
    },
    {
      "move": "b+4",
      "minus": 15,
      "note": "Snake step slide — react at range."
    },
    {
      "move": "f+3",
      "minus": 16,
      "note": "Kick check button."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low in close range."
    }
  ],
  "Steve": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — mirror discipline."
    },
    {
      "move": "FLK.1",
      "minus": 12,
      "note": "Flicker jab — not launch punishable, but note the pressure."
    },
    {
      "move": "db+3,2",
      "minus": 18,
      "crouching": true,
      "note": "Low loop — launch punish on block."
    },
    {
      "move": "qcf+2",
      "minus": 18,
      "crouching": true,
      "note": "Low cross blaster."
    },
    {
      "move": "b+1",
      "minus": 14,
      "note": "Counter-hit jab — sidestep left, duck option-select."
    }
  ],
  "Victor": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick from perfumer flow."
    },
    {
      "move": "f+2,2",
      "minus": 15,
      "note": "Two highs. Duck the second and launch him for free."
    },
    {
      "move": "IAI.d+1+2",
      "minus": 29,
      "crouching": true,
      "note": "Stance low — block low, full combo."
    },
    {
      "move": "f+2",
      "minus": 17,
      "note": "Iai dash linear commitment."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Low in stance transition."
    }
  ],
  "Xiaoyu": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — go mid-first vs AOP."
    },
    {
      "move": "AOP.1",
      "minus": 12,
      "note": "Phoenix stance jab — not launch punishable, but ducks your highs."
    },
    {
      "move": "df+3",
      "minus": 23,
      "crouching": true,
      "note": "Phoenix tail low — punish from crouch."
    },
    {
      "move": "f+3,1,4",
      "minus": 22,
      "note": "Mid string ender."
    },
    {
      "move": "d+4",
      "minus": 14,
      "crouching": true,
      "note": "Hypnotist low from AOP."
    }
  ],
  "Yoshimitsu": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick in the chaos."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender — block first, identify."
    },
    {
      "move": "b+1+2",
      "minus": 20,
      "note": "Flash at point-blank — do not press after blocked strings."
    },
    {
      "move": "BT.1",
      "minus": 14,
      "note": "Backturn gimmick — block and punish."
    },
    {
      "move": "d+3",
      "minus": 18,
      "crouching": true,
      "note": "Low sweep in flow."
    }
  ],
  "Zafina": [
    {
      "move": "df+2",
      "minus": 15,
      "note": "Hopkick — mids beat her stances."
    },
    {
      "move": "df+1,2",
      "minus": 14,
      "note": "String ender."
    },
    {
      "move": "MNT.4",
      "minus": 18,
      "crouching": true,
      "note": "Mantis stance low."
    },
    {
      "move": "SCR.4",
      "minus": 18,
      "note": "Scarecrow mid on block."
    },
    {
      "move": "d+2",
      "minus": 14,
      "crouching": true,
      "note": "Tarantula low layer."
    }
  ]
};
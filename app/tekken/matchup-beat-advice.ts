import type { GuideCharacterId } from "./punishment-data";

export type BeatAdviceSection = { title: string; body: string };

const STEVE_BEAT_ADVICE: Record<string, BeatAdviceSection[]> = {
  "Alisa": [
    {
      "title": "Respecting DES without freezing",
      "body": "Alisa players want you to panic when chainsaws come out. Stand block the first swing, note whether it is minus, then either jab interrupt or back off with ub+3. Do not challenge DES with highs — they trade badly and she recovers into more stance."
    },
    {
      "title": "Counter-hit fishing beats her drift",
      "body": "Walk her down with b+1 and df+2 instead of chasing backdashes. Her movement is floaty enough that your counter-hit tools connect when she tries to reposition. Once she stops respecting your mids, LNH 1 homing shuts down sidestep habits."
    }
  ],
  "Anna": [
    {
      "title": "Surviving the first two rounds",
      "body": "Anna wins by tilting you into mashing. Eat a low or two early, start blocking down on her rhythm, then punish every committal opener. Her defense is far weaker than her offense — force her to block and the round flips."
    },
    {
      "title": "Weave after blocked highs",
      "body": "Much of Anna's pressure is high-heavy. After blocking a plus-looking string, weave instead of pressing back immediately. You slip enders cleanly and land counter hits she is not expecting from a defensive player."
    }
  ],
  "Armor King": [
    {
      "title": "Throw-break discipline",
      "body": "This matchup is a throw-break exam. Default to breaking 1+2 on Giant Swing setups you recognise. Even breaking half his grabs removes most of his damage. When you hard-read a grab, duck and launch — command grabs are mostly highs."
    },
    {
      "title": "Never stand still at range 0",
      "body": "Armor King wants you frozen so he can loop grabs. Use ub+3 to create space, qcf+1 to keep him out of grab range, and win the mid-range counter-hit war with b+1 and df+2. Cornering yourself is how he ends rounds."
    }
  ],
  "Asuka": [
    {
      "title": "Elbow and reversal-break answers",
      "body": "Feed her parry once, then switch to PAB df+2 — elbows cannot be parried and launch. LNH 1+2 reversal-breaks her defensive posture for a full combo. Vary string timing so parry attempts whiff into your counter hit."
    },
    {
      "title": "Make her whiff, then punish",
      "body": "Asuka's big swings have heavy recovery. Block her CH strings, let her swing, and whiff punish. Her defense is built around punishing your mistakes — give her fewer mistakes to punish."
    }
  ],
  "Azucena": [
    {
      "title": "Mid-check her approach",
      "body": "Libertador low-profiles your highs. Check her approach with df+2 and qcf+1 — mids beat her stance ducking where b+1 whiffs. When she enters Libertador, back off with ub+3 instead of feeding it a high."
    },
    {
      "title": "Homing shuts down drift",
      "body": "Azucena runs at you laterally. LNH 1 homing catches her constant repositioning. Once she respects your mids and stands still, b+1 wins the counter-hit exchange."
    }
  ],
  "Bryan": [
    {
      "title": "Closing distance safely",
      "body": "Bryan wins at kick range. Advance in small steps behind block — never run straight in. Once inside, stay inside with jab strings and stance pressure so he cannot reset to keepout. Heat bridges the gap when you need to force a mistake."
    },
    {
      "title": "Weave is your best friend",
      "body": "Weave slips a shocking amount of Bryan's wall of highs and jabs during his turn. Combine weave exits with ub+3 to bait whiff-punish attempts, then punish him back."
    }
  ],
  "Claudio": [
    {
      "title": "Stand block wins the low war",
      "body": "Claudio's low game is famously weak. Stand block by default and his damage drops sharply. Rush him after he spends Starburst — his threat level falls off a cliff once the buff is gone."
    },
    {
      "title": "Wall pressure is free",
      "body": "Claudio lacks panic tools against Lionheart at the wall. Counter-hit fish with b+1 when he has to press mid-heavy buttons. Whiff punish his big keepout swings for full damage."
    }
  ],
  "Clive": [
    {
      "title": "One entry, lasting pressure",
      "body": "Steve has no answer at sword range. Your entire gameplan is converting one clean entry into phone-booth pressure. Heat approach speed skips neutral he otherwise controls. Once inside, his up-close defense is among the weakest in the game."
    },
    {
      "title": "Do not play mid-range chicken",
      "body": "Sidestep his ranged pokes rather than backdashing — distance is his win condition. Watch for Phoenix Shift follow-ups before pressing after blocked specials. Wall carry combos delete his zoning identity."
    }
  ],
  "Devil Jin": [
    {
      "title": "Hellsweep reaction drill",
      "body": "Hold ground just outside crouch-dash range where hellsweep whiffs. When he commits, block low only when conditioned — do not guess early. Launching blocked hellsweep is the single highest-value punish in this entire matchup."
    },
    {
      "title": "Weave the electrics",
      "body": "Electrics are highs. Weaving one into a launch is a round-swinging moment. Use ub+3 to make crouch-dash approaches whiff, then punish recovery. qcf+1 taxes every wavedash entry attempt."
    }
  ],
  "Dragunov": [
    {
      "title": "Patience beats plus frames",
      "body": "Dragunov gets more plus frames than almost anyone. Your instinct to press back feeds him. Respect his plus, weave between string gaps once you know them, and only take your turn when he is actually minus. b+1 answers his re-engagement."
    },
    {
      "title": "Sidestep, do not backdash",
      "body": "His running attacks are built to catch backdash. Sidestep his linear approach instead. You win by punishing overreach, not by out-rushing him — his offense is stronger than his defense."
    }
  ],
  "Eddy": [
    {
      "title": "Knowledge beats the capoeira show",
      "body": "Eddy wins on unfamiliarity. Once you know when he is vulnerable, Steve's homing mids take him apart. d+2,1 and qcf+1 both connect on negativa. Interrupt stance transitions with jabs — do not freeze and watch."
    },
    {
      "title": "Homing ends the twisting",
      "body": "LNH 1 homing catches his constant movement. Counter hit between transitions — every stance switch is a gap for b+1. Passivity is his best-case scenario; keep pressing with mids."
    }
  ],
  "Fahkumram": [
    {
      "title": "Commit to inside, stay inside",
      "body": "Half-in half-out is where his knees live. Heat dash and heat approach skip the range where he wins. Once chest-to-chest, grind with jab pressure and stance mix — he wants you off him and lacks panic tools in the corner."
    },
    {
      "title": "Never reset to his range",
      "body": "Do not back off after knockdowns. Poke wars at his range donate counter hits to longer limbs. Weave under high kicks as your safest way through the wall, then sidestep linear keepout after conditioning block respect."
    }
  ],
  "Feng": [
    {
      "title": "Bait the sway, whiff punish",
      "body": "Feng's back-sway makes committed offense whiff. Use short safe pokes, whiff punish his sway with qcf+1 when he swings back in, and mirror his patience with ub+3. The first to overcommit loses."
    },
    {
      "title": "Homing clips kenpo step",
      "body": "LNH 1 homing catches his stance drift. b+1 timing clips him coming out of kenpo step. Do not autopilot Flicker strings from range — his sway turns them into launch punishers."
    }
  ],
  "Heihachi": [
    {
      "title": "Weave electrics, punish sweeps",
      "body": "Weaving under electrics is one of Steve's best tricks here. Punish hellsweep and big minus commitments with full launches. Interrupt warrior instinct entries with jabs and b+1 before the stance pays off."
    },
    {
      "title": "Wall damage is the real threat",
      "body": "Heihachi's wall damage is the scariest part of the character. Use SSL-based movement against linear power moves and avoid trading raw power — his counter-hit conversions out-damage yours."
    }
  ],
  "Hwoarang": [
    {
      "title": "Stay grounded, block, jab gaps",
      "body": "Most Hwoarang pressure is high-heavy and gap-riddled. Stay grounded, block, and jab the gaps you lab. db+1 down-jab slips under kick pressure and resets pace. Every blocked sequence should cost him something."
    },
    {
      "title": "Do not press unlabbed gaps",
      "body": "Some string gaps are frame traps. Only jab gaps you have confirmed. Sidestep left against flamingo approach once he is conditioned to run straight in. b+1 counter hits when he dances back expecting fear."
    }
  ],
  "Jack-8": [
    {
      "title": "Entry is everything",
      "body": "Jack wins at arm range with enormous punishment. Heat closes distance without paying the poke toll. Once chest-to-chest, his up-close options are far weaker — jab pressure on his big frame is extremely consistent."
    },
    {
      "title": "Lateral movement beats giants",
      "body": "Sidestep his linear arm pokes; lateral movement beats him harder than backdash. Weave high swings during approach for free entries. Low parry his signature lows once you have seen the rhythm."
    }
  ],
  "Jin": [
    {
      "title": "Fundamentals get tested honestly",
      "body": "Jin does everything well — no cheese to hide behind. Counter-hit timing, whiff punishment, and wall control decide this. Take the wall early; his comeback mid-screen is better than his wall defense."
    },
    {
      "title": "Parry-aware offense",
      "body": "Respect his parry: vary timing rather than feeding rhythmic punch strings. PAB df+2 elbow beats parry attempts. ub+3 baits electric whiffs for punish. Do not press into zen cancels you have not labbed."
    }
  ],
  "Jun": [
    {
      "title": "Elbow and reversal-break",
      "body": "Lead with PAB df+2 once she shows sabaki habits — it cannot be parried. LNH 1+2 breaks reversals for full launch. Much of her flow is -12 or worse when finished; lab those punishes."
    },
    {
      "title": "Throws beat parry posture",
      "body": "Parry-heavy players stand and wait — that is free grab territory. Counter hit when she spends health on empowered moves and needs to press. Do not chase evasive twirls; let her come back to you."
    }
  ],
  "Kazuya": [
    {
      "title": "Tax the approach",
      "body": "Kazuya has the scariest mixup but one of the weakest approaches. qcf+1 and df+2 keepout make crouch-dashing painful. b+1 clips him out of wavedash the moment he enters range. Never freeze at crouch-dash range."
    },
    {
      "title": "Pressure his weak defense",
      "body": "Pressure relentlessly — his defense is his weakest attribute. Wall pressure at Lionheart gives him no good options. Backdash the first post-knockdown mixup rather than guessing immediately."
    }
  ],
  "King": [
    {
      "title": "Throw breaks decide everything",
      "body": "King's entire threat is conditioning you to freeze. Grind throw breaks in training mode until arm reads are automatic. Breaking even half his grabs guts his damage. Duck grabs on read and launch — most command grabs are highs."
    },
    {
      "title": "Make King strike",
      "body": "Steve does not need to out-grapple him. Force striking neutral where b+1 dominates. King has to walk into your best button to grab you. Throw back — King players famously do not expect to be grabbed."
    }
  ],
  "Kuma / Panda": [
    {
      "title": "Big hurtbox, big combos",
      "body": "The bears out-range and out-damage you in raw trades, but their giant frame makes every Steve combo more consistent. Cash out fully on every launch — optimal routes are easy. Wall combos deal absurd damage."
    },
    {
      "title": "Mids beat crouchy stances",
      "body": "d+2,1 and qcf+1 tag their crouchy postures. Stay out of hunting bear stance range. Do not trade at arm range — bear paws out-damage every poke you own."
    }
  ],
  "Kunimitsu": [
    {
      "title": "Block first, chase never",
      "body": "Kuni darts in, stabs, teleports, and leaves. Stand your ground on teleports — chasing is how her evasion becomes offense. Occupy centre stage and make her come to you."
    },
    {
      "title": "Homing punishes repositioning",
      "body": "LNH 1 homing catches lateral movement and stance drift. Counter hit re-entries with b+1. Wall pressure degrades her escape tools badly in the corner."
    }
  ],
  "Lars": [
    {
      "title": "Poke holes in stances",
      "body": "Lars surges with Silent Entry and Dynamic Entry transitions that are frequently interruptible or minus. Steve's fast buttons steal the turn constantly. qcf+1 taxes every Dynamic Entry approach."
    },
    {
      "title": "Do not hold block forever",
      "body": "Passivity lets fake pressure become real. Know which stance entries are genuinely plus versus interruptible. Make him play neutral after knockdown instead of looping entries."
    }
  ],
  "Law": [
    {
      "title": "Elbow beats the parry",
      "body": "Law's punch parry directly targets Steve's offense. PAB df+2 elbow cannot be parried. Delayed string timing makes parry windows whiff. Punish blocked slide with full while-standing launch every time."
    },
    {
      "title": "Interrupt DSS transitions",
      "body": "Jab gaps in DSS flow where they exist. Weave high string enders for counter-hit opportunities. Do not feed rhythmic punch strings into his parry — vary or pay."
    }
  ],
  "Lee": [
    {
      "title": "Phone-booth fight",
      "body": "Lee wants perfect spacing where his kicks punish everything. Close him down patiently and fight at range 0-1 where his keepout is irrelevant. Jab pressure and stance mix inside — never give space back."
    },
    {
      "title": "Do not whiff mid-range",
      "body": "Lee's whiff punishment is elite. Counter hit his check buttons — his pokes lose the CH war to yours. Wall carry cracks his defense under Lionheart."
    }
  ],
  "Leo": [
    {
      "title": "Counter-hit war decides it",
      "body": "Neither side gets gimmicks here. Take counter hits when Leo re-presses after minus strings. b+1 wins the exchange war in turn-taking gaps. Sidestep more than usual — several core Leo mids are linear."
    },
    {
      "title": "Evasion advantage",
      "body": "Your ub+3 makes Leo's committed mids whiff. Do not let Leo take the wall — their wall game rivals yours. Punish KNK stance lows and unsafe enders on block."
    }
  ],
  "Leroy": [
    {
      "title": "Elbow-first gameplan",
      "body": "PAB df+2 launches and ignores parry entirely. LNH 1+2 reversal-breaks defensive answers. Break your own rhythm with delayed enders so parry whiffs into launch range. Leroy without parry momentum is just a slower poker."
    },
    {
      "title": "Throws and heat pressure",
      "body": "Throws beat wait-and-parry posture. Heat chip forces him to act instead of sitting on defense. Adjust timing after one parry launch rather than abandoning offense entirely."
    }
  ],
  "Lidia": [
    {
      "title": "Block mid first",
      "body": "Lidia's guessing games are worst at the wall — fight mid-stage when possible. Default to blocking mid in stance mix and punish the lows. Counter hit stance entries before they become mixups."
    },
    {
      "title": "Clip stance transitions",
      "body": "b+1 clips her entries — they are slower than your best button. Back off with ub+3 as she enters stance; her mix needs you in range. Do not guess low — her mids hurt far more."
    }
  ],
  "Lili": [
    {
      "title": "Whiff less, block more",
      "body": "Lili converts missed buttons into full combos better than almost anyone. Do not chase backturn flips — hold ground and punish the return trip. LNH 1 homing ends sidestep-heavy movement."
    },
    {
      "title": "Ground her acrobatics",
      "body": "Quick mids the moment she starts flips. Counter hit when she re-engages — her entries lose to b+1 timing. Getting impatient with dew glide mix is how she snowballs."
    }
  ],
  "Miary Zo": [
    {
      "title": "Treat like any new stance char",
      "body": "Block through stance sequences early and label minus enders. Unfamiliar does not mean gapless — weave high-heavy strings. Keep your normal frame-trap game running; she relies on you hesitating."
    },
    {
      "title": "Deny momentum",
      "body": "Do not freeze at animations you have not seen — default to stand block and punish after. Back off with ub+3 when she powers up. LNH 1 homing catches weaving stance movement."
    }
  ],
  "Nina": [
    {
      "title": "Deny the wall",
      "body": "Nina's wall game is the single biggest threat. Fight for centre stage and never freeze at the wall. Your own wall pressure is dramatically stronger than Nina defending."
    },
    {
      "title": "Homing beats ss1",
      "body": "Contest ss1 with LNH 1 — her evasion habit is her most punishable one. Weave high pressure enders for counter-hit gaps. Do not chase sidestep cancels with linear mids."
    }
  ],
  "Paul": [
    {
      "title": "Deathfist discipline",
      "body": "Paul's damage rides on committal, punishable moves. Block deathfist and punish — that single habit wins the matchup. ub+3 makes deathfist whiff for launch punish. Frame-trap him — Paul players press back constantly."
    },
    {
      "title": "Sidestep his power",
      "body": "Deathfist and linear power moves hate lateral movement. Do not stand in sway range watching — back off or pre-empt. Do not duck without a read; one deathfist erases a health bar."
    }
  ],
  "Raven": [
    {
      "title": "Composure beats theatre",
      "body": "Raven's clones, teleports, and back-turn sell an illusion of safety. Keep composure — swinging at empty space is his win condition. Control centre stage and make him spend resources approaching."
    },
    {
      "title": "Press back-turn",
      "body": "Most back-turn options lose to being pressed on with mids. Counter hit when he lands from gimmicks needing to press. LNH 1 homing catches constant repositioning."
    }
  ],
  "Reina": [
    {
      "title": "Contest Sentai entries",
      "body": "Reina is best when you freeze. Interrupt Sentai transitions with fast buttons — most entries are not free. Punish unsafe stance lows and sweeps on block. Keep her out of wavedash range with qcf+1."
    },
    {
      "title": "Weave and backdash mixups",
      "body": "Weave electrics for free launches. Backdash the first post-knockdown mixup instead of guessing. b+1 counter hits on dash-ins. Wall pressure exposes her weaker defense."
    }
  ],
  "Shaheen": [
    {
      "title": "Win the poke war",
      "body": "Shaheen fights clean in the same weight class as Steve, but your counter-hit tools are better. b+1 and df+2 beat his check buttons. Frame-trap him — Shaheen players take their turn back on rhythm."
    },
    {
      "title": "Slide reaction",
      "body": "Do not pre-emptively crouch for the slide — his mids punish paranoia. React at range, block, and launch. Punish committal keepout swings on whiff."
    }
  ],
  "Steve (mirror)": [
    {
      "title": "Exploit Steve's holes",
      "body": "Everything in the Secrets tab cuts both ways. Sidestep left and duck option-selects most Steve offense. Do not press into FLK 1,d+1 at 0 — walk back and whiff punish the b+1 attempt. Elbow-free offense punishes weave with timed lows and LNH 1."
    },
    {
      "title": "Delayed timings win mirrors",
      "body": "Mirror players punish on autopilot rhythm. Use delayed string timings and save swindler cancels for match point. Flicker-vs-flicker chicken at range — first to whiff a high loses."
    }
  ],
  "Victor": [
    {
      "title": "Lab the highs",
      "body": "Victor's pressure leaks duckable highs and minus transitions. Once labbed, Steve turns his flash into launch practice. Do not freeze against unfamiliar flow — that hesitation is his entire character."
    },
    {
      "title": "Interrupt minus transitions",
      "body": "Jab perfumer transitions where he is not actually plus. Weave his high pokes heavily. b+1 counter hits as he re-engages from stance resets. Wall pressure — his Lionheart escape is poor."
    }
  ],
  "Xiaoyu": [
    {
      "title": "Mid-heavy gameplan",
      "body": "AOP deletes half your usual offense. Commit to mids and stop feeding her evasion. Hold highs entirely when she is low — flicker spam is free launches for her. down-jab and homing mids are your new default."
    },
    {
      "title": "Do not chase backturn",
      "body": "Wait and punish the return option instead. LNH 1 homing catches twirling movement. Wall pressure gives her evasion far less room. Do not backdash predictably — California roll hunts retreat."
    }
  ],
  "Yoshimitsu": [
    {
      "title": "Structure beats chaos",
      "body": "Yoshimitsu wants chaos. Give him structure: block first, identify, then punish. Most gimmicks are heavily minus once blocked. Steady mid pressure keeps him from setting up flash range."
    },
    {
      "title": "Throws beat flash",
      "body": "Grabs beat flash-ready posture. b+1 at ranges where flash cannot reach but his pokes can. Back off from NSS and bad-breath stance instead of guessing inside them."
    }
  ],
  "Zafina": [
    {
      "title": "Same fix as Xiaoyu",
      "body": "Zafina's stances low-profile your highs. Lead with mids and punish stance lows on block. Hold highs when she is in mantis or tarantula — they whiff into launches."
    },
    {
      "title": "Do not chase into stances",
      "body": "Let her come out and punish the exit. LNH 1 homing catches slithering movement. Counter hit as she rises needing to press. Flicker autopilot loses half your offense here."
    }
  ]
};

const GENERIC_BEAT_ADVICE: BeatAdviceSection[] = [
  {
    title: "Block first, punish second",
    body: "Most opponents lose their turn the moment you stop mashing. Stand block their first layer, note which move was minus, then answer with your best punish tier instead of guessing.",
  },
  {
    title: "Make them play your range",
    body: "Characters win by dragging you into their spacing. Walk them down behind block, take the wall when you can, and only gamble on lows once standing block has become their habit.",
  },
];

export type MatchupBullets = {
  briefing: string;
  doThis: string[];
  dodge: string[];
  utilise: string[];
  avoid: string[];
};

function bulletsToAdvice(opponentName: string, bullets: MatchupBullets): BeatAdviceSection[] {
  return [
    {
      title: `How to beat ${opponentName}`,
      body: [bullets.briefing, ...bullets.doThis, ...bullets.utilise].join(" "),
    },
    {
      title: "Habits that lose the round",
      body: [...bullets.avoid, ...bullets.dodge].join(" "),
    },
  ];
}

export function getBeatAdvice(
  characterId: GuideCharacterId,
  opponentName: string,
  bullets?: MatchupBullets,
): BeatAdviceSection[] {
  if (characterId === "steve") {
    return (
      STEVE_BEAT_ADVICE[opponentName] ??
      STEVE_BEAT_ADVICE[opponentName.replace(/\s*\(mirror\)$/u, "").trim()] ??
      (bullets ? bulletsToAdvice(opponentName, bullets) : GENERIC_BEAT_ADVICE)
    );
  }

  if (bullets) {
    return bulletsToAdvice(opponentName, bullets);
  }

  return GENERIC_BEAT_ADVICE;
}
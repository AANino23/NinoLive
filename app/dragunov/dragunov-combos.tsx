"use client";

import { useState } from "react";
import { MoveNotation, SectionHeading } from "../tekken/guide-ui";

const guideSource = { href: "https://tekkendocs.com/dragunov/guide", label: "TekkenDocs · Fear Of Silence · v2.04" };
const wavuSource = { href: "https://wavu.wiki/t/Dragunov_combos", label: "Wavu · Dragunov combos" };
const panel = "min-w-0 rounded-3xl border border-slate-200 bg-white/85 p-4 sm:p-6";
const groups = ["All routes", "Start here", "Situational", "Next level"] as const;
type Group = (typeof groups)[number];
type Step = { input: string; job: string; cue: string; tornado?: boolean };
type Route = {
  id: string;
  title: string;
  group: Exclude<Group, "All routes">;
  starters: string[];
  condition: string;
  goal: string;
  steps: Step[];
  check: string;
  source: typeof guideSource;
};

const crouchLink: Step = { input: "FC.df+1,4", job: "Crouch link", cue: "Use the crouching recovery of the previous string. Read FC as full crouch, not another direction to press." };
const sneakTornado: Step = { input: "SNK.2", job: "Tornado", cue: "Continue from Sneak with the punch. Do not restart a quarter-circle motion here.", tornado: true };
const carry: Step = { input: "df+3+4", job: "Close the gap", cue: "Reconnect after the Tornado. Watch the landing position before starting the last string." };

const routes: Route[] = [
  {
    id: "first-launch", title: "Your first launch conversion", group: "Start here", starters: ["df+2", "ws2"],
    condition: "After either launcher hits. The while-standing option starts as you rise from crouch.",
    goal: "Learn this first in open space. Think pickup → crouch → Sneak → finish.",
    steps: [
      { input: "4,1", job: "Pickup", cue: "Begin once the launcher recovers. Learn this first link before adding the rest." },
      { input: "4,4", job: "Filler", cue: "Both kicks belong to one string. Be ready for the crouching link next." },
      crouchLink, sneakTornado,
      { input: "b+4,3", job: "Finish", cue: "Connect after the Tornado. Check the combo counter rather than assuming two hits means a true combo." },
    ],
    check: "Practise launcher plus pickup until it connects five times. Add one numbered step at a time; repeat on the other side.", source: guideSource,
  },
  {
    id: "sneak-launch", title: "Sneak punch conversion", group: "Situational", starters: ["qcf+1"],
    condition: "After the Sneak high punch launches. A ducked high gives you no combo.",
    goal: "A separate pickup for this launch; keep it distinct from your standing-launch route.",
    steps: [
      { input: "d+2", job: "Pickup", cue: "Catch the airborne opponent with the low punch; this is combo filler, not a new launch." },
      { input: "ws4", job: "Rise", cue: "Let crouch release into the rising kick. A standing kick means you lost the crouching state." },
      { input: "b+1,2", job: "Tornado", cue: "Two successive punches, not both buttons together.", tornado: true },
      { input: "3,1,4", job: "Finish", cue: "Keep the three presses in order; learn the string as one chunk." },
    ],
    check: "If the rising kick is wrong, isolate the low punch into rising kick before repeating the full combo.", source: guideSource,
  },
  {
    id: "counter-hit", title: "Running counter hit / Sneak mid", group: "Situational", starters: ["CH f,f,F+2", "qcf+2"],
    condition: "The running punch needs a counter hit. The Sneak mid uses its normal launch.",
    goal: "Recognise the launch first, then use this pickup. A normal running-punch hit is not this situation.",
    steps: [
      { input: "d+2", job: "Pickup", cue: "React to the launch animation before committing to the route." },
      { input: "ws4", job: "Rise", cue: "Come out of crouch into the kick." },
      { input: "b+1,2", job: "Tornado", cue: "Watch for the spin before your forward movement.", tornado: true },
      { input: "f,f", job: "Dash", cue: "This is movement between attacks. Close the distance before the next input." },
      carry,
      { input: "3,1,4", job: "Finish", cue: "Complete the string only after the carry move connects." },
    ],
    check: "Set counter hit on for the running starter while learning. Turn it off afterwards to learn the visual difference.", source: guideSource,
  },
  {
    id: "low-parry", title: "Low-parry conversion", group: "Start here", starters: [],
    condition: "After a successful low parry. This starts with Tornado already used.",
    goal: "A short route to recall immediately when you catch a low. Do not insert your normal Tornado filler.",
    steps: [
      { input: "df+3+4", job: "Pickup", cue: "Start from the low-parry animation, not from a standing launcher." },
      { input: "4,1", job: "Filler", cue: "Link into the two-hit string." },
      { input: "2,1,3", job: "Finish", cue: "Finish the short conversion without searching for another Tornado." },
    ],
    check: "Record a predictable low, parry it, then practise the pickup. Randomise the low only once the conversion is familiar.", source: guideSource,
  },
  {
    id: "wall", title: "When you reach the wall", group: "Start here", starters: [],
    condition: "The opponent is already wall-splatted, within reach and aligned in front of you.",
    goal: "Recognise the wall early. An open-ground sequence and a wall finish are different decisions.",
    steps: [{ input: "d+3,2,1+2", job: "Wall finish", cue: "Kick, punch, then both punches together. The final icon lights two buttons because they are simultaneous." }],
    check: "Test a clean front-on splat first. Then try a lower or angled splat. If it drops, record the height and angle instead of adding more filler.", source: guideSource,
  },
  {
    id: "small-followup", title: "Take the short follow-up", group: "Situational", starters: ["b+1+2", "uf+1"],
    condition: "After either move hits and leaves the opponent in crouching recovery; not after it is blocked.",
    goal: "Recognise a small conversion without trying to force a full airborne combo.",
    steps: [{ input: "d+1+3", job: "Crouch throw", cue: "Press the two lit buttons together with down. You are targeting the opponent’s crouching recovery." }],
    check: "Use random guard to separate a hit from a block. Only attempt the throw after recognising the hit.", source: wavuSource,
  },
  {
    id: "carry", title: "Regular-launch carry route", group: "Next level", starters: ["df+2"],
    condition: "After a regular launch, with room ahead. Learn the first-launch route before adding this alternative.",
    goal: "Develop your stance transitions and judge where the final string will leave the opponent.",
    steps: [
      { input: "4,4", job: "Pickup", cue: "This route starts directly with the double kick; do not add the other route’s pickup." },
      crouchLink, sneakTornado, carry,
      { input: "2,1,df", job: "Enter Sneak", cue: "After the punches, use down-forward to transition into Sneak." },
      { input: "SNK.1+2", job: "Finish", cue: "Use both punches from the stance. This is the continuation of the previous step, not a fresh stance entry." },
    ],
    check: "If the ender fails, test just the two punches into Sneak and the simultaneous punch input. Recheck wall distance once that transition is reliable.", source: wavuSource,
  },
  {
    id: "heat-dash", title: "Convert a Heat Dash", group: "Next level", starters: ["H.f+3,1+2,F"],
    condition: "Already in Heat: land the engager and hold forward for Heat Dash. An engager outside Heat gives a different situation.",
    goal: "Learn the resource condition as well as the inputs. This route spends your remaining Heat.",
    steps: [
      { input: "df+3+4", job: "Pickup", cue: "Connect after the Heat Dash, before the regular filler." },
      { input: "4,4", job: "Filler", cue: "Continue into the crouching part of the route." },
      crouchLink, sneakTornado, carry,
      { input: "2,1,df", job: "Enter Sneak", cue: "Transition after the punches rather than ending the string standing." },
      { input: "SNK.1+2", job: "Finish", cue: "Press both punches from Sneak." },
    ],
    check: "Reset Heat before each attempt. Check that you actually triggered a Heat Dash; do not troubleshoot the filler from a different starting state.", source: wavuSource,
  },
];

export function DragunovCombos() {
  const [group, setGroup] = useState<Group>("All routes");
  const visible = routes.filter((route) => group === "All routes" || route.group === group);
  return (
    <section className="space-y-5" aria-label="Dragunov combo guide">
      <SectionHeading eyebrow="Combos" title="Turn a launch into a route you remember" copy="Start with one launch, one low-parry conversion, and one wall finish. Each card reads from top to bottom: recognise the starter, follow the input icons, then check the difficult link." accent="cyan" />
      <div className={panel}>
        <h3 className="font-semibold text-slate-950">Read the route in chunks</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">Numbered rows are successive parts of one combo, not alternative moves. Multiple starter icons are alternatives. Outlined arrows mean tap; filled arrows mean hold. The lit buttons are pressed together. Directions assume you face right; reverse them when you switch sides.</p>
        <dl className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 sm:grid-cols-3">
          <div><dt className="font-semibold text-cyan-800">FC · full crouch</dt><dd>Be in crouch before the attack.</dd></div>
          <div><dt className="font-semibold text-cyan-800">WS · while standing</dt><dd>Attack as you rise from crouch.</dd></div>
          <div><dt className="font-semibold text-cyan-800">SNK · Sneak</dt><dd>Use the follow-up from the stance you entered.</dd></div>
          <div><dt className="font-semibold text-cyan-800">CH · counter hit</dt><dd>The starter catches an attack. Normal hit may not launch.</dd></div>
          <div><dt className="font-semibold text-cyan-800">Tornado</dt><dd>The spin that extends the juggle. Low parry has already used it.</dd></div>
          <div><dt className="font-semibold text-cyan-800">H · in Heat</dt><dd>The route requires Heat to be active before the starter.</dd></div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-slate-600">Reference routes, not current-patch lab tests. TekkenDocs routes below are from the v2.04 guide; Wavu routes can change. Sources checked 22 September 2026. Confirm each route in your game version before relying on it.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter combo routes">
        {groups.map((option) => <button key={option} type="button" aria-pressed={group === option} onClick={() => setGroup(option)} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 ${group === option ? "border-cyan-400 bg-cyan-200 text-slate-950" : "border-slate-300 bg-white text-slate-700"}`}>{option}</button>)}
      </div>
      <p className="text-sm text-slate-600" role="status">{visible.length} routes · {group}</p>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {visible.map((route) => <article key={route.id} className={panel}>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">{route.group}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{route.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">{route.goal}</p>
          <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cyan-800">Start condition</h4>
            {route.starters.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-3">{route.starters.map((starter, index) => <span key={starter} className="inline-flex flex-wrap items-center gap-3">{index > 0 && <span className="text-sm text-slate-600">or</span>}<MoveNotation notation={starter} accent="cyan" size="lg" /></span>)}</div>}
            <p className="mt-2 text-sm leading-6 text-slate-700">{route.condition}</p>
          </div>
          <ol className="mt-4 space-y-3">
            {route.steps.map((step, index) => <li key={`${route.id}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-cyan-800">{index + 1}</span>{step.job}{step.tornado && <span className="rounded-full bg-cyan-100 px-2 py-1 text-cyan-900">Tornado here</span>}</div>
              <MoveNotation notation={step.input} accent="cyan" size="lg" className="mt-3" />
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.cue}</p>
            </li>)}
          </ol>
          <details className="mt-4 rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer py-1 text-sm font-semibold text-slate-900">Practice check / if it drops</summary><p className="mt-2 text-sm leading-6 text-slate-700">{route.check}</p></details>
          <a href={route.source.href} className="mt-3 inline-flex min-h-11 items-center text-sm text-cyan-800 underline">{route.source.label}</a>
        </article>)}
      </div>
      <article className={panel}>
        <h3 className="text-lg font-semibold text-slate-950">Five minutes away from the game</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>Choose one card. Say the start condition aloud before looking at the route.</li>
          <li>Trace the input icons with your fingers. Say where you crouch, rise, enter Sneak, or use Tornado.</li>
          <li>Cover the card and recall the chunks in order. Re-read only the first chunk you forgot.</li>
          <li>In Study, save one link to test next session. In-game, check a continuous combo counter and practise both sides.</li>
        </ol>
        <p className="mt-3 text-sm leading-6 text-slate-600">At the wall, watch the splat rather than finishing an open-ground script automatically. Learn stage breaks and harder crouch cancels after these routes are reliable; they still need separate testing.</p>
      </article>
    </section>
  );
}

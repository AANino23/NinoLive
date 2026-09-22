"use client";

import { useEffect, useRef, useState } from "react";
import { CHARACTER_PROFILES } from "../tekken/punishment-data";
import { MoveNotation } from "../tekken/guide-ui";

const guideUrl = "https://tekkendocs.com/dragunov/guide";
const framesUrl = "https://tekkendocs.com/t8/dragunov";
const combosUrl = "https://wavu.wiki/t/Dragunov_combos";
const notesKey = "ninolive.dragunov.practice-note.v1";
const panel = "rounded-3xl border border-slate-200 bg-white/85 p-4 sm:p-6";
const button = "min-h-11 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700";

const punishGroups = [
  { label: "Standing", tiers: CHARACTER_PROFILES.dragunov.ladder },
  { label: "After blocking low", tiers: CHARACTER_PROFILES.dragunov.crouchLadder },
];

const questions = [
  { question: "Your d+2 hits normally. Is another attack guaranteed to beat their response?", answer: "No. You are -1 and crouching. Start with defence and observe their reply. Normal hit and counter hit are different situations.", topic: "Hit versus block" },
  { question: "You block a -13 low in range. Which stance should your punish come from?", answer: "While standing, because you blocked crouching. ws4 is the simple option; ws1+2 offers more reward if it reaches. A standing df+2 is not the answer.", topic: "Punishment" },
  { question: "The opponent ducks df+1,4. Should you finish it more often?", answer: "No. Keep the mid df+1 and stop adding the high. Recognise which part of the string their defence is beating.", topic: "Adaptation" },
  { question: "They keep stepping your approach. What should you change before adding more attacks?", answer: "Change your timing and distance. Approach into guard and watch the step. Choose a tracking option only when you know it will reach; do not repeat the same linear entry.", topic: "Movement" },
  { question: "You have plus frames. Does that make a slow throw or crouch mix guaranteed?", answer: "No. Entry time, startup, range, evasion, and their defensive option still matter. Plus frames give you an earlier start, not unlimited time.", topic: "Pressure" },
  { question: "You blocked the first hit of the mirror's 1,2,1. Should you duck the end?", answer: "No. The remaining hits are mids. Stand-block the string and punish; do not treat it like b+4,3's high ender.", topic: "Mirror defence" },
  { question: "You do not recognise the opponent's string. What is today's learning target?", answer: "Identify its command and one response. Watch the clip, predict the end, then check it. Save a recording task rather than memorising a blanket step direction.", topic: "Matchup study" },
  { question: "You have a life lead near the end of the round. Must you force another mix?", answer: "No. Make them approach, protect space, and take a clear punish. Before risking a low or launcher, ask what you gain that waiting would not give you.", topic: "Round management" },
];

const lessons = [
  { title: "1. Read the situation", body: "Say what happened before naming your next move: hit, block, counter hit, or whiff. Then ask whether you are standing or crouching and whether your next attack will reach. This habit stops a memorised flowchart becoming an automatic mistake." },
  { title: "2. Build a small round plan", body: "Begin with movement, a jab, and a mid check. Observe whether they retaliate, duck, step, or wait. Repeat what works until their response changes. Do not rotate options just to be unpredictable." },
  { title: "3. Separate pressure from punishment", body: "A punish catches recovery before the opponent can defend. Pressure asks them to make another decision. Practise saying which one you are attempting; an attack that is useful in pressure may be far too slow to punish." },
  { title: "4. Add reward without adding confusion", body: "Learn one standing punish, one crouching punish, and one launch conversion first. Add wall carry and harder routes once you can recognise the launch without hesitating. Write the first point where a combo drops, not just ‘practise combos’." },
];

const comboCards = [
  { title: "First launch conversion", starter: "df+2 or ws2", route: "4,1 → 4,4 → FC.df+1,4 → SNK.2 T! → b+4,3", note: "A beginner reference from the version 2.04 guide. Learn the chunks before the rhythm; check that the combo counter stays continuous in your game version.", href: guideUrl },
  { title: "Regular-launch carry reference", starter: "df+2", route: "4,4 → FC.df+1,4~2 T! → df+3+4 → 2,1,df~1+2", note: "Wavu bread-and-butter reference. ~2 uses the Sneak follow-up after the crouch string. Recheck spacing and wall distance; this is not a promise of identical damage on every axis.", href: combosUrl },
  { title: "Wall conversion", starter: "Opponent already wall-splatted", route: "d+3,2,1+2", note: "Version 2.04 wall reference. Stop your open-ground route early enough to arrive at the wall. Test splat height and alignment; this string is not guaranteed in neutral.", href: guideUrl },
  { title: "Small guaranteed follow-up", starter: "b+1+2 or uf+1 hits", route: "d+1+3", note: "Wavu lists this crouch-throw follow-up. It targets the opponent's crouching recovery; practise recognising the hit rather than attempting it on block.", href: combosUrl },
];

export function DragunovStudy() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [reviewOnly, setReviewOnly] = useState(false);
  const [noteStatus, setNoteStatus] = useState("");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(notesKey);
      if (noteRef.current && saved !== null) noteRef.current.value = saved;
    } catch {
      // Reading is optional. A failed write is reported beside the editor.
    }
  }, []);

  const queue = questions.map((_, position) => position).filter((position) => !reviewOnly || answers[position] === false);
  const questionIndex = queue[index % Math.max(queue.length, 1)];
  const card = questions[questionIndex];
  const done = Object.keys(answers).length;
  const toReview = Object.values(answers).filter((answer) => !answer).length;

  function rate(remembered: boolean) {
    setAnswers((previous) => ({ ...previous, [questionIndex]: remembered }));
    setRevealed(false);
    // Removing a remembered card shrinks the review queue; keep the current slot.
    if (!reviewOnly || !remembered) setIndex((previous) => previous + 1);
  }

  return (
    <section className="space-y-5" aria-label="Dragunov pocket study">
      <article className={panel}>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Start here · five minutes</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Learn something you can use next time</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>One minute: read one lesson below and explain it aloud without looking.</li>
          <li>Two minutes: answer the recall cards before revealing the answer.</li>
          <li>One minute: open Matchups, choose one opponent and recognise one threat from a clip.</li>
          <li>One minute: save one situation to test when you next have the game.</li>
        </ol>
        <p className="mt-4 text-sm leading-6 text-slate-600">Away from the game, train recognition and decisions. Timing, range, tracking, and execution still need a practice-mode check. Clips need an internet connection; this page is not an offline download.</p>
      </article>

      <details className={panel}>
        <summary className="cursor-pointer py-1 font-semibold text-slate-950">How to read the advice · notation and frames</summary>
        <dl className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 sm:grid-cols-2">
          {[
            ["i12 / +4 / -13", "i12 means 12-frame startup. +4 means you recover four frames earlier; -13 means thirteen later. Always read whether the value is on hit or on block."],
            ["A frame-trap example", "At +4, an immediate i13 attack reaches its active frame before an opponent's i10 attack, assuming both reach and neither evades. Waiting can remove that advantage."],
            ["Safe is not your turn", "Safe usually means no guaranteed block punish. You can still be disadvantaged. Blocking, moving, and observing are valid follow-ups."],
            ["CH / FC / ws / wr", "CH = counter hit; FC = full crouch; ws = while rising from crouch; wr = while running. While standing and while running are different inputs."],
            ["SNK / qcf / T!", "SNK is Sneak; qcf is a quarter-circle forward input. T! marks Tornado in a combo. Arrows separate chunks; commas separate inputs within a string."],
            ["Left and right", "Step directions refer to the defending character's own left/right, not a fixed side of the phone screen. Range, alignment, and timing change what can be stepped."],
          ].map(([term, meaning]) => <div key={term}><dt className="font-semibold">{term}</dt><dd className="mt-1">{meaning}</dd></div>)}
        </dl>
      </details>

      <div className="grid gap-3 sm:grid-cols-2">
        {lessons.map((lesson) => <article key={lesson.title} className={panel}><h3 className="font-semibold text-slate-950">{lesson.title}</h3><p className="mt-3 text-sm leading-6 text-slate-700">{lesson.body}</p></article>)}
      </div>

      <article className={panel} aria-label="Recall practice">
        <h3 className="text-xl font-semibold text-slate-950">Test yourself</h3>
        <p className="mt-2 text-sm text-slate-600" role="status">{done} / {questions.length} reviewed · {toReview} to revisit · this session</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={button} aria-pressed={reviewOnly} onClick={() => { setReviewOnly(!reviewOnly); setIndex(0); setRevealed(false); }}>{reviewOnly ? "Show all cards" : "Practise missed cards"}</button>
          <button className={button} onClick={() => { setAnswers({}); setIndex(0); setRevealed(false); setReviewOnly(false); }}>Restart</button>
        </div>
        {card ? <div className="mt-5" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">{card.topic} · card {index % queue.length + 1} of {queue.length}</p>
          <p className="mt-3 text-lg font-semibold leading-7 text-slate-950">{card.question}</p>
          <button className={`${button} mt-4`} aria-expanded={revealed} aria-controls="recall-answer" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide answer" : "Reveal answer"}</button>
          <div id="recall-answer" hidden={!revealed}>
            <p className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm leading-6 text-slate-800">{card.answer}</p>
            <div className="mt-4 flex flex-wrap gap-2"><button className={button} onClick={() => rate(false)}>Revisit this</button><button className={button} onClick={() => rate(true)}>Got it · next</button></div>
          </div>
        </div> : <p className="mt-5 text-sm text-slate-700" role="status">No missed cards to practise. Use Show all cards to start a round.</p>}
      </article>

      <details className={panel}>
        <summary className="cursor-pointer py-1 font-semibold text-slate-950">Punishment · your standing and crouching answers</summary>
        <p className="mt-3 text-sm leading-6 text-slate-600">Use the fastest reliable answer that fits the recovery and reaches. These timings do not guarantee contact after pushback. df+1,4 is not a natural-hit i13 punish.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {punishGroups.map(({ label, tiers }) => <div key={label}><h4 className="font-semibold text-slate-900">{label}</h4><ul className="mt-3 space-y-3">{tiers.map((tier) => <li key={tier.frames} className="rounded-xl bg-slate-50 p-3"><span className="text-sm font-semibold text-cyan-800">{tier.frames}</span><MoveNotation notation={tier.move} accent="cyan" /><p className="mt-2 text-sm leading-6 text-slate-700">{tier.note}</p></li>)}</ul></div>)}
        </div>
        <a href={framesUrl} className="mt-4 inline-block text-sm text-cyan-800 underline">Check Dragunov frame data</a>
      </details>

      <details className={panel}>
        <summary className="cursor-pointer py-1 font-semibold text-slate-950">Combos · learn one route before optimising</summary>
        <p className="mt-3 text-sm leading-6 text-slate-600">These are sourced reference routes, not in-game tests on the current patch. T! marks the Tornado point. Low parries and counter-hit launches need their own routes; do not assume this filler works after every launcher.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">{comboCards.map((combo) => <article key={combo.title} className="min-w-0 rounded-xl bg-slate-50 p-4"><h4 className="font-semibold text-slate-950">{combo.title}</h4><p className="mt-2 text-sm text-cyan-800">After: {combo.starter}</p><p className="mt-3 break-words font-mono text-sm leading-7 text-slate-950">{combo.route}</p><p className="mt-3 text-sm leading-6 text-slate-700">{combo.note}</p><a href={combo.href} className="mt-3 inline-block text-sm text-cyan-800 underline">Route source</a></article>)}</div>
      </details>

      <details className={panel}>
        <summary className="cursor-pointer py-1 font-semibold text-slate-950">Throws, Heat, and getting off the floor</summary>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
          <li>Throw inputs and breaks differ: f+1+4 needs a 1 break; f+2+3 needs 2; uf+1+2 needs 1+2. Learn the animation as well as the command.</li>
          <li>Decide what Heat should buy: an approach, a conversion, or a closing mix. A Heat Engager hit starts Heat when available; a Heat Dash spends remaining Heat. An unbreakable tackle entry does not mean every subsequent ground option is unbreakable.</li>
          <li>At the wall, choose between guaranteed combo damage and a deliberate wake-up read. Watch whether they stay down, tech, or attack; repeating a roll regardless of their response is not a complete oki plan.</li>
          <li>When you are grounded, identify the knockdown first. Compare staying down, a guarded rise, and a side recovery in practice. No single wake-up option beats every setup.</li>
          <li>When defending, stand-block by default and duck an identified low or high on a read. If an unfamiliar sequence beats you, save its command for the next lesson.</li>
        </ul>
        <a href={framesUrl} className="mt-4 inline-block text-sm text-cyan-800 underline">Throw and Heat reference</a>
      </details>

      <article className={panel}>
        <label htmlFor="dragunov-practice-note" className="text-lg font-semibold text-slate-950">My next practice goal</label>
        <p id="practice-note-help" className="mt-2 text-sm leading-6 text-slate-600">Saved on this browser only, not synced. Example: “Record the reply that beats me after d+2. Block it five times, then test one answer.”</p>
        <textarea ref={noteRef} id="dragunov-practice-note" aria-describedby="practice-note-help" rows={4} maxLength={4000} className="mt-3 block w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-900" onChange={(event) => {
          try { localStorage.setItem(notesKey, event.target.value); setNoteStatus("Saved on this browser."); }
          catch { setNoteStatus("Could not save here. Copy your note before leaving this page."); }
        }} />
        <p className="mt-2 text-sm text-slate-600" role="status">{noteStatus}</p>
      </article>

      <article className={panel}>
        <h3 className="font-semibold text-slate-950">Sources and what still needs work</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">Reviewed 22 September 2026. Core corrections use <a href={framesUrl} className="text-cyan-800 underline">TekkenDocs move data</a>; the <a href={guideUrl} className="text-cyan-800 underline">Fear Of Silence guide</a> is explicitly version 2.04.00 (13 August 2025). Additional combo references: <a href={combosUrl} className="text-cyan-800 underline">Wavu</a>. Review date is not a claim that every entry is current-patch verified.</p>
        <p className="mt-3 text-sm leading-6 text-slate-700">This is a growing study guide. Dedicated lessons for every opponent, a full audit of shared opponent frame charts, matchup-specific stance answers, and current-patch combo testing are still missing. Generic matchup plans are labelled. Check a disputed interaction in practice before building a habit around it.</p>
      </article>
    </section>
  );
}

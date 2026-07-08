import Link from "next/link";
import { SteveGuide } from "./steve-guide";

export default function StevePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">
          NinoLive
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Steve
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          A Tekken 8 Steve Fox guide built in the spirit of a dojo page: key
          training drills, practical matchup ideas, and embedded okizeme.gg
          move clips for live study.
        </p>

        <SteveGuide />

        <Link
          href="/"
          className="mt-10 inline-flex w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/60 hover:text-white"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

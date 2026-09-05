import Link from "next/link";
import { LingGuide } from "./ling-guide";

export default function LingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-rose-600">
              NinoLive
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Ling Xiaoyu
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              A Tekken 8 Ling Xiaoyu study board with visual move notation, stance
              drills, Rain Dance pressure notes, and embedded okizeme.gg clips for
              fast review.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-rose-400/60 hover:text-slate-950"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-10">
          <LingGuide />
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { LingGuide } from "./ling-guide";

export default function LingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-2xl shadow-slate-300/40 backdrop-blur sm:p-12">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-rose-600">
              NinoLive
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:mt-6 sm:text-6xl">
              Ling Xiaoyu
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-7">
              A Tekken 8 Ling Xiaoyu study board with visual move notation, stance
              drills, Rain Dance pressure notes, and embedded okizeme.gg clips for
              fast review.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 self-end rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition sm:self-start hover:border-rose-400/60 hover:text-slate-950"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 sm:mt-10">
          <LingGuide />
        </div>
      </div>
    </main>
  );
}

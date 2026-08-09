import Link from "next/link";

export default function SecretHitlerPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-10 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-600">
          NinoLive
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          Secret Hitler
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex w-fit rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-sky-400/60 hover:text-slate-950"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

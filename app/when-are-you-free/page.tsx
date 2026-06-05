import Link from "next/link";
import { getSubmissions } from "@/lib/availability";
import { AvailabilityForm } from "./availability-form";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function WhenAreYouFreePage() {
  const submissions = await getSubmissions();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-10 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">
          NinoLive
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          When Are You Free?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Share your name and the date you are available so everyone can see
          when works.
        </p>

        <AvailabilityForm />

        <section className="mt-12 border-t border-white/10 pt-10">
          <h2 className="text-lg font-semibold text-white">Who is free</h2>

          {submissions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No availability submitted yet. Be the first to add yours.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {submissions.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-white">{entry.name}</span>
                  <span className="text-sm text-sky-200">
                    {formatDate(entry.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

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

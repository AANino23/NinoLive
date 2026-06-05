const plans = [
  "A simple home for experiments, projects, and useful tools.",
  "A clean public landing page today, with room to grow over time.",
  "Built to move easily from Vercel to the existing Fasthosts VPS later.",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-10 sm:px-10 sm:py-14">
      <section className="flex flex-1 flex-col justify-center">
        <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">
            NinoLive
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Coming soon.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            This space is being set up as a flexible home for new ideas, test
            projects, and anything else worth shipping under the NinoLive
            domain.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300"
              >
                {plan}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Initial public placeholder for the NinoLive domain.</p>
        <p>First release: Vercel. Planned next step: Fasthosts VPS.</p>
      </footer>
    </main>
  );
}

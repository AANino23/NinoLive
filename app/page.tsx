import Link from "next/link";

const sections = [
  {
    title: "Secret Hitler",
    href: "/secret-hitler",
    description: "Open the Secret Hitler area.",
  },
  {
    title: "Halo",
    href: "/halo",
    description: "Open the Halo area.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
      <section className="flex flex-1 flex-col justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">
            NinoLive
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Dashboard
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Pick a section below to open its page.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-sky-400/60 hover:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white transition group-hover:text-sky-300">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {section.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

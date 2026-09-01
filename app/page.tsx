import Link from "next/link";

const sections = [
  {
    title: "Steve",
    href: "/steve",
    description:
      "Study Steve Fox in Tekken 8 with dojo drills, game-plan notes, and embedded move clips.",
  },
  {
    title: "Fahkumram",
    href: "/fahkumram",
    description:
      "Learn Fahkumram in Tekken 8 with Garuda Force drills, Rama mixups, matchup reminders, and embedded move clips.",
  },
  {
    title: "Dragunov",
    href: "/dragunov",
    description:
      "Study Sergei Dragunov in Tekken 8 with plus-frame drills, Sneak mix notes, matchup reminders, and embedded move clips.",
  },
  {
    title: "Ling Xiaoyu",
    href: "/ling",
    description:
      "Study Ling Xiaoyu in Tekken 8 with AOP drills, Hypnotist and Rain Dance notes, matchup reminders, and embedded move clips.",
  },
  {
    title: "Feng Wei",
    href: "/feng",
    description:
      "Study Feng Wei in Tekken 8 with kenpo drills, back-sway bait notes, matchup reminders, and embedded move clips.",
  },
  {
    title: "Secret Hitler",
    href: "/secret-hitler",
    description: "Open the Secret Hitler area.",
    hidden: true,
  },
  {
    title: "Halo",
    href: "/halo",
    description: "Open the Halo area.",
    hidden: true,
  },
];

const visibleSections = sections.filter((section) => !section.hidden);

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
      <section className="flex flex-1 flex-col justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-600">
            NinoLive
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Dashboard
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Pick a section below to open its page.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {visibleSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group rounded-2xl border border-slate-200 bg-slate-100/80 p-6 transition hover:border-sky-400/60 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 transition group-hover:text-sky-600">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {section.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-500">
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

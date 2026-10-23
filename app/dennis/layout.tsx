import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function DennisLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-stone-800 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 border-b border-stone-200 pb-6">
          <Link href="/dennis" className="text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4">
            Dennis Mellowisper
          </Link>
          <p className="mt-2 text-sm text-stone-600">Personal video creation and publishing</p>
        </header>
        <article className="space-y-8 text-base leading-7 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_p+p]:mt-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-stone-400 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </article>
        <footer className="mt-14 border-t border-stone-200 pt-6 text-sm text-stone-600">
          <nav aria-label="Dennis information" className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/dennis" className="underline underline-offset-4">About Dennis</Link>
            <Link href="/dennis/privacy" className="underline underline-offset-4">Privacy policy</Link>
            <a href="mailto:dennisproductions975@gmail.com" className="underline underline-offset-4">Contact</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}

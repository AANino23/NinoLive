"use client";

import type { GuideAccent } from "./guide-ui";
import { getBeatAdvice, type MatchupBullets } from "./matchup-beat-advice";
import { getOpponentProfile } from "./opponent-profiles";
import type { GuideCharacterId } from "./punishment-data";
import type { PunishClipHandler } from "./matchup-punishment";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ClipProps = {
  onPlayClip?: PunishClipHandler;
  activeClipKey?: string | null;
};

export function MatchupOpponentProfileSection({
  opponentName,
  onPlayClip,
  activeClipKey,
}: {
  opponentName: string;
} & ClipProps) {
  const profile = getOpponentProfile(opponentName);
  const canPlayClips = Boolean(onPlayClip) && Boolean(profile?.slug);

  if (!profile) return null;

  return (
    <>
      <div className="mt-6 rounded-2xl border border-indigo-300/25 bg-indigo-300/5 p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">
          {profile.archetype}
        </p>
        <h4 className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
          Their game plan
        </h4>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {profile.gamePlan}
        </p>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Look out for
          </p>
          <ul className="mt-3 space-y-2">
            {profile.watchFor.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm leading-6 text-slate-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-300/20 bg-violet-300/5 p-4 sm:p-6">
        <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">
          Signature moves to recognise
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {canPlayClips
            ? "Tap a move to watch it loop — know what you are blocking before you commit to the punish."
            : "These are the patterns that define this character's neutral and pressure."}
        </p>
        <div className="mt-4 space-y-3">
          {profile.threats.map((threat) => {
            const clipKey = `matchup-${opponentName}-${threat.search}`;
            const isActive = activeClipKey === clipKey;

            return (
              <div
                key={threat.search}
                className={cx(
                  "rounded-xl border px-3 py-3 transition sm:px-4",
                  isActive
                    ? "border-violet-300/50 bg-violet-50"
                    : "border-slate-200 bg-slate-100/80",
                )}
              >
                {canPlayClips && onPlayClip ? (
                  <button
                    type="button"
                    onClick={() =>
                      onPlayClip(
                        clipKey,
                        { label: `Watch ${threat.label}`, search: threat.search },
                        profile.slug,
                      )
                    }
                    className={cx(
                      "text-left text-sm font-semibold transition",
                      isActive ? "text-violet-700" : "text-slate-950 hover:text-violet-700",
                    )}
                  >
                    <span className="underline decoration-slate-300 decoration-dotted underline-offset-4">
                      {threat.label}
                    </span>
                  </button>
                ) : (
                  <p className="text-sm font-semibold text-slate-950">{threat.label}</p>
                )}
                <p className="mt-2 text-sm leading-5 text-slate-600">{threat.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function MatchupBeatAdviceSection({
  characterId,
  opponentName,
  accent,
  bullets,
}: {
  characterId: GuideCharacterId;
  opponentName: string;
  accent: GuideAccent;
  bullets?: MatchupBullets;
}) {
  const sections = getBeatAdvice(characterId, opponentName, bullets);
  if (!sections.length) return null;

  const accentTitle: Record<GuideAccent, string> = {
    sky: "text-sky-600",
    cyan: "text-cyan-600",
    violet: "text-violet-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    orange: "text-orange-600",
  };

  return (
    <div className="mt-8 space-y-4">
      <div>
        <h4 className={cx("text-xs font-semibold uppercase tracking-[0.3em]", accentTitle[accent])}>
          How to beat them
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Character-specific habits, swing points, and the mistakes that hand them the round.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4 sm:p-5"
          >
            <h5 className="text-base font-semibold text-slate-950">{section.title}</h5>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

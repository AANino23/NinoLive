"use client";

import { MoveNotation, type GuideAccent } from "./guide-ui";
import {
  GUIDE_OKIZEME_SLUGS,
  getMoveClipSearch,
  getOpponentSlug,
  isSingleCommand,
} from "./opponent-clips";
import {
  getMatchupPunishment,
  type GuideCharacterId,
  type PunishTier,
} from "./punishment-data";

export type PunishClipHandler = (
  clipKey: string,
  clip: { label: string; search: string },
  characterSlug: string,
) => void;

type ClipProps = {
  onPlayClip?: PunishClipHandler;
  activeClipKey?: string | null;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clipKeyFor(slug: string, search: string) {
  return `punish-${slug}-${search}`;
}

function LaunchBadge() {
  return (
    <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
      launch
    </span>
  );
}

/**
 * Renders notation as a button that loads the move's clip, so a line like "block their
 * d+4" can be watched instead of imagined. Falls back to plain notation when the guide
 * has no player wired up or the notation is not a single lookup-able command.
 */
function ClipNotation({
  notation,
  slug,
  accent,
  onPlayClip,
  activeClipKey,
  size = "sm",
}: {
  notation: string;
  slug: string | null;
  accent: GuideAccent;
  size?: "sm" | "md";
} & ClipProps) {
  const search = getMoveClipSearch(notation);
  const playable = Boolean(onPlayClip) && Boolean(slug) && isSingleCommand(notation);

  if (!playable || !slug || !onPlayClip) {
    return <MoveNotation notation={notation} accent={accent} size={size} />;
  }

  const clipKey = clipKeyFor(slug, search);
  const isActive = activeClipKey === clipKey;

  return (
    <button
      type="button"
      onClick={() => onPlayClip(clipKey, { label: `Watch ${search}`, search }, slug)}
      title={`Watch ${search}`}
      className={cx(
        "inline-flex items-center rounded-lg border px-2 py-1 transition",
        isActive
          ? "border-slate-900 bg-slate-100 ring-1 ring-slate-900"
          : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50",
      )}
    >
      <MoveNotation notation={notation} accent={accent} size={size} />
    </button>
  );
}

function LadderTable({
  title,
  caption,
  tiers,
  accent,
  whiffPunish,
  characterSlug,
  onPlayClip,
  activeClipKey,
}: {
  title: string;
  caption: string;
  tiers: PunishTier[];
  accent: GuideAccent;
  whiffPunish?: string;
  characterSlug: string;
} & ClipProps) {
  return (
    <div className="mt-8 first:mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{caption}</p>
      <div className="-mx-3 mt-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.22em] text-slate-500">
              <th className="px-3 py-2 font-semibold">Frames</th>
              <th className="px-3 py-2 font-semibold">Your punish</th>
              <th className="hidden px-3 py-2 font-semibold sm:table-cell">Note</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.frames} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3 font-semibold text-slate-800">{tier.frames}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ClipNotation
                      notation={tier.move}
                      slug={characterSlug}
                      accent={accent}
                      onPlayClip={onPlayClip}
                      activeClipKey={activeClipKey}
                    />
                    {tier.launch ? <LaunchBadge /> : null}
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-slate-600 sm:table-cell">{tier.note ?? "—"}</td>
              </tr>
            ))}
            {whiffPunish ? (
              <tr className="border-t border-slate-200 bg-slate-50/80">
                <td className="px-3 py-3 font-semibold text-slate-800">Whiff</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {whiffPunish.split("/").map((option) => (
                      <ClipNotation
                        key={option}
                        notation={option.trim()}
                        slug={characterSlug}
                        accent={accent}
                        onPlayClip={onPlayClip}
                        activeClipKey={activeClipKey}
                      />
                    ))}
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-slate-600 sm:table-cell">
                  Use at range when they overextend.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MatchupPunishmentSection({
  characterId,
  opponentName,
  accent,
  onPlayClip,
  activeClipKey,
}: {
  characterId: GuideCharacterId;
  opponentName: string;
  accent: GuideAccent;
} & ClipProps) {
  const data = getMatchupPunishment(characterId, opponentName);
  const opponentSlug = getOpponentSlug(opponentName);
  const characterSlug = GUIDE_OKIZEME_SLUGS[characterId];
  const canPlayOpponentClips = Boolean(onPlayClip) && Boolean(opponentSlug);

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-3 sm:p-6">
      <div className="max-w-3xl">
        <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
          Punishment chart
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Playing <span className="font-semibold text-slate-900">{data.characterName}</span> vs{" "}
          <span className="font-semibold text-slate-900">{data.opponentName}</span>. Block first,
          match their minus frames to your punish tier, and work through the full list below — not
          just the signature moves.
          {onPlayClip ? " Tap any move to watch the clip." : null}
        </p>
      </div>

      <LadderTable
        title="Your punish ladder"
        caption="After blocking a mid or high, standing."
        tiers={data.ladder}
        accent={accent}
        whiffPunish={data.whiffPunish}
        characterSlug={characterSlug}
        onPlayClip={onPlayClip}
        activeClipKey={activeClipKey}
      />

      <LadderTable
        title="After blocking a low"
        caption="You are stuck in crouch, so these are your while-standing options."
        tiers={data.crouchLadder}
        accent={accent}
        characterSlug={characterSlug}
        onPlayClip={onPlayClip}
        activeClipKey={activeClipKey}
      />

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          What to punish on {data.opponentName} ({data.opponentPunishes.length} entries)
        </p>
        {canPlayOpponentClips ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tap their move to watch it loop, so you know what you are blocking before you
            commit to the punish.
          </p>
        ) : null}
        <div className="mt-3 space-y-3">
          {data.opponentPunishes.map((entry) => {
            const search = getMoveClipSearch(entry.move);
            const clipKey = opponentSlug ? clipKeyFor(opponentSlug, search) : null;
            const isActive = Boolean(clipKey) && activeClipKey === clipKey;

            return (
              <div
                key={`${entry.move}-${entry.minus}`}
                className={cx(
                  "rounded-xl border px-3 py-3 transition sm:px-4",
                  isActive
                    ? "border-slate-400 bg-white"
                    : "border-slate-200 bg-slate-50/80",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {canPlayOpponentClips && opponentSlug && clipKey && onPlayClip ? (
                      <button
                        type="button"
                        onClick={() =>
                          onPlayClip(
                            clipKey,
                            { label: `Watch ${search}`, search },
                            opponentSlug,
                          )
                        }
                        className={cx(
                          "text-left text-sm font-semibold transition",
                          isActive
                            ? "text-slate-950"
                            : "text-slate-900 hover:text-slate-950",
                        )}
                      >
                        <span className="underline decoration-slate-300 decoration-dotted underline-offset-4">
                          {entry.move}
                        </span>
                      </button>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900">{entry.move}</p>
                    )}
                    <p className="mt-1 text-sm leading-6 text-slate-600">{entry.note}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={cx(
                        "rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                        "border-slate-200 bg-white text-slate-600",
                      )}
                    >
                      -{entry.minus} on block
                    </span>
                    {entry.crouching ? (
                      <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                        block low
                      </span>
                    ) : null}
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      punish with
                    </span>
                    <ClipNotation
                      notation={entry.punish}
                      slug={characterSlug}
                      accent={accent}
                      onPlayClip={onPlayClip}
                      activeClipKey={activeClipKey}
                    />
                    {entry.punishLaunches ? <LaunchBadge /> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

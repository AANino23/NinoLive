import { MoveNotation, type GuideAccent } from "./guide-ui";
import { getMatchupPunishment, type GuideCharacterId } from "./punishment-data";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function MatchupPunishmentSection({
  characterId,
  opponentName,
  accent,
}: {
  characterId: GuideCharacterId;
  opponentName: string;
  accent: GuideAccent;
}) {
  const data = getMatchupPunishment(characterId, opponentName);

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-5 sm:p-6">
      <div className="max-w-3xl">
        <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
          Punishment chart
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Playing <span className="font-semibold text-slate-900">{data.characterName}</span> vs{" "}
          <span className="font-semibold text-slate-900">{data.opponentName}</span>. Match their
          minus frames to your punish tier — block first, then react with the right button.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Your punish ladder
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.22em] text-slate-500">
                <th className="px-3 py-2 font-semibold">Frames</th>
                <th className="px-3 py-2 font-semibold">Your punish</th>
                <th className="hidden px-3 py-2 font-semibold sm:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {data.ladder.map((tier) => (
                <tr key={tier.frames} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-3 font-semibold text-slate-800">{tier.frames}</td>
                  <td className="px-3 py-3">
                    <MoveNotation notation={tier.move} accent={accent} size="sm" />
                  </td>
                  <td className="hidden px-3 py-3 text-slate-600 sm:table-cell">
                    {tier.note ?? "—"}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50/80">
                <td className="px-3 py-3 font-semibold text-slate-800">Whiff</td>
                <td className="px-3 py-3">
                  <MoveNotation notation={data.whiffPunish} accent={accent} size="sm" />
                </td>
                <td className="hidden px-3 py-3 text-slate-600 sm:table-cell">
                  Use at range when they overextend.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          What to punish on {data.opponentName}
        </p>
        <div className="mt-3 space-y-3">
          {data.opponentPunishes.map((entry) => (
            <div
              key={`${entry.move}-${entry.minus}`}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{entry.move}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{entry.note}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                  <span
                    className={cx(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                      "border-slate-200 bg-white text-slate-600",
                    )}
                  >
                    {entry.minus} on block
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    punish with
                  </span>
                  <MoveNotation notation={entry.punish} accent={accent} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

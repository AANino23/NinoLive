import type { ReactNode } from "react";

export type GuideAccent =
  | "sky"
  | "orange"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "rose";

type SizeName = "sm" | "md" | "lg";

const accentText: Record<GuideAccent, string> = {
  sky: "text-sky-300",
  orange: "text-orange-300",
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

const accentTint: Record<GuideAccent, string> = {
  sky: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  orange: "border-orange-300/25 bg-orange-300/10 text-orange-100",
  cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  violet: "border-violet-300/25 bg-violet-300/10 text-violet-100",
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-100",
};

const tokenSizeClasses: Record<SizeName, string> = {
  sm: "gap-1 text-xs",
  md: "gap-1.5 text-sm",
  lg: "gap-2 text-base",
};

const chipSizeClasses: Record<SizeName, string> = {
  sm: "min-h-7 rounded-xl px-2 py-1 text-[0.68rem]",
  md: "min-h-8 rounded-xl px-2.5 py-1.5 text-xs",
  lg: "min-h-9 rounded-2xl px-3 py-2 text-sm",
};

const buttonSizeClasses: Record<SizeName, string> = {
  sm: "h-6 w-6 text-[0.7rem]",
  md: "h-7 w-7 text-xs",
  lg: "h-8 w-8 text-sm",
};

const directionGlyphs: Record<string, string> = {
  u: "↑",
  ub: "↖",
  uf: "↗",
  d: "↓",
  db: "↙",
  df: "↘",
  b: "←",
  f: "→",
  ff: "→→",
  bb: "←←",
};

const directionLabels: Record<string, string> = {
  u: "Up",
  ub: "Up Back",
  uf: "Up Forward",
  d: "Down",
  db: "Down Back",
  df: "Down Forward",
  b: "Back",
  f: "Forward",
  ff: "Dash",
  bb: "Backdash",
  qcf: "Quarter Circle Forward",
  qcb: "Quarter Circle Back",
  wr: "While Running",
  ws: "While Standing",
  fc: "Full Crouch",
};

const stanceLabels = new Set([
  "PAB",
  "FLK",
  "LNH",
  "RAM",
  "DES",
  "GRF",
  "DCK",
  "CH",
  "GP",
  "REC",
  "EX",
  "VS",
  "GF",
  "BT",
]);

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function splitClipLabel(label: string) {
  const match = label.match(/^(Watch|Play)\s+(.+)$/u);

  if (!match) {
    return { verb: "Clip", move: label };
  }

  return { verb: match[1], move: match[2] };
}

function renderQuarterCircle(direction: "qcf" | "qcb", size: SizeName) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cx(size === "lg" ? "h-5 w-5" : "h-4 w-4", "shrink-0")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "qcf" ? (
        <>
          <path d="M6 16c2.5 0 4.6-1 6.1-2.6C13.6 11.9 14.6 9.8 14.6 7.4" />
          <path d="M12.8 9.2 14.8 7.2 16.8 9.2" />
          <path d="M12.2 13.8h6" />
          <path d="m16.6 11.8 2 2-2 2" />
        </>
      ) : (
        <>
          <path d="M18 16c-2.5 0-4.6-1-6.1-2.6C10.4 11.9 9.4 9.8 9.4 7.4" />
          <path d="M11.2 9.2 9.2 7.2 7.2 9.2" />
          <path d="M11.8 13.8h-6" />
          <path d="m7.4 11.8-2 2 2 2" />
        </>
      )}
    </svg>
  );
}

function DirectionToken({
  value,
  accent,
  size,
}: {
  value: string;
  accent: GuideAccent;
  size: SizeName;
}) {
  const normalised = value.toLowerCase();
  const label = directionLabels[normalised] ?? value.toUpperCase();

  return (
    <span
      title={label}
      className={cx(
        "inline-flex items-center gap-1.5 border font-semibold uppercase tracking-[0.18em]",
        accentTint[accent],
        chipSizeClasses[size],
      )}
    >
      {normalised === "qcf" || normalised === "qcb" ? (
        renderQuarterCircle(normalised, size)
      ) : (
        <span aria-hidden="true" className="text-sm">
          {directionGlyphs[normalised] ?? value.toUpperCase()}
        </span>
      )}
      <span>{value.toUpperCase()}</span>
    </span>
  );
}

function AttackToken({
  value,
  accent,
  size,
}: {
  value: string;
  accent: GuideAccent;
  size: SizeName;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full border font-black",
        accentTint[accent],
        buttonSizeClasses[size],
      )}
    >
      {value}
    </span>
  );
}

function StanceToken({
  value,
  accent,
  size,
}: {
  value: string;
  accent: GuideAccent;
  size: SizeName;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2 py-1 font-semibold uppercase tracking-[0.18em]",
        accentTint[accent],
        size === "lg" ? "text-xs" : "text-[0.68rem]",
      )}
    >
      {value}
    </span>
  );
}

function renderCoreToken(
  token: string,
  accent: GuideAccent,
  size: SizeName,
  keyPrefix: string,
): ReactNode {
  if (!token) {
    return null;
  }

  if (token.includes("/")) {
    return token.split("/").map((part, index) => (
      <span key={`${keyPrefix}-slash-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="text-slate-500">/</span> : null}
        {renderCoreToken(part, accent, size, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (token.includes("~")) {
    return token.split("~").map((part, index) => (
      <span key={`${keyPrefix}-tilde-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="text-slate-500">~</span> : null}
        {renderCoreToken(part, accent, size, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (token.includes(",")) {
    return token.split(",").map((part, index) => (
      <span key={`${keyPrefix}-comma-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="text-slate-500">,</span> : null}
        {renderCoreToken(part, accent, size, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (/^[A-Za-z]+\.[A-Za-z0-9+]+$/u.test(token)) {
    const [stance, followup] = token.split(".");
    return (
      <span className="inline-flex items-center gap-1" key={`${keyPrefix}-stance-followup`}>
        {renderCoreToken(stance, accent, size, `${keyPrefix}-stance`)}
        <span className="text-slate-500">.</span>
        {renderCoreToken(followup, accent, size, `${keyPrefix}-followup`)}
      </span>
    );
  }

  if (token.includes("+")) {
    const plusParts = token.split("+");
    return plusParts.map((part, index) => (
      <span key={`${keyPrefix}-plus-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="text-slate-500">+</span> : null}
        {renderCoreToken(part, accent, size, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  const upper = token.toUpperCase();
  const lower = token.toLowerCase();

  if (/^[1-4]$/u.test(token)) {
    return <AttackToken value={token} accent={accent} size={size} />;
  }

  if (lower in directionLabels) {
    return <DirectionToken value={lower} accent={accent} size={size} />;
  }

  if (stanceLabels.has(upper)) {
    return <StanceToken value={upper} accent={accent} size={size} />;
  }

  return <span className="text-slate-100">{token}</span>;
}

function renderNotationToken(
  token: string,
  accent: GuideAccent,
  size: SizeName,
  keyPrefix: string,
) {
  const leading = token.match(/^[([{]+/u)?.[0] ?? "";
  const trailing = token.match(/[)\]}:;.!?]+$/u)?.[0] ?? "";
  const core = token.slice(leading.length, token.length - trailing.length);

  return (
    <span key={keyPrefix} className="inline-flex items-center gap-1">
      {leading ? <span className="text-slate-500">{leading}</span> : null}
      {renderCoreToken(core || token, accent, size, `${keyPrefix}-core`)}
      {trailing ? <span className="text-slate-500">{trailing}</span> : null}
    </span>
  );
}

export function MoveNotation({
  notation,
  accent = "sky",
  size = "md",
  className,
}: {
  notation: string;
  accent?: GuideAccent;
  size?: SizeName;
  className?: string;
}) {
  const pieces = notation.split(/(\s+)/u);

  return (
    <span className={cx("inline-flex flex-wrap items-center", tokenSizeClasses[size], className)}>
      {pieces.map((piece, index) =>
        /\s+/u.test(piece) ? (
          <span key={`space-${index}`} className="w-1.5" />
        ) : (
          renderNotationToken(piece, accent, size, `token-${index}`)
        ),
      )}
    </span>
  );
}

export function StepBadge({
  step,
  accent,
}: {
  step: number;
  accent: GuideAccent;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={cx(
          "inline-flex h-11 w-11 items-center justify-center rounded-2xl border font-black",
          accentTint[accent],
        )}
      >
        {step}
      </span>
      <span className={cx("text-xs font-semibold uppercase tracking-[0.3em]", accentText[accent])}>
        Step
      </span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  accent,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  accent: GuideAccent;
}) {
  return (
    <div className="max-w-3xl">
      <p className={cx("text-xs font-semibold uppercase tracking-[0.3em]", accentText[accent])}>
        {eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{copy}</p>
    </div>
  );
}

export function ClipButtonLabel({
  label,
  accent,
  active,
}: {
  label: string;
  accent: GuideAccent;
  active?: boolean;
}) {
  const { verb, move } = splitClipLabel(label);

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cx(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border text-[0.68rem] font-black",
          active ? "border-slate-950/15 bg-slate-950/10 text-slate-950" : accentTint[accent],
        )}
      >
        {verb === "Watch" ? ">" : "+"}
      </span>
      <span className="flex flex-col items-start">
        <span className={cx("text-[0.62rem] font-semibold uppercase tracking-[0.22em]", active ? "text-slate-800" : accentText[accent])}>
          {verb}
        </span>
        <MoveNotation
          notation={move}
          accent={active ? "sky" : accent}
          size="sm"
          className={active ? "text-slate-950" : undefined}
        />
      </span>
    </span>
  );
}

export function ClipPlayerEmpty({
  accent,
  title,
  description,
}: {
  accent: GuideAccent;
  title: string;
  description: string;
}) {
  return (
    <aside className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm leading-7 text-slate-400 xl:sticky xl:top-6">
      <p className={cx("text-xs font-semibold uppercase tracking-[0.3em]", accentText[accent])}>
        {title}
      </p>
      <p className="mt-3">{description}</p>
    </aside>
  );
}

export function ClipPlayerFrame({
  accent,
  label,
  href,
  children,
}: {
  accent: GuideAccent;
  label: string;
  href: string;
  children: ReactNode;
}) {
  const { move } = splitClipLabel(label);

  return (
    <aside className={cx("overflow-hidden rounded-3xl border bg-slate-950/80 shadow-2xl shadow-slate-950/40 xl:sticky xl:top-6", accentTint[accent])}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950 px-4 py-3">
        <div>
          <p className={cx("text-xs font-semibold uppercase tracking-[0.3em]", accentText[accent])}>
            Now watching
          </p>
          <div className="mt-2">
            <MoveNotation notation={move} accent={accent} size="md" />
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:text-white"
        >
          Full move card
        </a>
      </div>
      {children}
    </aside>
  );
}

function TabIcon({
  children,
  accent,
  active,
}: {
  children: ReactNode;
  accent: GuideAccent;
  active: boolean;
}) {
  return (
    <span
      className={cx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
        active ? "border-slate-950/20 bg-slate-950/10 text-slate-950" : accentTint[accent],
      )}
    >
      {children}
    </span>
  );
}

export function GuideTabGlyph({
  tabId,
  accent,
  active,
}: {
  tabId: string;
  accent: GuideAccent;
  active: boolean;
}) {
  switch (tabId) {
    case "dojo":
      return (
        <TabIcon accent={accent} active={active}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8h12" />
            <path d="M4 10v4" />
            <path d="M20 10v4" />
            <path d="M7 12h10" />
            <path d="M6 16h12" />
          </svg>
        </TabIcon>
      );
    case "gameplan":
      return (
        <TabIcon accent={accent} active={active}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 18c3-8 8-12 16-12" />
            <path d="m15 4 5 2-2 5" />
            <circle cx="7" cy="16" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="11" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </TabIcon>
      );
    case "toolkit":
      return (
        <TabIcon accent={accent} active={active}>
          <span className="flex items-center gap-1">
            <AttackToken value="1" accent={active ? "sky" : accent} size="sm" />
            <AttackToken value="2" accent={active ? "sky" : accent} size="sm" />
          </span>
        </TabIcon>
      );
    case "clips":
      return (
        <TabIcon accent={accent} active={active}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
          </svg>
        </TabIcon>
      );
    case "secrets":
      return (
        <TabIcon accent={accent} active={active}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3 1.8 4.8L19 9.6l-4.2 3.2L16.2 18 12 14.9 7.8 18l1.4-5.2L5 9.6l5.2-1.8Z" />
          </svg>
        </TabIcon>
      );
    case "matchups":
      return (
        <TabIcon accent={accent} active={active}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 7h5v5" />
            <path d="m6 12 5-5" />
            <path d="M18 17h-5v-5" />
            <path d="m18 12-5 5" />
          </svg>
        </TabIcon>
      );
    default:
      return (
        <TabIcon accent={accent} active={active}>
          <span className="text-xs font-black uppercase tracking-[0.16em]">UI</span>
        </TabIcon>
      );
  }
}

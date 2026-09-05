import type { ReactNode } from "react";

import {
  ButtonCluster,
  DirectionIcon,
  MotionIcons,
  directionNames,
  notationDirections,
  type NotationDirection,
} from "./notation-icons";

export { NotationLegend } from "./notation-icons";

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
  sky: "text-sky-600",
  orange: "text-orange-600",
  cyan: "text-cyan-600",
  violet: "text-violet-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
};

const accentTint: Record<GuideAccent, string> = {
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

const tokenSizeClasses: Record<SizeName, string> = {
  sm: "gap-1 text-xs",
  md: "gap-1.5 text-sm",
  lg: "gap-2 text-base",
};

const chipSizeClasses: Record<SizeName, string> = {
  sm: "px-1.5 py-0.5 text-[0.62rem]",
  md: "px-2 py-1 text-[0.68rem]",
  lg: "px-2.5 py-1 text-xs",
};

const directionLabels: Record<string, string> = {
  ...directionNames,
  ff: "Dash",
  bb: "Backdash",
  qcf: "Quarter Circle Forward",
  qcb: "Quarter Circle Back",
  wr: "While Running",
  ws: "While Standing",
  fc: "Full Crouch",
};

const stanceLabels = new Set([
  "ALB",
  "AOP",
  "BT",
  "CD",
  "CH",
  "DCK",
  "DES",
  "DSS",
  "EX",
  "EXD",
  "FC",
  "FLK",
  "GAR",
  "GF",
  "GP",
  "GRF",
  "H",
  "HRM",
  "HRS",
  "HYP",
  "IAI",
  "IZU",
  "JGR",
  "KNK",
  "KNP",
  "LIB",
  "LNH",
  "MNT",
  "NSS",
  "PAB",
  "PGN",
  "RAM",
  "REC",
  "RFS",
  "RLX",
  "RWV",
  "SCR",
  "SEN",
  "SNK",
  "SS",
  "SWA",
  "TFA",
  "VS",
  "WGS",
  "WR",
  "WS",
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

/**
 * A bare direction icon rather than a bordered chip: a row of block arrows reads
 * as a single input sequence, where a row of chips reads as separate labels.
 * Uppercase in the guide data means "hold", which the filled arrow shows.
 */
function DirectionToken({
  value,
  accent,
  size,
}: {
  value: string;
  accent: GuideAccent;
  size: SizeName;
}) {
  const normalised = value.toLowerCase() as NotationDirection;
  const hold = value === value.toUpperCase();

  return (
    <span className={accentText[accent]}>
      <DirectionIcon direction={normalised} hold={hold} size={size} />
    </span>
  );
}

/** `ff` / `bb` are a dash, so draw the direction twice. */
function DashToken({
  direction,
  accent,
  size,
}: {
  direction: "f" | "b";
  accent: GuideAccent;
  size: SizeName;
}) {
  const label = direction === "f" ? "Dash" : "Backdash";

  return (
    <span className={cx("inline-flex items-center gap-0.5", accentText[accent])} title={label}>
      <DirectionIcon direction={direction} size={size} title={label} />
      <DirectionIcon direction={direction} size={size} title={label} />
    </span>
  );
}

function MotionToken({
  motion,
  accent,
  size,
}: {
  motion: "qcf" | "qcb";
  accent: GuideAccent;
  size: SizeName;
}) {
  return (
    <span className={accentText[accent]}>
      <MotionIcons motion={motion} size={size} />
    </span>
  );
}

function AttackToken({
  values,
  accent,
  size,
}: {
  values: Array<"1" | "2" | "3" | "4">;
  accent: GuideAccent;
  size: SizeName;
}) {
  return (
    <span className={accentText[accent]}>
      <ButtonCluster buttons={values} size={size} />
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
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-[0.18em]",
        accentTint[accent],
        chipSizeClasses[size],
      )}
    >
      {value}
    </span>
  );
}

const attackButtons = /^[1-4]$/u;

/** Rewrites `u/f` style diagonals to `uf` so the slash is only ever "or". */
function collapseDiagonals(token: string) {
  return token.replace(
    /(^|[^A-Za-z])([udbfUDBF])\/([udbfUDBF])(?![A-Za-z])/gu,
    (match, lead: string, first: string, second: string) =>
      notationDirections.has(`${first}${second}`.toLowerCase())
        ? `${lead}${first}${second}`
        : match,
  );
}

/** Splits `df+3+4` into its direction/stance head and the buttons pressed with it. */
function splitButtons(token: string) {
  const parts = token.split("+");
  const buttons: Array<"1" | "2" | "3" | "4"> = [];

  let index = parts.length - 1;
  while (index >= 0 && attackButtons.test(parts[index])) {
    buttons.unshift(parts[index] as "1" | "2" | "3" | "4");
    index -= 1;
  }

  return { head: parts.slice(0, index + 1), buttons };
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

  // `u/f` is the same input as `uf`; collapse it before the split below reads
  // the slash as "or". `H.u/f+2` needs this mid-token, not just at the start.
  const collapsed = collapseDiagonals(token);
  if (collapsed !== token) {
    return renderCoreToken(collapsed, accent, size, `${keyPrefix}-diag`);
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

  // Just-frame links such as `3:3:3`.
  if (token.includes(":")) {
    return token.split(":").map((part, index) => (
      <span key={`${keyPrefix}-colon-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="font-semibold text-slate-500">:</span> : null}
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

  // Shorthand where the state is glued to the buttons, e.g. `ws4` or `ws1+2`.
  const glued = token.match(/^([A-Za-z]{1,3})([1-4](?:\+[1-4])*)$/u);
  if (
    glued &&
    (glued[1].toLowerCase() in directionLabels || stanceLabels.has(glued[1].toUpperCase()))
  ) {
    return (
      <span className="inline-flex items-center gap-1">
        {renderCoreToken(glued[1], accent, size, `${keyPrefix}-glued-head`)}
        {renderCoreToken(glued[2], accent, size, `${keyPrefix}-glued-buttons`)}
      </span>
    );
  }

  if (token.includes("+")) {
    const { head, buttons } = splitButtons(token);

    // Simultaneous presses become one cluster with several buttons lit, rather
    // than separate icons joined by a `+`.
    if (buttons.length > 0) {
      return (
        <span className="inline-flex items-center gap-1">
          {head.map((part, index) => (
            <span key={`${keyPrefix}-head-${index}`} className="inline-flex items-center gap-1">
              {index > 0 ? <span className="text-slate-500">+</span> : null}
              {renderCoreToken(part, accent, size, `${keyPrefix}-head-${index}`)}
            </span>
          ))}
          <AttackToken values={buttons} accent={accent} size={size} />
        </span>
      );
    }

    return token.split("+").map((part, index) => (
      <span key={`${keyPrefix}-plus-${index}`} className="inline-flex items-center gap-1">
        {index > 0 ? <span className="text-slate-500">+</span> : null}
        {renderCoreToken(part, accent, size, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  const upper = token.toUpperCase();
  const lower = token.toLowerCase();

  if (attackButtons.test(token)) {
    return <AttackToken values={[token as "1" | "2" | "3" | "4"]} accent={accent} size={size} />;
  }

  if (notationDirections.has(lower)) {
    return <DirectionToken value={token} accent={accent} size={size} />;
  }

  if (lower === "ff" || lower === "bb") {
    return <DashToken direction={lower === "ff" ? "f" : "b"} accent={accent} size={size} />;
  }

  if (lower === "qcf" || lower === "qcb") {
    return <MotionToken motion={lower} accent={accent} size={size} />;
  }

  if (stanceLabels.has(upper) || lower in directionLabels) {
    return <StanceToken value={upper} accent={accent} size={size} />;
  }

  return <span className="text-slate-800">{token}</span>;
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
      <h2 className="mt-4 text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{copy}</p>
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
  const isWatch = verb === "Watch";

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex flex-col items-start">
        {isWatch ? (
          <span
            className={cx(
              "text-[0.62rem] font-semibold uppercase tracking-[0.22em]",
              active ? "text-slate-800" : accentText[accent],
            )}
          >
            {verb}
          </span>
        ) : null}
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
    <aside className="rounded-3xl border border-dashed border-slate-200 bg-white/75 p-6 text-sm leading-7 text-slate-500">
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
  owner,
  children,
  onDismiss,
  variant = "stage",
}: {
  accent: GuideAccent;
  label: string;
  href: string;
  /** Whose move is on screen — matters once opponent clips share the player. */
  owner?: string | null;
  children: ReactNode;
  onDismiss?: () => void;
  variant?: "stage" | "dock";
}) {
  const { move } = splitClipLabel(label);
  const isDock = variant === "dock";

  return (
    <aside
      className={cx(
        "overflow-hidden border bg-white/95 shadow-2xl shadow-slate-300/40",
        isDock ? "rounded-t-3xl border-slate-200" : "rounded-3xl",
        accentTint[accent],
      )}
    >
      <div
        className={cx(
          "flex items-start justify-between gap-3 border-b border-slate-200 bg-white",
          isDock ? "px-3 py-2.5" : "px-4 py-3",
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            className={cx(
              "font-semibold uppercase tracking-[0.3em]",
              isDock ? "text-[0.58rem]" : "text-xs",
              accentText[accent],
            )}
          >
            Now watching{owner ? ` · ${owner}` : ""}
          </p>
          <div className={cx(isDock ? "mt-1" : "mt-2")}>
            <MoveNotation notation={move} accent={accent} size={isDock ? "sm" : "md"} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cx(
              "rounded-full border border-slate-200 text-slate-600 transition hover:text-slate-950",
              isDock ? "px-2.5 py-1.5 text-[0.65rem]" : "px-3 py-2 text-xs",
            )}
          >
            Move card
          </a>
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close clip"
              className={cx(
                "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950",
                isDock ? "h-8 w-8 text-base" : "h-9 w-9 text-lg",
              )}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>
      <div className={isDock ? "flex justify-center bg-black" : undefined}>
        {children}
      </div>
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
        active ? "border-slate-300 bg-slate-100 text-slate-900" : accentTint[accent],
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
          <AttackToken values={["1", "2"]} accent={active ? "sky" : accent} size="lg" />
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

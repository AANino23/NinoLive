/**
 * Tekken input icons.
 *
 * These replace the plain text/unicode notation ("b", "df", "3,4") with the
 * arcade-style icon language used on command boards: chunky block arrows for
 * directions and a 2x2 button cluster where the pressed buttons light up.
 *
 * Two conventions carry meaning:
 *
 * - outlined arrow = tap the direction, filled arrow = hold it
 *   (this mirrors the `f` vs `F` casing already used in the guide data)
 * - neutral (`n`) is a star, matching how release-to-neutral is drawn
 *
 * Everything is inline SVG using `currentColor`, so an icon picks up whatever
 * accent colour its guide is themed with.
 */

export type IconSize = "sm" | "md" | "lg";

export type NotationDirection =
  | "u"
  | "ub"
  | "uf"
  | "d"
  | "db"
  | "df"
  | "b"
  | "f"
  | "n";

export const notationDirections = new Set<string>([
  "u",
  "ub",
  "uf",
  "d",
  "db",
  "df",
  "b",
  "f",
  "n",
]);

export const directionNames: Record<NotationDirection, string> = {
  u: "Up",
  ub: "Up back",
  uf: "Up forward",
  d: "Down",
  db: "Down back",
  df: "Down forward",
  b: "Back",
  f: "Forward",
  n: "Neutral",
};

export const buttonNames: Record<string, string> = {
  "1": "Left punch",
  "2": "Right punch",
  "3": "Left kick",
  "4": "Right kick",
};

/** Fat block arrow pointing up, drawn inside a 24x24 box. */
const ARROW_PATH = "M12 2.6 L21.4 12.2 L16.4 12.2 L16.4 21.4 L7.6 21.4 L7.6 12.2 L2.6 12.2 Z";

/** Five point star used for the neutral input. */
const STAR_PATH =
  "M12 2.6 L14.53 8.52 L20.94 9.1 L16.09 13.33 L17.52 19.6 L12 16.3 L6.48 19.6 L7.91 13.33 L3.06 9.1 L9.47 8.52 Z";

const arrowRotation: Record<Exclude<NotationDirection, "n">, number> = {
  u: 0,
  uf: 45,
  f: 90,
  df: 135,
  d: 180,
  db: 225,
  b: 270,
  ub: 315,
};

const directionSizeClasses: Record<IconSize, string> = {
  sm: "h-[1.05rem] w-[1.05rem]",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const buttonSizeClasses: Record<IconSize, string> = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function DirectionIcon({
  direction,
  hold = false,
  size = "md",
  className,
  title,
}: {
  direction: NotationDirection;
  hold?: boolean;
  size?: IconSize;
  className?: string;
  title?: string;
}) {
  const label = title ?? `${directionNames[direction]}${hold ? " (hold)" : ""}`;

  if (direction === "n") {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 24 24"
        className={cx("shrink-0", directionSizeClasses[size], className)}
        fill={hold ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={hold ? 1.4 : 1.9}
        strokeLinejoin="round"
      >
        <title>{label}</title>
        <path d={STAR_PATH} />
      </svg>
    );
  }

  const angle = arrowRotation[direction];
  // A rotated square reads as bigger than an upright one, so trim the diagonals
  // slightly to keep every arrow the same optical weight in a row.
  const scale = angle % 90 === 0 ? 1 : 0.9;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      className={cx("shrink-0", directionSizeClasses[size], className)}
      fill={hold ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={hold ? 1.4 : 1.9}
      strokeLinejoin="round"
    >
      <title>{label}</title>
      <g transform={`translate(12 12) rotate(${angle}) scale(${scale}) translate(-12 -12)`}>
        <path d={ARROW_PATH} />
      </g>
    </svg>
  );
}

type ButtonSlot = {
  id: "1" | "2" | "3" | "4";
  cx: number;
  cy: number;
};

/**
 * Slightly tilted 2x2 layout: the right column sits a touch higher, the way the
 * punch/kick buttons are staggered on an arcade panel.
 */
const buttonSlots: ButtonSlot[] = [
  { id: "1", cx: 6.7, cy: 7.6 },
  { id: "2", cx: 17.3, cy: 6.4 },
  { id: "3", cx: 6.7, cy: 17.6 },
  { id: "4", cx: 17.3, cy: 16.4 },
];

const BUTTON_RADIUS = 4.7;

export function ButtonCluster({
  buttons,
  size = "md",
  className,
}: {
  buttons: Array<"1" | "2" | "3" | "4">;
  size?: IconSize;
  className?: string;
}) {
  const pressed = new Set(buttons);
  const label = buttons.length
    ? buttons.map((button) => buttonNames[button] ?? button).join(" + ")
    : "No button";

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      className={cx("shrink-0", buttonSizeClasses[size], className)}
    >
      <title>{label}</title>
      {buttonSlots.map((slot) => {
        const isPressed = pressed.has(slot.id);

        return (
          <g key={slot.id}>
            <circle
              cx={slot.cx}
              cy={slot.cy}
              r={BUTTON_RADIUS}
              fill={isPressed ? "currentColor" : "#e2e8f0"}
              stroke={isPressed ? "rgba(15,23,42,0.55)" : "#94a3b8"}
              strokeWidth={1.1}
            />
            <ellipse
              cx={slot.cx}
              cy={slot.cy - 1.35}
              rx={2.5}
              ry={1.6}
              fill="#ffffff"
              opacity={isPressed ? 0.34 : 0.62}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Quarter circles are drawn as the three inputs you actually press, which reads
 * better on a study board than an abstract arc.
 */
export function MotionIcons({
  motion,
  size = "md",
}: {
  motion: "qcf" | "qcb";
  size?: IconSize;
}) {
  const steps: NotationDirection[] = motion === "qcf" ? ["d", "df", "f"] : ["d", "db", "b"];
  const label = motion === "qcf" ? "Quarter circle forward" : "Quarter circle back";

  return (
    <span className="inline-flex items-center gap-0.5" title={label}>
      {steps.map((step) => (
        <DirectionIcon key={step} direction={step} size={size} title={label} />
      ))}
    </span>
  );
}

const legendRows: Array<{ label: string; icon: React.ReactNode }> = [
  { label: "Tap the direction", icon: <DirectionIcon direction="f" size="lg" /> },
  { label: "Hold the direction", icon: <DirectionIcon direction="f" size="lg" hold /> },
  { label: "Return to neutral", icon: <DirectionIcon direction="n" size="lg" /> },
  { label: "Left punch (1)", icon: <ButtonCluster buttons={["1"]} size="lg" /> },
  { label: "Right punch (2)", icon: <ButtonCluster buttons={["2"]} size="lg" /> },
  { label: "Left kick (3)", icon: <ButtonCluster buttons={["3"]} size="lg" /> },
  { label: "Right kick (4)", icon: <ButtonCluster buttons={["4"]} size="lg" /> },
  { label: "Both punches (1+2)", icon: <ButtonCluster buttons={["1", "2"]} size="lg" /> },
];

/** Drop-in key so a first-time reader can decode the icons on a guide page. */
export function NotationLegend({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-slate-200 bg-white/75 p-5 text-slate-700",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Reading the inputs
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {legendRows.map((row) => (
          <li key={row.label} className="flex items-center gap-2.5 text-xs leading-5">
            <span className="text-slate-800">{row.icon}</span>
            <span>{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

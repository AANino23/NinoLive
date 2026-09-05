"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { OkizemeClipVideo } from "./clip-video";
import { ClipPlayerFrame, type GuideAccent } from "./guide-ui";
import { getOkizemeDisplayName } from "./opponent-clips";

type GuideClip = {
  label: string;
  search: string;
};

export type GuideActiveClip = {
  clipKey: string;
  clip: GuideClip;
  characterSlug?: string;
};

const DESKTOP_QUERY = "(min-width: 1024px)";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Tracks the desktop breakpoint so the clip can be a sticky stage there and an overlay on phones. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}

function GuideClipPlayer({
  accent,
  activeClip,
  characterSlug,
  getHref,
  onDismiss,
  variant,
}: {
  accent: GuideAccent;
  activeClip: GuideActiveClip;
  characterSlug: string;
  getHref: (search: string, slug: string) => string;
  onDismiss: () => void;
  variant: "stage" | "overlay";
}) {
  const slug = activeClip.characterSlug ?? characterSlug;

  return (
    <ClipPlayerFrame
      accent={accent}
      label={activeClip.clip.label}
      href={getHref(activeClip.clip.search, slug)}
      owner={getOkizemeDisplayName(slug)}
      onDismiss={onDismiss}
      variant={variant}
    >
      <OkizemeClipVideo
        character={slug}
        search={activeClip.clip.search}
        clipKey={activeClip.clipKey}
        className={
          variant === "overlay"
            ? "aspect-video max-h-[60vh] w-full bg-black object-contain"
            : "aspect-video w-full bg-black"
        }
      />
    </ClipPlayerFrame>
  );
}

/**
 * On phones the clip opens as a centred overlay instead of a dock pinned to the bottom
 * edge: a video parked under your thumb is easy to miss and impossible to size, whereas
 * an overlay lands in the middle of the screen no matter which card you tapped.
 *
 * It renders through a portal because the guide sits inside a `backdrop-blur` card, and
 * a backdrop filter makes that card the containing block for `position: fixed` children
 * — which is why the clip used to land at the bottom of the page instead of the screen.
 */
function GuideClipOverlay({
  accent,
  activeClip,
  characterSlug,
  getHref,
  onDismiss,
}: {
  accent: GuideAccent;
  activeClip: GuideActiveClip;
  characterSlug: string;
  getHref: (search: string, slug: string) => string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onDismiss]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Move clip"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close clip"
        onClick={onDismiss}
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg">
        <GuideClipPlayer
          accent={accent}
          activeClip={activeClip}
          characterSlug={characterSlug}
          getHref={getHref}
          onDismiss={onDismiss}
          variant="overlay"
        />
      </div>
    </div>,
    document.body,
  );
}

export function GuideClipSection({
  accent,
  characterSlug,
  activeClip,
  onDismiss,
  getHref,
  children,
  contentClassName,
}: {
  accent: GuideAccent;
  characterSlug: string;
  activeClip: GuideActiveClip | null;
  onDismiss: () => void;
  getHref: (search: string, slug: string) => string;
  children: ReactNode;
  contentClassName?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const activeClipKey = activeClip?.clipKey;

  useEffect(() => {
    if (!activeClipKey || !stageRef.current || !isDesktop) {
      return;
    }

    stageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeClipKey, isDesktop]);

  return (
    <div className="relative space-y-6">
      {activeClip ? (
        // Only one player is mounted at a time so a phone never fetches the clip twice.
        isDesktop ? (
          <div ref={stageRef} className="lg:sticky lg:top-4 lg:z-20">
            <GuideClipPlayer
              accent={accent}
              activeClip={activeClip}
              characterSlug={characterSlug}
              getHref={getHref}
              onDismiss={onDismiss}
              variant="stage"
            />
          </div>
        ) : (
          <GuideClipOverlay
            accent={accent}
            activeClip={activeClip}
            characterSlug={characterSlug}
            getHref={getHref}
            onDismiss={onDismiss}
          />
        )
      ) : null}

      <div className={cx("grid gap-4 sm:gap-5", contentClassName)}>{children}</div>
    </div>
  );
}

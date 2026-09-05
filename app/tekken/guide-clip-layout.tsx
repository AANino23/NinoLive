"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
  variant: "stage" | "dock";
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
          variant === "dock"
            ? "mx-auto aspect-video max-h-[min(36vh,13.5rem)] w-full bg-black object-contain"
            : "aspect-video w-full bg-black"
        }
      />
    </ClipPlayerFrame>
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
  const activeClipKey = activeClip?.clipKey;

  useEffect(() => {
    if (!activeClipKey || !stageRef.current) {
      return;
    }

    if (window.matchMedia("(min-width: 1024px)").matches) {
      stageRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeClipKey]);

  return (
    <div className="relative space-y-6">
      {activeClip ? (
        <>
          <div ref={stageRef} className="hidden lg:block lg:sticky lg:top-4 lg:z-20">
            <GuideClipPlayer
              accent={accent}
              activeClip={activeClip}
              characterSlug={characterSlug}
              getHref={getHref}
              onDismiss={onDismiss}
              variant="stage"
            />
          </div>

          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden"
            aria-live="polite"
          >
            <div className="pointer-events-auto border-t border-slate-200 bg-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-18px_40px_rgba(15,23,42,0.18)] backdrop-blur">
              <GuideClipPlayer
                accent={accent}
                activeClip={activeClip}
                characterSlug={characterSlug}
                getHref={getHref}
                onDismiss={onDismiss}
                variant="dock"
              />
            </div>
          </div>

          <div
            className="h-[min(42vh,16rem)] lg:hidden"
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className={cx("grid gap-5", contentClassName)}>{children}</div>
    </div>
  );
}

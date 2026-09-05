"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * okizeme hands out CDN links signed with a one-hour token. A clip that was opened, left
 * on screen and seeked later can therefore fail on a link that was valid when it loaded,
 * so a playback error is worth one silent retry with a freshly signed URL before the
 * fallback message goes up.
 */
const MAX_ATTEMPTS = 2;

function OkizemeClipVideoLoader({
  character,
  search,
  className = "aspect-video w-full bg-black",
}: {
  character: string;
  search: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({
      character,
      move: search,
    });

    fetch(`/api/okizeme-clip?${params.toString()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Clip unavailable");
        }

        return response.json() as Promise<{ presignedUrl?: string }>;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        if (data.presignedUrl) {
          setSrc(data.presignedUrl);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [character, search, attempt]);

  const onPlaybackError = useCallback(() => {
    if (attempt + 1 >= MAX_ATTEMPTS) {
      setError(true);
      return;
    }

    // Dropping the src first swaps the dead video back to the spinner while the effect
    // re-runs for a freshly signed URL.
    setSrc(null);
    setAttempt(attempt + 1);
  }, [attempt]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center px-6 text-center text-sm leading-6 text-slate-400 ${className}`}
      >
        Clip unavailable right now. Use the full move card link above.
      </div>
    );
  }

  if (!src) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <video
      className={className}
      controls
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      src={src}
      onError={onPlaybackError}
    >
      Your browser does not support embedded video playback.
    </video>
  );
}

export function OkizemeClipVideo({
  clipKey,
  ...props
}: {
  character: string;
  search: string;
  clipKey: string;
  className?: string;
}) {
  return <OkizemeClipVideoLoader key={clipKey} {...props} />;
}

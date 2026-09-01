"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({
      character,
      move: search,
    });

    fetch(`/api/okizeme-clip?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Clip unavailable");
        }

        return response.json() as Promise<{ presignedUrl?: string }>;
      })
      .then((data) => {
        if (!cancelled && data.presignedUrl) {
          setSrc(data.presignedUrl);
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
  }, [character, search]);

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

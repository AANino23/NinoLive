"use client";

import { useActionState } from "react";
import {
  submitAvailability,
  type SubmitAvailabilityState,
} from "./actions";

const initialState: SubmitAvailabilityState = {
  success: false,
  message: "",
};

export function AvailabilityForm() {
  const [state, formAction, isPending] = useActionState(
    submitAvailability,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Enter your name"
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium text-slate-200">
          Date you are free
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-sky-400/60 [color-scheme:dark]"
        />
      </div>

      {state.message ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-rose-400/30 bg-rose-400/10 text-rose-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-full border border-sky-400/40 bg-sky-400/10 px-5 py-2.5 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Submit availability"}
      </button>
    </form>
  );
}

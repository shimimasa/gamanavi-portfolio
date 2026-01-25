"use client";

import { useEffect, useMemo, useState } from "react";

const choices = [
  { id: "fun", label: "たのしい", emoji: "😀" },
  { id: "ok", label: "ふつう", emoji: "😐" },
  { id: "hard", label: "むずかしい", emoji: "😣" },
];

function getTodayKey(slug) {
  const date = new Date().toISOString().slice(0, 10);
  return `kids-rating:${slug}:${date}`;
}

export default function KidsRatingForm({ slug }) {
  const [status, setStatus] = useState("idle");
  const [hasRated, setHasRated] = useState(false);

  const storageKey = useMemo(() => getTodayKey(slug), [slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(storageKey)) {
      setHasRated(true);
      setStatus("submitted");
    }
  }, [storageKey]);

  const handleVote = async (choice) => {
    if (status === "submitting" || hasRated) return;
    setStatus("submitting");

    const response = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, choice }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    window.localStorage.setItem(storageKey, choice);
    setHasRated(true);
    setStatus("submitted");
  };

  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/80 p-4 shadow-sm sm:p-5">
      <p className="text-sm font-semibold text-neutral-800 sm:text-base">
        このゲームはどうだった？
      </p>
      {status === "submitted" ? (
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          ありがとう！またあそんだらおしえてね。
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleVote(choice.id)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={status === "submitting"}
              >
                <span aria-hidden="true">{choice.emoji}</span>
                {choice.label}
              </button>
            ))}
          </div>
          {status === "error" ? (
            <p className="mt-2 text-xs text-rose-600 sm:text-sm">
              うまく送れなかったみたい。もういちどためしてね。
            </p>
          ) : (
            <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
              1にちに1かいだけ送れるよ。
            </p>
          )}
        </>
      )}
    </div>
  );
}

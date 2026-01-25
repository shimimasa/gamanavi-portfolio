"use client";

import { useEffect, useMemo, useState } from "react";

const choices = [
  { id: "fun", label: "たのしい", emoji: "😀" },
  { id: "ok", label: "ふつう", emoji: "😐" },
  { id: "hard", label: "むずかしい", emoji: "😣" },
];

const deviceCookieName = "gamanavi_device_id";

function getTodayKey(slug, sessionId) {
  const date = new Date().toISOString().slice(0, 10);
  return `kids-rating:${sessionId}:${slug}:${date}`;
}

function getCookieValue(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function ensureDeviceId() {
  if (typeof document === "undefined") return "";
  const existing = getCookieValue(deviceCookieName);
  if (existing) return existing;
  const newId =
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  document.cookie = `${deviceCookieName}=${encodeURIComponent(
    newId
  )}; path=/; max-age=31536000; samesite=lax`;
  return newId;
}

export default function KidsRatingForm({ slug, sessionId }) {
  const [status, setStatus] = useState("idle");
  const [hasRated, setHasRated] = useState(false);

  const resolvedSessionId = sessionId || "default";
  const storageKey = useMemo(
    () => getTodayKey(slug, resolvedSessionId),
    [slug, resolvedSessionId]
  );

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

    const deviceId = ensureDeviceId();

    const response = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, choice, deviceId, sessionId: resolvedSessionId }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const data = await response.json().catch(() => ({}));

    window.localStorage.setItem(storageKey, choice);
    setHasRated(true);
    setStatus(data?.alreadyRated ? "already" : "submitted");
  };

  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/80 p-4 shadow-sm sm:p-5">
      <p className="text-sm font-semibold text-neutral-800 sm:text-base">
        このゲームはどうだった？
      </p>
      {status === "submitted" || status === "already" ? (
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          {status === "already"
            ? "今日はもう送信済みです。あしたまたおしえてね。"
            : "ありがとう！またあそんだらおしえてね。"}
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const HOLD_DURATION_MS = 3000;
const COOKIE_NAME = "gamanavi_audience";
const COOKIE_VALUE = "parents";
const COOKIE_MAX_AGE = 60 * 60 * 12;

const getRemainingSeconds = (remainingMs) =>
  Math.max(0, Math.ceil(remainingMs / 1000));

export default function ParentsGateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(
    getRemainingSeconds(HOLD_DURATION_MS),
  );
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const completedRef = useRef(false);
  const nextDestination = useMemo(() => {
    const nextParam = searchParams.get("next");
    if (!nextParam) {
      return "/parents";
    }
    return nextParam.startsWith("/parents") ? nextParam : "/parents";
  }, [searchParams]);

  const resetState = () => {
    setProgress(0);
    setRemainingSeconds(getRemainingSeconds(HOLD_DURATION_MS));
    completedRef.current = false;
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const finishGate = () => {
    completedRef.current = true;
    const baseCookie = `${COOKIE_NAME}=${COOKIE_VALUE}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    document.cookie =
      window.location.protocol === "https:"
        ? `${baseCookie}; Secure`
        : baseCookie;
    router.push(nextDestination);
  };

  const handlePointerDown = () => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const nextProgress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setProgress(nextProgress);
      const remaining = HOLD_DURATION_MS - elapsed;
      setRemainingSeconds(getRemainingSeconds(remaining));
      if (elapsed >= HOLD_DURATION_MS) {
        clearTimer();
        finishGate();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (completedRef.current) return;
    clearTimer();
    resetState();
  };

  useEffect(() => () => clearTimer(), []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          この先はおうちの方・先生向けです
        </h1>
        <p className="mt-4 text-base text-neutral-700 sm:text-lg">
          大人の方が3秒長押ししてください
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-neutral-900 text-lg font-semibold text-neutral-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="3秒長押しでおうちの方向けページへ移動"
          >
            長押し
          </button>
          <div className="text-sm text-neutral-600">
            {progress >= 1
              ? "完了！"
              : `あと${remainingSeconds}秒で入れます`}
          </div>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

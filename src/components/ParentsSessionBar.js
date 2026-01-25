"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SESSION_SUFFIX_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createSessionId() {
  const datePart = new Date().toISOString().slice(0, 10);
  const letter = SESSION_SUFFIX_LETTERS[Math.floor(Math.random() * SESSION_SUFFIX_LETTERS.length)];
  return `${datePart}-${letter}`;
}

export default function ParentsSessionBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copyLabel, setCopyLabel] = useState("コピー");

  const sessionId = useMemo(() => {
    const value = searchParams?.get("s");
    return value && value.trim().length > 0 ? value.trim() : "default";
  }, [searchParams]);

  const kidsLink = useMemo(() => {
    const encoded = encodeURIComponent(sessionId);
    return `/kids/works?s=${encoded}`;
  }, [sessionId]);

  const handleCreateSession = () => {
    const newSessionId = createSessionId();
    const params = new URLSearchParams(searchParams?.toString());
    params.set("s", newSessionId);
    router.replace(`?${params.toString()}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kidsLink);
      setCopyLabel("コピーしました");
      window.setTimeout(() => setCopyLabel("コピー"), 2000);
    } catch (error) {
      console.error("Failed to copy kids link", error);
      setCopyLabel("コピー失敗");
      window.setTimeout(() => setCopyLabel("コピー"), 2000);
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-200/70 bg-indigo-50/80 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-900">先生用セッション操作バー</p>
          <div className="text-sm text-indigo-900">
            現在のセッションID: <span className="font-semibold">{sessionId}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-800 sm:text-sm">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-900 shadow-sm">
              kids用リンク
            </span>
            <code className="rounded-lg bg-white/70 px-3 py-1 text-xs text-indigo-900 shadow-sm">
              {kidsLink}
            </code>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <button
            type="button"
            onClick={handleCreateSession}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            新しい授業セッションを作成
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-indigo-200 bg-white px-4 py-2 font-semibold text-indigo-900 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            {copyLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

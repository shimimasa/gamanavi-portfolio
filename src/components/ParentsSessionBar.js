"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatSessionLabel } from "@/lib/sessionLabel";

const SESSION_SUFFIX_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createSessionId() {
  const datePart = new Date().toISOString().slice(0, 10);
  const letter = SESSION_SUFFIX_LETTERS[Math.floor(Math.random() * SESSION_SUFFIX_LETTERS.length)];
  return `${datePart}-${letter}`;
}

export default function ParentsSessionBar({ initialMemo = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copyLabel, setCopyLabel] = useState("コピー");
  const [memoValue, setMemoValue] = useState(initialMemo);
  const [memoStatus, setMemoStatus] = useState("");
  const [memoLoading, setMemoLoading] = useState(false);

  const sessionId = useMemo(() => {
    const value = searchParams?.get("s");
    return value && value.trim().length > 0 ? value.trim() : "default";
  }, [searchParams]);
  const sessionLabel = useMemo(() => formatSessionLabel(sessionId), [sessionId]);

  const kidsLink = useMemo(() => {
    const encoded = encodeURIComponent(sessionId);
    return `/kids/works?s=${encoded}`;
  }, [sessionId]);

  useEffect(() => {
    let isActive = true;

    const fetchMemo = async () => {
      setMemoLoading(true);
      setMemoStatus("");
      try {
        const response = await fetch(`/api/session-memo?sessionId=${encodeURIComponent(sessionId)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session memo");
        }
        const data = await response.json();
        if (isActive) {
          setMemoValue(typeof data?.memo === "string" ? data.memo : "");
        }
      } catch (error) {
        console.error("Failed to load session memo", error);
        if (isActive) {
          setMemoValue("");
        }
      } finally {
        if (isActive) {
          setMemoLoading(false);
        }
      }
    };

    fetchMemo();

    return () => {
      isActive = false;
    };
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

  const handleSaveMemo = async () => {
    setMemoLoading(true);
    setMemoStatus("");
    try {
      const response = await fetch("/api/session-memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, memo: memoValue }),
      });
      if (!response.ok) {
        throw new Error("Failed to save session memo");
      }
      setMemoStatus("保存しました");
    } catch (error) {
      console.error("Failed to save session memo", error);
      setMemoStatus("保存に失敗しました");
    } finally {
      setMemoLoading(false);
      window.setTimeout(() => setMemoStatus(""), 2000);
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-200/70 bg-indigo-50/80 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-900">先生用セッション操作バー</p>
          <p className="text-xs text-indigo-700">
            セッションは授業・支援の1回分をまとめる単位です。
          </p>
          <div className="text-sm text-indigo-900">
            現在の授業セッション: <span className="font-semibold">{sessionLabel.label}</span>
          </div>
          <div className="text-xs text-indigo-700">{sessionLabel.sub}</div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-800 sm:text-sm">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-900 shadow-sm">
              kids用リンク
            </span>
            <code className="rounded-lg bg-white/70 px-3 py-1 text-xs text-indigo-900 shadow-sm">
              {kidsLink}
            </code>
          </div>
          <p className="text-xs text-indigo-700">
            このリンクで開いた評価は、現在の授業セッションに紐付きます。
          </p>
          <div className="flex flex-wrap items-end gap-2 text-xs text-indigo-900 sm:text-sm">
            <div className="flex flex-col gap-1">
              <label htmlFor="session-memo" className="text-xs font-semibold text-indigo-800">
                セッションメモ
              </label>
              <input
                id="session-memo"
                type="text"
                value={memoValue}
                onChange={(event) => setMemoValue(event.target.value)}
                placeholder="例: 低学年が多め、色塗りが人気"
                className="w-64 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-indigo-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-80 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveMemo}
              disabled={memoLoading}
              className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition sm:text-sm ${
                memoLoading
                  ? "cursor-wait bg-indigo-200 text-indigo-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              保存
            </button>
            {memoStatus && <span className="text-xs text-indigo-700">{memoStatus}</span>}
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

"use client";

import { useEffect, useState } from "react";
import { formatSessionLabel } from "@/lib/sessionLabel";

export default function ParentsTeacherComment({ sessionId, slug, initialComment = "" }) {
  const [commentValue, setCommentValue] = useState(initialComment);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionLabel = formatSessionLabel(sessionId);

  useEffect(() => {
    let isActive = true;

    const fetchComment = async () => {
      setLoading(true);
      setStatus("");
      try {
        const response = await fetch(
          `/api/teacher-comment?sessionId=${encodeURIComponent(sessionId)}&slug=${encodeURIComponent(slug)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch teacher comment");
        }
        const data = await response.json();
        if (isActive) {
          setCommentValue(typeof data?.comment === "string" ? data.comment : "");
        }
      } catch (error) {
        console.error("Failed to load teacher comment", error);
        if (isActive) {
          setCommentValue("");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchComment();

    return () => {
      isActive = false;
    };
  }, [sessionId, slug]);

  const handleSave = async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/teacher-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, slug, comment: commentValue }),
      });
      if (!response.ok) {
        throw new Error("Failed to save teacher comment");
      }
      setStatus("保存しました");
    } catch (error) {
      console.error("Failed to save teacher comment", error);
      setStatus("保存に失敗しました");
    } finally {
      setLoading(false);
      window.setTimeout(() => setStatus(""), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm text-neutral-700 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-neutral-500">教師向け補足コメント（保護者・先生のみ）</p>
          <p className="mt-1 text-sm text-neutral-600">保護者への説明に添える補足メモとして保存できます。</p>
        </div>
        <div className="text-xs text-neutral-500">
          授業セッション: <span className="font-semibold text-neutral-700">{sessionLabel.label}</span>{" "}
          <span className="text-[11px] text-neutral-400">{sessionLabel.sub}</span>
        </div>
      </div>
      <textarea
        value={commentValue}
        onChange={(event) => setCommentValue(event.target.value)}
        placeholder="例: 今日は前半はよく進み、後半は難易度が高めでした。"
        rows={4}
        className="mt-3 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition sm:text-sm ${
            loading ? "cursor-wait bg-neutral-200 text-neutral-600" : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          保存
        </button>
        {status && <span className="text-xs text-neutral-500">{status}</span>}
      </div>
    </div>
  );
}

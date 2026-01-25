"use client";

import { useMemo } from "react";

function formatPercent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function normalizeSessionId(sessionId) {
  const trimmed = typeof sessionId === "string" ? sessionId.trim() : "";
  return trimmed.length > 0 ? trimmed : "default";
}

function sanitizeFilename(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export default function ParentsRatingsCsvButton({
  summaries,
  kvConfigured,
  sessionId,
  sessionMemo = "",
}) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const csvRows = useMemo(
    () =>
      summaries.map((summary) => ({
        slug: summary.slug,
        title: summary.title,
        session_id: resolvedSessionId,
        session_memo: sessionMemo,
        total: summary.total,
        fun: summary.fun,
        ok: summary.ok,
        hard: summary.hard,
        fun_percent: formatPercent(summary.fun, summary.total),
        ok_percent: formatPercent(summary.ok, summary.total),
        hard_percent: formatPercent(summary.hard, summary.total),
      })),
    [summaries, resolvedSessionId, sessionMemo]
  );

  const handleDownload = async () => {
    if (!kvConfigured) return;

    const exportedAt = new Date().toISOString();
    let memoValue = sessionMemo;

    try {
      const response = await fetch(
        `/api/session-memo?sessionId=${encodeURIComponent(resolvedSessionId)}`
      );
      if (response.ok) {
        const data = await response.json();
        memoValue = typeof data?.memo === "string" ? data.memo : memoValue;
      }
    } catch (error) {
      console.error("Failed to fetch session memo for CSV", error);
    }

    const rows = csvRows.map((row) => ({ ...row, session_memo: memoValue }));
    const headers = [
      "session_id",
      "session_memo",
      "slug",
      "title",
      "total",
      "fun",
      "ok",
      "hard",
      "fun_percent",
      "ok_percent",
      "hard_percent",
      "exported_at",
    ];

    const lines = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.session_id,
          row.session_memo,
          row.slug,
          row.title,
          row.total,
          row.fun,
          row.ok,
          row.hard,
          row.fun_percent,
          row.ok_percent,
          row.hard_percent,
          exportedAt,
        ]
          .map(escapeCsvValue)
          .join(",")
      ),
    ];

    const csvContent = `${lines.join("\n")}\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = exportedAt.slice(0, 10);
    link.href = url;
    link.download = `gamanavi_ratings_${sanitizeFilename(resolvedSessionId)}_${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-end gap-2 text-right">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!kvConfigured}
        className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
          kvConfigured
            ? "bg-neutral-900 text-white hover:bg-neutral-800"
            : "cursor-not-allowed bg-neutral-200 text-neutral-500"
        }`}
      >
        CSVをダウンロード
      </button>
      {!kvConfigured && (
        <p className="max-w-xs text-xs text-amber-700">
          KVが未設定のためCSVは出力できません。KVを設定すると有効になります。
        </p>
      )}
    </div>
  );
}

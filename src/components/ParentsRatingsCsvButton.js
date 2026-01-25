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

export default function ParentsRatingsCsvButton({ summaries, kvConfigured }) {
  const csvRows = useMemo(
    () =>
      summaries.map((summary) => ({
        slug: summary.slug,
        title: summary.title,
        total: summary.total,
        fun: summary.fun,
        ok: summary.ok,
        hard: summary.hard,
        fun_percent: formatPercent(summary.fun, summary.total),
        ok_percent: formatPercent(summary.ok, summary.total),
        hard_percent: formatPercent(summary.hard, summary.total),
      })),
    [summaries]
  );

  const handleDownload = () => {
    if (!kvConfigured) return;

    const exportedAt = new Date().toISOString();
    const headers = [
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
      ...csvRows.map((row) =>
        [
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
    link.download = `gamanavi_ratings_${dateStamp}.csv`;
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

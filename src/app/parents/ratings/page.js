import Link from "next/link";
import works from "@/content/works.json";
import { getRatingSummary, kvStatus } from "@/lib/ratingsStore";
import ParentsRatingsCsvButton from "@/components/ParentsRatingsCsvButton";

function formatPercent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export default async function ParentsRatingsPage() {
  const summaries = await Promise.all(
    works.map(async (work) => ({
      work,
      summary: await getRatingSummary(work.slug),
    }))
  );

  const sorted = [...summaries].sort((a, b) => b.summary.total - a.summary.total);
  const ratedSummaries = sorted.filter(({ summary }) => summary.total > 0);
  const unratedSummaries = sorted.filter(({ summary }) => summary.total === 0);
  const status = kvStatus();
  const csvSummaries = sorted.map(({ work, summary }) => ({
    slug: work.slug,
    title: work.title,
    total: summary.total,
    fun: summary.fun,
    ok: summary.ok,
    hard: summary.hard,
  }));

  return (
    <div className="space-y-6">
      {!status.configured && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm sm:px-6 sm:py-5">
          <p className="font-semibold">⚠️ Vercel KV が未設定です</p>
          <p className="mt-2 text-xs text-amber-800 sm:text-sm">
            いまの評価データは一時メモリに保存されています。サーバを再起動すると消えるため、本番運用ではKVを設定してください。
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">こども評価の集計</h1>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              作品ごとの「たのしい / ふつう / むずかしい」の感想をまとめています。
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 text-right">
            <ParentsRatingsCsvButton summaries={csvSummaries} kvConfigured={status.configured} />
            <Link
              href="/parents/works"
              className="text-sm font-semibold text-neutral-700 hover:underline"
            >
              作品一覧へ →
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {ratedSummaries.map(({ work, summary }) => (
          <article
            key={work.slug}
            className="rounded-3xl border border-neutral-200/60 bg-white/90 p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">{work.title}</h2>
                {work.subtitle && (
                  <p className="mt-1 text-sm text-neutral-500">{work.subtitle}</p>
                )}
              </div>
              <Link
                href={`/parents/works/${work.slug}`}
                className="text-xs font-semibold text-neutral-600 hover:underline"
              >
                詳細を見る →
              </Link>
            </div>

            <div className="mt-4 space-y-3 text-sm text-neutral-700">
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2">
                <span>たのしい 😀</span>
                <span className="font-semibold">
                  {summary.fun} ({formatPercent(summary.fun, summary.total)})
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2">
                <span>ふつう 😐</span>
                <span className="font-semibold">
                  {summary.ok} ({formatPercent(summary.ok, summary.total)})
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2">
                <span>むずかしい 😣</span>
                <span className="font-semibold">
                  {summary.hard} ({formatPercent(summary.hard, summary.total)})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>合計</span>
                <span>{summary.total}件</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {unratedSummaries.length > 0 && (
        <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-neutral-700">
              <span>まだ評価がない作品（{unratedSummaries.length}件）</span>
              <span className="text-xs text-neutral-500 group-open:rotate-180">▼</span>
            </summary>
            <ul className="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
              {unratedSummaries.map(({ work }) => (
                <li key={work.slug} className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3">
                  <div className="font-semibold text-neutral-800">{work.title}</div>
                  {work.subtitle && <div className="mt-1 text-xs text-neutral-500">{work.subtitle}</div>}
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </div>
  );
}

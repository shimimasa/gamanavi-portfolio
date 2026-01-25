import Link from "next/link";
import works from "@/content/works.json";
import { getRatingSummary, kvStatus } from "@/lib/ratingsStore";

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

  const status = kvStatus();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">こども評価の集計</h1>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              作品ごとの「たのしい / ふつう / むずかしい」の感想をまとめています。
            </p>
          </div>
          <Link
            href="/parents/works"
            className="text-sm font-semibold text-neutral-700 hover:underline"
          >
            作品一覧へ →
          </Link>
        </div>
        {!status.configured && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:text-sm">
            ⚠️ Vercel KV が未設定のため、いまは一時メモリに保存されています。再起動すると評価はリセットされます。
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {summaries.map(({ work, summary }) => (
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

            {summary.total === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
                まだ評価はありません。
              </p>
            ) : (
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
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

import Link from "next/link";
import works from "@/content/works.json";
import { getRatingSummary, getSessionMemo, kvStatus } from "@/lib/ratingsStore";
import { formatSessionLabel } from "@/lib/sessionLabel";
import ParentsRatingsCsvButton from "@/components/ParentsRatingsCsvButton";
import ParentsSessionBar from "@/components/ParentsSessionBar";

function formatPercent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export default async function ParentsRatingsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const sessionId =
    typeof resolvedSearchParams?.s === "string" && resolvedSearchParams.s.trim().length > 0
      ? resolvedSearchParams.s.trim()
      : "default";
  const summaries = await Promise.all(
    works.map(async (work) => ({
      work,
      summary: await getRatingSummary(work.slug, sessionId),
    }))
  );

  const sorted = [...summaries].sort((a, b) => b.summary.total - a.summary.total);
  const ratedSummaries = sorted.filter(({ summary }) => summary.total > 0);
  const unratedSummaries = sorted.filter(({ summary }) => summary.total === 0);
  const totalRatings = sorted.reduce((total, { summary }) => total + summary.total, 0);
  const status = kvStatus();
  const sessionMemo = await getSessionMemo(sessionId);
  const sessionLabel = formatSessionLabel(sessionId);
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
      <ParentsSessionBar initialMemo={sessionMemo} />
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 px-5 py-4 text-sm text-neutral-700 shadow-sm sm:px-6 sm:py-5">
        <h2 className="text-base font-semibold text-neutral-900">評価の見方について</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600">
          <li>「たのしい / ふつう / むずかしい」は、作品を体験した子どもの感想を集計したものです。</li>
          <li>授業や支援教室など、実際の教育現場での振り返りに活用されています。</li>
          <li>能力判定ではなく、取り組みやすさや楽しさを確認する目的の評価です。</li>
          <li>評価に個人情報は含めず、集計データのみを扱っています。</li>
        </ul>
      </section>
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
              作品ごとの「たのしい／ふつう／むずかしい」を、授業セッション（1回分）ごとに集計しています。
            </p>
            <div className="mt-3 rounded-2xl border border-neutral-200/70 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              <p className="text-sm font-semibold text-neutral-800">
                この集計は「{sessionLabel.label}」の記録です{" "}
                <span className="text-xs text-neutral-500">{sessionLabel.sub}</span>
              </p>
              <dl className="mt-2 grid gap-2 text-xs text-neutral-600 sm:grid-cols-2">
                <div className="flex items-center justify-between gap-2">
                  <dt>授業セッション</dt>
                  <dd className="font-semibold text-neutral-700">{sessionLabel.label}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt>内部ID</dt>
                  <dd className="font-semibold text-neutral-700">{sessionLabel.id}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt>評価件数</dt>
                  <dd className="font-semibold text-neutral-700">{totalRatings}件</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt>未評価作品数</dt>
                  <dd className="font-semibold text-neutral-700">{unratedSummaries.length}件</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 text-right">
            <ParentsRatingsCsvButton
              summaries={csvSummaries}
              kvConfigured={status.configured}
              sessionId={sessionId}
              sessionMemo={sessionMemo}
            />
            <p className="max-w-xs text-xs text-neutral-500">
              CSVは授業・支援教室での記録共有に使えます。session_memo はセッション全体のメモ、
              教師コメントは作品ごとの気づきを残す欄（詳細ページで記録）です。
            </p>
            <Link
              href="/parents/works"
              className="text-sm font-semibold text-neutral-700 hover:underline"
            >
              作品一覧へ →
            </Link>
          </div>
        </div>
        <form className="mt-4 flex flex-wrap items-end gap-2 text-sm" method="get">
          <div className="flex flex-col gap-1">
            <label htmlFor="session-id" className="text-xs font-semibold text-neutral-500">
              授業セッション（内部ID）
            </label>
            <input
              id="session-id"
              name="s"
              defaultValue={sessionId}
              placeholder="例: 2026-01-25_算数_2時間目"
              className="w-56 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-500">
              セッションは授業・支援の1回分をまとめる単位です。
            </p>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            セッションを適用
          </button>
          <div className="text-xs text-neutral-500">
            現在の授業セッション:{" "}
            <span className="font-semibold text-neutral-700">{sessionLabel.label}</span>{" "}
            <span className="text-[11px] text-neutral-400">{sessionLabel.sub}</span>
          </div>
        </form>
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
                href={`/parents/works/${work.slug}?s=${encodeURIComponent(sessionId)}`}
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
              <span className="flex flex-wrap items-center gap-2">
                <span>まだ評価がない作品（{unratedSummaries.length}件）</span>
                <span className="text-xs font-normal text-neutral-500">(このセッション内)</span>
              </span>
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

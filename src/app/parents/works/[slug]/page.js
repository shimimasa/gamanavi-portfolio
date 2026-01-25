import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import works from "@/content/works.json";
import { getRatingSummary, getTeacherComment } from "@/lib/ratingsStore";
import ParentsTeacherComment from "@/components/ParentsTeacherComment";

export function generateStaticParams() {
  return works
    .filter((work) => typeof work.slug === "string" && work.slug.trim().length > 0)
    .map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

function chip(text) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
      {text}
    </span>
  );
}

function formatPercent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function getRatingInsight(summary) {
  if (!summary || summary.total === 0) {
    return {
      label: "—",
      message: "まだ評価はありません。",
    };
  }

  const candidates = [
    {
      key: "fun",
      label: "たのしい 😀",
      value: summary.fun,
      message: "前向きに取り組めた子が多い授業でした。",
    },
    {
      key: "ok",
      label: "ふつう 😐",
      value: summary.ok,
      message: "落ち着いて取り組めた子が多い授業でした。",
    },
    {
      key: "hard",
      label: "むずかしい 😣",
      value: summary.hard,
      message: "難しさを感じた子が多く、調整の余地があります。",
    },
  ];

  const priority = { fun: 0, ok: 1, hard: 2 };
  const sorted = [...candidates].sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return priority[a.key] - priority[b.key];
  });

  return sorted[0];
}

export default async function ParentsWorkDetailPage({ params, searchParams }) {
  const defaultCanDo = ["よみを当てる", "モンスターを仲間にする", "旅してステージを進める"];
  const defaultLearningBody =
    "漢字の読みを短いサイクルで反復しながら、全国・世界のモチーフに触れられます。「正解→報酬（仲間が増える）」の構造で意欲が続きやすい設計です。";
  const defaultHowToPlay = [
    "「▶ ゲームスタート！」を押す",
    "もんだいを見て、よみを入力する",
    "正解したら、モンスターが仲間になる！",
  ];

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const workSlug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : "";
  const sessionId =
    typeof resolvedSearchParams?.s === "string" && resolvedSearchParams.s.trim().length > 0
      ? resolvedSearchParams.s.trim()
      : "default";

  const work = works.find((item) => (typeof item.slug === "string" ? item.slug.trim() : "") === workSlug);
  if (!work) return notFound();

  const ratingSummary = await getRatingSummary(work.slug, sessionId);
  const teacherComment = await getTeacherComment(sessionId, work.slug);
  const ratingInsight = getRatingInsight(ratingSummary);

  const playUrl = typeof work.links?.play === "string" ? work.links.play.trim() : "";
  const isWip = work.status === "wip" || playUrl.length === 0;
  const previewVideo =
    typeof work.previewVideo === "string" && work.previewVideo.trim().length > 0
      ? work.previewVideo.trim()
      : "";
  const subjectTags = Array.isArray(work.subjectTags) ? work.subjectTags : [];
  const featureTags = Array.isArray(work.featureTags) ? work.featureTags : [];

  const canDo = Array.isArray(work.canDo) && work.canDo.length > 0 ? work.canDo : defaultCanDo;
  const learningBody =
    typeof work.learning?.body === "string" && work.learning.body.trim().length > 0
      ? work.learning.body.trim()
      : defaultLearningBody;
  const howToPlay =
    Array.isArray(work.howToPlay) && work.howToPlay.length > 0
      ? work.howToPlay
      : defaultHowToPlay;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/parents/works" className="text-sm text-neutral-700 hover:underline">
          ← 作品一覧へ
        </Link>
        <div className="text-sm text-neutral-500">Home / 保護者 / 作品 / {work.title}</div>
      </div>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{work.title}</h1>
            {work.subtitle && (
              <p className="mt-2 text-sm text-neutral-600 sm:text-base">{work.subtitle}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {chip("ダウンロード不要")}
              {chip("ブラウザでそのまま")}
              {chip("無料")}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-700">
              {chip(`🎒 対象：${work.audience ?? "—"}`)}
              {chip("⏱ 目安：3〜10分")}
              {chip("👤 ひとりでOK")}
              {chip("🏫 授業導入／支援教室／家庭学習")}
            </div>

            <div className="mt-5 rounded-2xl border border-neutral-200/60 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-neutral-500">こども評価ミニ集計</p>
                <p className="text-xs text-neutral-500">
                  セッション: <span className="font-semibold text-neutral-700">{sessionId}</span>
                </p>
              </div>
              {ratingSummary.total === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">まだ評価はありません。</p>
              ) : (
                <div className="mt-2 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span>たのしい 😀</span>
                    <span className="font-semibold">
                      {ratingSummary.fun} ({formatPercent(ratingSummary.fun, ratingSummary.total)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ふつう 😐</span>
                    <span className="font-semibold">
                      {ratingSummary.ok} ({formatPercent(ratingSummary.ok, ratingSummary.total)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>むずかしい 😣</span>
                    <span className="font-semibold">
                      {ratingSummary.hard} ({formatPercent(ratingSummary.hard, ratingSummary.total)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>合計</span>
                    <span>{ratingSummary.total}件</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200/60 bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm">
              <p className="text-xs font-semibold text-neutral-500">評価のまとめ</p>
              <div className="mt-2 space-y-1 text-sm text-neutral-700">
                <p>
                  総評価数: <span className="font-semibold">{ratingSummary.total}</span>件
                </p>
                <p>
                  最も多い評価: <span className="font-semibold">{ratingInsight.label}</span>
                </p>
              </div>
              <p className="mt-2 text-xs text-neutral-500">{ratingInsight.message}</p>
            </div>

            <div className="mt-4">
              <ParentsTeacherComment
                sessionId={sessionId}
                slug={work.slug}
                initialComment={teacherComment}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isWip ? (
                <span className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-500">
                  🛠 ただいま つくっているよ
                </span>
              ) : (
                <a
                  href={playUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white",
                    "px-7 py-4 text-base font-semibold sm:px-8 sm:py-4 sm:text-lg",
                    "shadow-md",
                    "transition-[transform,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
                    "hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  ▶ ゲームスタート！
                </a>
              )}

              <div className="flex flex-wrap gap-2">
                {work.links?.github ? (
                  <a
                    href={work.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    GitHub
                  </a>
                ) : null}
                {work.links?.note ? (
                  <a
                    href={work.links.note}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    note
                  </a>
                ) : null}
              </div>

              <p className="text-xs text-neutral-500">
                ※ ブラウザでそのまま遊べます。ダウンロードは不要です。
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
              {previewVideo ? (
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={typeof work.thumb === "string" ? work.thumb : undefined}
                >
                  <source src={previewVideo} type="video/mp4" />
                </video>
              ) : work.thumb ? (
                <Image
                  src={work.thumb}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={false}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-neutral-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
            </svg>
            できること
          </span>
        </h2>

        <ul className="mt-4 space-y-2 text-neutral-800">
          {canDo.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base sm:text-lg">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-1 h-5 w-5 flex-none text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <details className="group">
          <summary
            className={[
              "flex cursor-pointer items-start justify-between gap-3",
              "select-none list-none [&::-webkit-details-marker]:hidden",
            ].join(" ")}
          >
            <span className="text-xl font-semibold">
              <span className="inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a7 7 0 00-4 12.7V20l4-2 4 2v-5.3A7 7 0 0012 2z" />
                </svg>
                学べること（先生・保護者の方へ）
              </span>
            </span>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-1 h-5 w-5 flex-none text-neutral-700 transition-transform duration-200 ease-out group-open:rotate-180 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {subjectTags.map((tag) => (
                <span key={`s-${tag}`} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-neutral-700">{learningBody}</p>
            {featureTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {featureTags.map((tag) => (
                  <span key={`f-${tag}`} className="rounded-full bg-neutral-200/70 px-3 py-1 text-sm text-neutral-900">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-neutral-500">
              ※ 子ども向けの「遊び方」は下にまとめています。
            </p>
          </div>
        </details>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">
          <span className="inline-flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-neutral-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 5h8M8 9h8M8 13h6" />
              <path d="M6 3h12a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />
            </svg>
            あそび方（かんたん3ステップ）
          </span>
        </h2>

        <ol className="mt-4 grid gap-3 text-neutral-800 sm:gap-4">
          {howToPlay.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200/60 bg-white px-4 py-4 shadow-sm"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-neutral-300 bg-white text-base font-semibold text-neutral-900">
                {index + 1}
              </span>
              <div className="text-base font-medium leading-relaxed sm:text-lg">{item}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/parents/works" className="text-sm text-neutral-700 hover:underline">
          ← 作品一覧へ
        </Link>
        <Link href="/parents/contact" className="text-sm text-neutral-700 hover:underline">
          お問い合わせ →
        </Link>
      </div>
    </div>
  );
}

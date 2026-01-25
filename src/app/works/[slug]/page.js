import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import works from "@/content/works.json";

export function generateStaticParams() {
  return works
    .filter((w) => typeof w.slug === "string" && w.slug.trim().length > 0)
    .map((w) => ({ slug: w.slug }));
}

// 静的出力前提ならこれも有効（任意）
export const dynamicParams = false;


function chip(text) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
      {text}
    </span>
  );
}

export default async function WorkDetailPage({ params }) {
  const missingListPlaceholder = ["準備中です。"];

  // Next.jsのバージョン/レンダリング状況によっては params が Promise で渡るケースがあるため await して吸収する
  const resolvedParams = await params;
  const workSlug =
    typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : "";

  const work = works.find((w) => (typeof w.slug === "string" ? w.slug.trim() : "") === workSlug);
  if (!work) return notFound();

  const playUrl = typeof work.links?.play === "string" ? work.links.play.trim() : "";
  const isWip = work.status === "wip" || playUrl.length === 0;
  const previewVideo =
    typeof work.previewVideo === "string" && work.previewVideo.trim().length > 0
      ? work.previewVideo.trim()
      : "";

  const canDo =
    Array.isArray(work.canDo) && work.canDo.length > 0 ? work.canDo : missingListPlaceholder;
  const howToPlay =
    Array.isArray(work.howToPlay) && work.howToPlay.length > 0
      ? work.howToPlay
      : missingListPlaceholder;
  const observationPoints =
    Array.isArray(work.observationPoints) && work.observationPoints.length > 0
      ? work.observationPoints
      : [];

  return (
    <div className="space-y-6">
      {/* 上部導線 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/works" className="text-sm text-neutral-700 hover:underline">
          ← 制作物一覧へ
        </Link>
        <Link href="/research" className="text-sm text-neutral-600 hover:underline">
          研究メモを見る →
        </Link>
        <div className="text-sm text-neutral-500">Home / 制作物 / {work.title}</div>
      </div>

      {/* ファーストビュー */}
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
                    // CTA: 迷いなく押せる見た目（色追加なし / 反応は控えめ）
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
                  // 読み込み前の見栄えを維持（thumbがあればポスターに使う）
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

      {observationPoints.length > 0 ? (
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
                <path d="M4 4h16v16H4z" />
                <path d="M7 9h10M7 13h6" />
              </svg>
              このゲームで見ていること
            </span>
          </h2>

          <ul className="mt-4 space-y-2 text-neutral-800">
            {observationPoints.map((item) => (
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
          <div className="mt-4 text-sm text-neutral-600">
            <Link href="/research" className="hover:underline">
              研究メモを見る →
            </Link>
          </div>
        </section>
      ) : null}

      {/* できること */}
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
          {canDo.map((t) => (
            <li key={t} className="flex items-start gap-3 text-base sm:text-lg">
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
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

     {/* あそび方 */}
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
          {howToPlay.map((t, i) => (
            <li
              key={t}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200/60 bg-white px-4 py-4 shadow-sm"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-neutral-300 bg-white text-base font-semibold text-neutral-900">
                {i + 1}
              </span>
              <div className="text-base font-medium leading-relaxed sm:text-lg">{t}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* 回遊 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
       <Link href="/works" className="text-sm text-neutral-700 hover:underline">
          ← 制作物一覧へ
        </Link>
        <Link href="/research" className="text-sm text-neutral-700 hover:underline">
          研究メモを見る →
        </Link>
        <Link href="/contact" className="text-sm text-neutral-700 hover:underline">
          お問い合わせ →
        </Link>
      </div>
    </div>
  );
}

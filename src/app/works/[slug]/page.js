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

export default function WorkDetailPage({ params }) {
  const slug = params?.slug;
  const work = works.find((w) => w.slug === slug);
  if (!work) return notFound();

  const isWip = work.status === "wip" || !work.links?.play;
  const subjectTags = Array.isArray(work.subjectTags) ? work.subjectTags : [];
  const featureTags = Array.isArray(work.featureTags) ? work.featureTags : [];

  return (
    <div className="space-y-6">
      {/* 上部導線 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/works" className="text-sm text-neutral-700 hover:underline">
          ← 制作物一覧へ
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
                  href={work.links.play}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
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
              {work.thumb ? (
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

      {/* できること */}
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">できること</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-800">
          <li>よみを当てる</li>
          <li>モンスターを仲間にする</li>
          <li>旅してステージを進める</li>
        </ul>
      </section>

      {/* 学べること */}
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">学べること（先生・保護者の方へ）</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {subjectTags.map((t) => (
            <span key={`s-${t}`} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-neutral-700">
          漢字の読みを短いサイクルで反復しながら、全国・世界のモチーフに触れられます。
          「正解→報酬（仲間が増える）」の構造で意欲が続きやすい設計です。
        </p>
        {featureTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {featureTags.map((t) => (
              <span key={`f-${t}`} className="rounded-full bg-neutral-200/70 px-3 py-1 text-sm text-neutral-900">
                {t}
              </span>
            ))}
          </div>
        )}
      </section>

     {/* あそび方 */}
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">あそび方（かんたん3ステップ）</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-neutral-800">
          <li>「▶ ゲームスタート！」を押す</li>
          <li>もんだいを見て、よみを入力する</li>
          <li>正解したら、モンスターが仲間になる！</li>
        </ol>
      </section>

      {/* 回遊 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
       <Link href="/works" className="text-sm text-neutral-700 hover:underline">
          ← 制作物一覧へ
        </Link>
        <Link href="/contact" className="text-sm text-neutral-700 hover:underline">
          お問い合わせ →
        </Link>
      </div>
    </div>
  );
}

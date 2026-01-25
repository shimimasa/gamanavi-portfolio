import Link from "next/link";
import { getWorks } from "@/lib/works";

export default function HomePage() {
  const works = getWorks();
  const focusSlugs = ["kanji-yomitabi", "neko-mouji-nazori"];
  const focusWorks = focusSlugs
    .map((slug) => works.find((work) => work.slug === slug))
    .filter(Boolean);
  const otherWorks = works.filter((work) => !focusSlugs.includes(work.slug));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
              どちらからはじめますか？
            </h1>
            <p className="mt-2 text-base text-neutral-700">
              学習ゲームを探している子ども向けと、保護者・先生向けで入口を分けています。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/kids"
              className="group rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-sm text-neutral-500">子ども向け</div>
              <div className="mt-2 text-lg font-semibold text-neutral-900">
                こどもはこちら
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                ゲームをえらんで、すぐ遊べます。
              </p>
            </Link>

            <Link
              href="/parents"
              className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-sm text-neutral-500">保護者・先生向け</div>
              <div className="mt-2 text-lg font-semibold text-neutral-900">
                おうちの方・先生はこちら
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                作品のねらいや学びのポイントをまとめています。
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
            学習ゲームを“作って終わり”にしない
          </h2>
          <p className="text-base text-neutral-700">
            gamanavi は、学習に困難を抱える子ども向けに制作したゲーム教材を実際に使ってもらい、
            つまずきや変化を観察して改善につなげる小規模実証プラットフォームです。
          </p>
          <p className="text-sm text-neutral-600">
            現在は「漢字ヨミタビ」「ねこもじなぞり」を中心に検証しています。
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 px-6 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">重点2作品</h2>
            <p className="mt-2 text-sm text-neutral-600">
              小規模実証の中心となる2本を、重点的に改善しています。
            </p>
          </div>
          <Link href="/research" className="text-sm text-neutral-600 hover:underline">
            研究メモを見る →
          </Link>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {focusWorks.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.slug}`}
              className="group rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-xs text-neutral-500">重点作品</div>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 sm:text-xl">
                {work.title}
              </h3>
              {work.subtitle ? (
                <p className="mt-1 text-xs text-neutral-600">{work.subtitle}</p>
              ) : null}
              <p className="mt-3 line-clamp-2 text-sm text-neutral-700 sm:text-base">
                {work.oneLiner}
              </p>
              <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                <span className="font-semibold text-neutral-900">
                  このゲームで見ていること：
                </span>{" "}
                {work.observationLine ?? "観察ポイントを整理中です。"}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral-900">その他の作品</h3>
            <Link href="/works" className="text-sm text-neutral-600 hover:underline">
              作品一覧へ →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherWorks.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className="rounded-2xl border border-neutral-200/70 bg-white p-4 text-sm text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-xs text-neutral-500">{work.audience ?? ""}</div>
                <div className="mt-2 text-base font-semibold text-neutral-900">
                  {work.title}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                  {work.oneLiner ?? "作品の概要は準備中です。"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-neutral-50/80 p-6 text-sm text-neutral-600 shadow-sm sm:p-8">
        <div className="font-semibold text-neutral-800">その他のページ</div>
        <div className="mt-2 flex flex-wrap gap-4">
          <Link href="/works" className="hover:underline">
            作品一覧
          </Link>
          <Link href="/research" className="hover:underline">
            研究メモを見る
          </Link>
          <Link href="/about" className="hover:underline">
            自己紹介
          </Link>
          <Link href="/contact" className="hover:underline">
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}

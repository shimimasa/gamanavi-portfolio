import Link from "next/link";
import researchMemos from "@/content/research.json";

export const metadata = {
  title: "研究メモ | gamanavi",
  description: "学習困難児向けゲーム教材の小規模実証メモをまとめています。",
};

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold">研究メモ</h1>
        <p className="mt-3 text-neutral-700">
          小規模実証で気づいた点や、改善の仮説を短く記録しています。
        </p>
        <p className="mt-3 text-sm text-neutral-600">
          まずは「漢字ヨミタビ」「ねこもじなぞり」を中心にまとめています。
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {researchMemos.map((memo) => (
          <section
            key={memo.slug}
            className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{memo.title}</h2>
              <Link href={`/works/${memo.slug}`} className="text-sm text-neutral-600 hover:underline">
                詳細を見る →
              </Link>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700 sm:text-base">
              {memo.memos.map((item, index) => (
                <li key={`${memo.slug}-memo-${index}`} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <Link href="/" className="hover:underline">
          ← トップへ戻る
        </Link>
        <Link href="/works" className="hover:underline">
          制作物一覧へ →
        </Link>
      </div>
    </div>
  );
}

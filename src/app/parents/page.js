import Link from "next/link";

export default function ParentsHomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">保護者・先生向け</h1>
        <p className="mt-3 text-neutral-700">
          学習ゲームのねらいや学べることをまとめています。導入の参考や相談窓口もこちらからどうぞ。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/parents/works"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            作品一覧へ
          </Link>
          <Link
            href="/parents/ratings"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            評価の集計
          </Link>
          <Link
            href="/parents/contact"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}

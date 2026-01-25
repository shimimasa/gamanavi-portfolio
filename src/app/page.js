import Link from "next/link";

export default function HomePage() {
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

      <section className="rounded-3xl border border-neutral-200/60 bg-neutral-50/80 p-6 text-sm text-neutral-600 shadow-sm sm:p-8">
        <div className="font-semibold text-neutral-800">その他のページ</div>
        <div className="mt-2 flex flex-wrap gap-4">
          <Link href="/works" className="hover:underline">
            作品一覧
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

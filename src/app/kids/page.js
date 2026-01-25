import Link from "next/link";

export default function KidsHomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">こどもトップ</h1>
        <p className="mt-3 text-neutral-700">
          ゲームをえらんで、すぐに遊べるページです。むずかしい説明はあとでOK！
        </p>
        <div className="mt-5">
          <Link
            href="/kids/works"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            ゲーム一覧へ
          </Link>
        </div>
      </section>
    </div>
  );
}

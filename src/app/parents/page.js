import Link from "next/link";
import { cookies } from "next/headers";

export default async function ParentsHomePage() {
  const cookieStore = await cookies();
  const audience = cookieStore.get("gamanavi_audience")?.value;
  const isParents = audience === "parents";

  if (!isParents) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">保護者向けページです</h1>
          <p className="mt-3 text-neutral-700">
            こちらは保護者・先生向けの案内ページです。続きを閲覧する場合は保護者モードへ進んでください。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/kids/parents-gate?next=/parents/works"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              保護者モードに入る
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">保護者・先生向け</h1>
        <p className="mt-3 text-neutral-700">
          学習ゲームのねらいや学べることをまとめています。導入の参考や相談窓口もこちらからどうぞ。
        </p>
        <p className="mt-3 text-sm text-neutral-600">
          実際の授業や支援教室での活用事例をもとに、家庭でも目的が伝わるよう整理しています。
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

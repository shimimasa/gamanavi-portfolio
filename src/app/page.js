import Link from "next/link";
import links from "@/content/links.json";
import profile from "@/content/profile.json";
import { getWorks } from "@/lib/works";
import WorkGrid from "@/components/WorkGrid";

export default function HomePage() {
  const works = getWorks().slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        {/* Step1: ファーストビューを「3秒で伝わる」形に寄せる */}
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
          教育現場で活用できる学習ゲーム／教材のポートフォリオ
        </h1>

        <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
          小学生〜中学生向け。
          <br className="hidden sm:block" />
          授業・支援教室・家庭学習で使える教材を、ゲームとして設計・開発しています。
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
            教育 × ゲーム × AI
          </span>
          {/* 名前は主役にしない：視線はまず価値へ */}
          <span className="text-sm text-neutral-500">{profile.name}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {profile.focus.map((f) => (
            <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/works"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
        
            作品を見る
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            連絡する
          </Link>
        </div>

        {/* 参考リンクは小さめで表示 */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
          <a className="hover:underline" href={links.x} target="_blank" rel="noreferrer">
            X（最新）
          </a>
          <a className="hover:underline" href={links.note} target="_blank" rel="noreferrer">
            note（制作記録）
          </a>
        </div>
      </section>

      <section>
      <div className="mb-4 flex items-end justify-between">
                <h2 className="text-xl font-semibold">代表作</h2>
          <Link href="/works" className="text-sm text-neutral-700 hover:underline">
            すべて見る
          </Link>
        </div>
        <p className="mb-5 text-sm text-neutral-600">
          授業・支援教室での試作→改善を経た作品から順に掲載します。
        </p>
        <WorkGrid works={works} />
      </section>
    </div>
  );
}

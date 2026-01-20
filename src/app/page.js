import Link from "next/link";
import links from "@/content/links.json";
import profile from "@/content/profile.json";
import { getWorks } from "@/lib/works";
import WorkGrid from "@/components/WorkGrid";

export default function HomePage() {
  const works = getWorks().slice(0, 3);

  return (
    <div className="space-y-10">
       <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
        {/* Step1: ファーストビューを「3秒で伝わる」形に寄せる */}
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
          教育現場で「回る」学習ゲームを作っています
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
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
        
            作品を見る
          </Link>
          <a
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={links.x}
            target="_blank"
            rel="noreferrer"
          >
            X（最新）
          </a>
          <a
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            href={links.note}
            target="_blank"
            rel="noreferrer"
          >
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
        <WorkGrid works={works} />
      </section>
    </div>
  );
}

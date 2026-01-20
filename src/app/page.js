import Link from "next/link";
import links from "@/content/links.json";
import profile from "@/content/profile.json";
import { getWorks } from "@/lib/works";
import WorkGrid from "@/components/WorkGrid";

export default function HomePage() {
  // Homeでは「代表作」までファーストビューに収めることを優先し、表示数を絞る
  const works = getWorks().slice(0, 2);

  return (
    // 上：ヒーロー / 下：制作物（横いっぱい）の上下分離にする
    <div className="space-y-5">
      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 px-6 py-4 shadow-sm sm:px-8 sm:py-5">
    
       {/* sm以上は2カラムにして、右の空きを「情報密度」に変えて高さを圧縮 */}
        <div className="sm:grid sm:grid-cols-12 sm:gap-6 sm:items-start">
          <div className="sm:col-span-7">
            {/* Step1: ファーストビューを「3秒で伝わる」形に寄せる */}
            <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
              教育現場で活用できる学習ゲーム集
            </h1>

            <p className="mt-2 text-base leading-relaxed text-neutral-700">
              小学生〜中学生向け。授業・支援教室・家庭学習で使える教材をゲームとして設計・開発しています。
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                教育 × ゲーム × AI
              </span>
              {/* 名前は主役にしない：視線はまず価値へ */}
              <span className="text-sm text-neutral-500">{profile.name}</span>
            </div>
          </div>

          <div className="mt-3 sm:mt-0 sm:col-span-5 sm:flex sm:flex-col sm:items-end sm:gap-3">
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {profile.focus.map((f) => (
                <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 sm:justify-end">
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

            {/* 参考リンクは右寄せで省スペース */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 sm:justify-end">
              <a className="hover:underline" href={links.x} target="_blank" rel="noreferrer">
                X（最新）
              </a>
              <a className="hover:underline" href={links.note} target="_blank" rel="noreferrer">
                note（制作記録）
              </a>
            </div>
          </div>
        </div>

      </section>

     {/* Works: ここから「作品」エリアとして面で区切る */}
     <section className="rounded-3xl border border-neutral-200/60 bg-neutral-50/80 p-6 shadow-sm sm:p-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-semibold">制作物</h2>
          <Link href="/works" className="text-sm text-neutral-700 hover:underline">
            すべて見る
          </Link>
        </div>

        <p className="mb-4 text-sm text-neutral-600">
          授業・支援教室での試作→改善を経た作品から順に掲載します。
        </p>

        {/* 上品な区切り（薄い線） */}
        <div className="mb-4 h-px w-full bg-neutral-200/60" />

        <WorkGrid works={works} />
      </section>
    </div>
  );
}

import Link from "next/link";
import links from "@/content/links.json";
import profile from "@/content/profile.json";
import { getWorks } from "@/lib/works";
import WorkGrid from "@/components/WorkGrid";

export default function HomePage() {
  const works = getWorks().slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-neutral-600">{profile.name}</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {profile.headline}
        </h1>
        <p className="mt-3 text-neutral-700">{profile.subheadline}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {profile.focus.map((f) => (
            <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/works" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">
            作品を見る
          </Link>
          <a className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
             href={links.x} target="_blank" rel="noreferrer">
            X（最新）
          </a>
          <a className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
             href={links.note} target="_blank" rel="noreferrer">
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

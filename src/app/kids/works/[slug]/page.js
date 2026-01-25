import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import KidsRatingForm from "@/components/KidsRatingForm";
import works from "@/content/works.json";

export function generateStaticParams() {
  return works
    .filter((work) => typeof work.slug === "string" && work.slug.trim().length > 0)
    .map((work) => ({ slug: work.slug }));
}

export const dynamicParams = false;

function chip(text) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-800">
      {text}
    </span>
  );
}

export default async function KidsWorkDetailPage({ params, searchParams }) {
  const defaultCanDo = ["よみを当てる", "モンスターを仲間にする", "旅してステージを進める"];
  const defaultHowToPlay = [
    "「▶ ゲームスタート！」を押す",
    "もんだいを見て、よみを入力する",
    "正解したら、モンスターが仲間になる！",
  ];

  const resolvedParams = await params;
  const workSlug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : "";
  const sessionId =
    typeof searchParams?.s === "string" && searchParams.s.trim().length > 0
      ? searchParams.s.trim()
      : "default";

  const work = works.find((item) => (item?.slug ?? "").trim() === workSlug);
  if (!work) return notFound();

  const playUrl = typeof work.links?.play === "string" ? work.links.play.trim() : "";
  const isWip = work.status === "wip" || playUrl.length === 0;
  const previewVideo =
    typeof work.previewVideo === "string" && work.previewVideo.trim().length > 0
      ? work.previewVideo.trim()
      : "";

  const canDo = Array.isArray(work.canDo) && work.canDo.length > 0 ? work.canDo : defaultCanDo;
  const howToPlay =
    Array.isArray(work.howToPlay) && work.howToPlay.length > 0 ? work.howToPlay : defaultHowToPlay;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/kids/works" className="text-sm text-neutral-700 hover:underline">
          ← ゲーム一覧へ
        </Link>
        <div className="text-sm text-neutral-500">Home / こども / {work.title}</div>
      </div>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{work.title}</h1>
            {work.subtitle && (
              <p className="mt-2 text-sm text-neutral-600 sm:text-base">{work.subtitle}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {chip("ダウンロード不要")}
              {chip("ブラウザでそのまま")}
              {chip("無料")}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isWip ? (
                <span className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-500">
                  🛠 ただいま つくっているよ
                </span>
              ) : (
                <a
                  href={playUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white",
                    "px-7 py-4 text-base font-semibold sm:px-8 sm:py-4 sm:text-lg",
                    "shadow-md",
                    "transition-[transform,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
                    "hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  ▶ ゲームスタート！
                </a>
              )}
              <p className="text-xs text-neutral-500">
                ※ ブラウザでそのまま遊べます。ダウンロードは不要です。
              </p>
            </div>

            <div className="mt-6">
              <KidsRatingForm slug={work.slug} sessionId={sessionId} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
              {previewVideo ? (
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={typeof work.thumb === "string" ? work.thumb : undefined}
                >
                  <source src={previewVideo} type="video/mp4" />
                </video>
              ) : work.thumb ? (
                <Image
                  src={work.thumb}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={false}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">できること</h2>
        <ul className="mt-4 space-y-2 text-neutral-800">
          {canDo.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base sm:text-lg">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-1 h-5 w-5 flex-none text-neutral-900"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white/90 p-6 shadow-sm sm:p-10">
        <h2 className="text-xl font-semibold">あそび方（かんたん3ステップ）</h2>
        <ol className="mt-4 grid gap-3 text-neutral-800 sm:gap-4">
          {howToPlay.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200/60 bg-white px-4 py-4 shadow-sm"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-neutral-300 bg-white text-base font-semibold text-neutral-900">
                {index + 1}
              </span>
              <div className="text-base font-medium leading-relaxed sm:text-lg">{item}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-700">
        <Link href="/kids/works" className="hover:underline">
          ← ゲーム一覧へ
        </Link>
      </div>
    </div>
  );
}

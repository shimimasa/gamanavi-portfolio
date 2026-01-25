import Image from "next/image";
import Link from "next/link";

export default function KidsWorkCard({ work }) {
  const hasThumb = typeof work.thumb === "string" && work.thumb.trim().length > 0;
  const subtitle = typeof work.subtitle === "string" ? work.subtitle.trim() : "";
  const href = typeof work.slug === "string" ? `/kids/works/${work.slug}` : "";

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
      <Link href={href} className="group block h-full">
        <div className="relative aspect-[16/9] bg-neutral-100">
          {hasThumb ? (
            <Image
              src={work.thumb}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="text-xs font-medium text-neutral-500">{work.audience ?? ""}</div>
              <div className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-neutral-900">
                {work.title}
              </div>
              <div className="mt-2 text-xs text-neutral-500">サムネイル準備中</div>
            </div>
          )}
        </div>
        <div className="flex flex-col p-5">
          <div className="text-xs text-neutral-500">🎮 {work.audience}</div>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-neutral-900">
            {work.title}
          </h3>
          {subtitle.length > 0 && (
            <div className="mt-1 line-clamp-1 text-xs text-neutral-600">{subtitle}</div>
          )}
          {work.oneLiner ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">
              {work.oneLiner}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              近日、説明文を追加予定です。
            </p>
          )}
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <span>ゲームを見にいく</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

"use client";

import Image from "next/image";

function LinkButton({ href, children }) {
  if (!href || href.trim().length === 0) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-3 py-1 text-sm font-medium text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

export default function WorkCard({ work }) {

  const hasThumb = typeof work.thumb === "string" && work.thumb.trim().length > 0;
  const tags = Array.isArray(work.tags) ? work.tags : [];
  const shownTags = tags.slice(0, 3);
  const remainingTags = tags.length - shownTags.length;
  const playUrl = work.links?.play?.trim?.() ? work.links.play.trim() : "";
  const isClickable = playUrl.length > 0;

  const handleCardClick = () => {
    if (!isClickable) return;
    window.open(playUrl, "_blank", "noreferrer");
  };

  return (
    <article
      className={[
        "overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition",
        isClickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "",
      ].join(" ")}
      onClick={handleCardClick}
      role={isClickable ? "link" : undefined}
      aria-disabled={!isClickable}
    >
      <div className="relative aspect-[16/9] bg-neutral-100">
        {hasThumb ? (
          <Image
            src={work.thumb}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="text-xs font-medium text-neutral-500">{work.audience ?? ""}</div>
            <div className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900">
              {work.title}
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              サムネイル準備中
            </div>
          </div>
       
        )}
      </div>
      {/* 本文エリア：ボタン群を常に下端に固定する */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-neutral-500">{work.audience}</div>
          {!isClickable && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              準備中
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold">{work.title}</h3>
        {work.oneLiner ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">{work.oneLiner}</p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            近日、説明文を追加予定です。
          </p>
        )}

<div className="mt-3 flex flex-wrap gap-2">
          {shownTags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
            >
              {t}
            </span>
          ))}
          {remainingTags > 0 && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
              +{remainingTags}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <LinkButton href={work.links?.play}>Play</LinkButton>
          <LinkButton href={work.links?.github}>GitHub</LinkButton>
          <LinkButton href={work.links?.note}>note</LinkButton>
        </div>
      </div>
    </article>
  );
}

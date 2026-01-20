"use client";

import Image from "next/image";

function LinkButton({ href, children, variant = "secondary" }) {
  if (!href || href.trim().length === 0) return null;

  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 active:translate-y-px"
      : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={[base, styles].join(" ")}
    >
      {children}
    </a>
  );
}

export default function WorkCard({ work }) {

  const hasThumb = typeof work.thumb === "string" && work.thumb.trim().length > 0;
  const subtitle = typeof work.subtitle === "string" ? work.subtitle.trim() : "";

  // tags は旧仕様（後方互換）。新仕様は subjectTags / featureTags。
  const legacyTags = Array.isArray(work.tags) ? work.tags : [];
  const subjectTags = Array.isArray(work.subjectTags) ? work.subjectTags : legacyTags;
  const featureTags = Array.isArray(work.featureTags) ? work.featureTags : [];

  const shownSubjectTags = subjectTags.slice(0, 3);
  const remainingSubject = subjectTags.length - shownSubjectTags.length;

  const shownFeatureTags = featureTags.slice(0, 3);
  const remainingFeature = featureTags.length - shownFeatureTags.length;

  const playUrl = work.links?.play?.trim?.() ? work.links.play.trim() : "";
  const isWip = work.status === "wip" || playUrl.length === 0;
  const isClickable = !isWip && playUrl.length > 0;

  // バッジ（データで指定があれば優先。なければ状態で自動付与）
  const badgeText =
    typeof work.badge === "string" && work.badge.trim().length > 0
      ? work.badge.trim()
      : isWip
      ? "準備中"
      : "NEW";

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
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-neutral-500">🎮 {work.audience}</div>
                  {isWip && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              🛠 ただいま つくっているよ
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold">{work.title}</h3>
        {subtitle.length > 0 && (
          <div className="mt-1 line-clamp-1 text-xs text-neutral-600">
            {subtitle}
          </div>
        )}
        {work.oneLiner ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">{work.oneLiner}</p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            近日、説明文を追加予定です。
          </p>
        )}
{/* タグ（上：教科 / 下：体験） */}
        <div className="mt-3 space-y-2">
          {shownSubjectTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {shownSubjectTags.map((t) => (
                <span
                  key={`subject-${t}`}
                  className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-800"
                 >
                  {t}
                </span>
              ))}
              {remainingSubject > 0 && (
                <span className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-800">
                  +{remainingSubject}
                </span>
              )}
            </div>
          )}

          {shownFeatureTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {shownFeatureTags.map((t) => (
                <span
                  key={`feature-${t}`}
                  className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-800"
                >
                  {t}
                </span>
              ))}
              {remainingFeature > 0 && (
                <span className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-800">
                  +{remainingFeature}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ボタン行：主ボタンを固定的に目立たせ、1段に寄せる */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {/* 主ボタン（文言はUI側で固定。URLは links.play を参照） */}
          {isWip ? (
            <span className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-500">
               🛠 ただいま つくっているよ
            </span>
          ) : (
            <div className="flex-1 min-w-[180px]">              <LinkButton href={playUrl} variant="primary">
                          ▶ ゲームスタート！
                        </LinkButton>
          </div>
          )}
          <div className="flex flex-wrap gap-2">
            <LinkButton href={work.links?.github} variant="secondary">
              GitHub
            </LinkButton>
            <LinkButton href={work.links?.note} variant="secondary">
              note
            </LinkButton>
          </div>
        </div>
      </div>
    </article>
  );
}

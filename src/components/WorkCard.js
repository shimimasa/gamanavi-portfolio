import Image from "next/image";

function LinkButton({ href, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:border-neutral-900"
    >
      {children}
    </a>
  );
}

export default function WorkCard({ work }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] bg-neutral-100">
        <Image
          src={work.thumb}
          alt={work.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <div className="text-xs text-neutral-500">{work.audience}</div>
        <h3 className="mt-1 text-base font-semibold">{work.title}</h3>
        <p className="mt-2 text-sm text-neutral-700">{work.oneLiner}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(work.tags ?? []).slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <LinkButton href={work.links?.play}>Play</LinkButton>
          <LinkButton href={work.links?.github}>GitHub</LinkButton>
          <LinkButton href={work.links?.note}>note</LinkButton>
        </div>
      </div>
    </article>
  );
}

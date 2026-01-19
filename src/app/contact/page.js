import links from "@/content/links.json";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact</h1>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-neutral-700">
          連絡は、まずはXまたはnoteからで問題ありません。協業・制作相談なども歓迎します。
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
             href={links.x} target="_blank" rel="noreferrer">
            X（DM）
          </a>
          <a className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
             href={links.note} target="_blank" rel="noreferrer">
            note
          </a>
        </div>

        <div className="mt-6 text-sm text-neutral-600">
          相談例：学習ゲームの共同開発／教材のゲーム化／教育現場向けの試作・検証 など
        </div>
      </section>
    </div>
  );
}

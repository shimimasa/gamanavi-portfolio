export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">お知らせ</h1>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-neutral-700">
          このページは大人向けです。おうちの方・先生はこちらからアクセスしてください。
        </p>

        <div className="mt-5">
          <a className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
             href="/parents/contact">
            おうちの方・先生はこちら
          </a>
        </div>
      </section>
    </div>
  );
}

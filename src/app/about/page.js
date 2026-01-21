import profile from "@/content/profile.json";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">自己紹介</h1>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">経歴・取り組み</h2>
        <p className="mt-3 text-neutral-700">
        <li>社会福祉士・中学高校社会科教員免許所持。小学校～高校の発達障害児への学習指導歴4年。</li>
        <li>AIを活用して、教育現場で使える学習ゲーム／教材を開発しています。</li>
        <li>発達特性に配慮し、「短時間で達成感」「操作がシンプル」「視覚的に理解できる」設計を重視します。</li>
        </p>
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {profile.focus.map((f) => (
            <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">できること（例）</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
          <li>学習ゲームの企画〜実装（Web）</li>
          <li>授業・支援教室で回るUI設計（低負荷・短時間）</li>
          <li>データ駆動（JSON）での大量コンテンツ管理</li>
        </ul>
      </section>
    </div>
  );
}

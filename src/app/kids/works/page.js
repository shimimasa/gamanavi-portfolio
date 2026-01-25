import { getWorks } from "@/lib/works";
import KidsWorkGrid from "@/components/KidsWorkGrid";

export default function KidsWorksPage() {
  const works = getWorks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">ゲーム一覧</h1>
        <p className="mt-2 text-neutral-700">あそびたいゲームを選んでね。</p>
      </div>
      <KidsWorkGrid works={works} />
    </div>
  );
}

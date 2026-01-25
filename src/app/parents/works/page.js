"use client";

import { useMemo, useState } from "react";
import { getWorks, getCategories } from "@/lib/works";
import FilterTabs from "@/components/FilterTabs";
import WorkGrid from "@/components/WorkGrid";

export default function ParentsWorksPage() {
  const allWorks = getWorks();
  const categories = getCategories();
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return allWorks;
    return allWorks.filter((work) => work.category === active);
  }, [active, allWorks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">作品一覧（保護者・先生向け）</h1>
        <p className="mt-2 text-neutral-700">
          授業や家庭学習で活用できる学習ゲームをまとめています。ねらいや学びのポイントは各作品ページでご確認ください。
        </p>
        <div className="mt-3 text-sm text-neutral-500">表示：{filtered.length}件</div>
      </div>

      <FilterTabs categories={categories} active={active} onChange={setActive} />
      <WorkGrid works={filtered} />
    </div>
  );
}

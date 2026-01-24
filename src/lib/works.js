import works from "@/content/works.json";

export const FEATURED_LIMIT = 3;

export function getWorks() {
  // 表示順を固定したい場合はここでソート（今は追加順）
  return works;
}

export function getFeaturedWorks(allWorks, limit = FEATURED_LIMIT) {
  const list = Array.isArray(allWorks) ? allWorks : [];
  const indexMap = new Map(list.map((work, index) => [work, index]));

  const featured = list
    .filter((work) => work?.featured === true)
    .sort((a, b) => {
      const orderA = typeof a.featuredOrder === "number" ? a.featuredOrder : Number.POSITIVE_INFINITY;
      const orderB = typeof b.featuredOrder === "number" ? b.featuredOrder : Number.POSITIVE_INFINITY;

      if (orderA !== orderB) return orderA - orderB;
      return (indexMap.get(a) ?? 0) - (indexMap.get(b) ?? 0);
    });

  const initial = featured.slice(0, limit);
  if (initial.length >= limit) return initial;

  const selected = new Set(initial);
  const fallback = list.filter((work) => !selected.has(work));

  return [...initial, ...fallback].slice(0, limit);
}

export function getCategories() {
  const set = new Set(works.map((w) => w.category));
  return Array.from(set);
}

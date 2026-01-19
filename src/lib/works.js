import works from "@/content/works.json";

export function getWorks() {
  // 表示順を固定したい場合はここでソート（今は追加順）
  return works;
}

export function getCategories() {
  const set = new Set(works.map((w) => w.category));
  return Array.from(set);
}

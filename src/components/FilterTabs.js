export default function FilterTabs({ categories, active, onChange }) {
    const all = "all";
    const items = [all, ...categories];
  
    const label = (key) => {
      const map = {
        all: "すべて",
        game: "学習ゲーム",
        teaching: "授業教材",
        tool: "ツール",
        mystery: "マダミス",
        writing: "記事"
      };
      return map[key] ?? key;
    };
  
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((key) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={[
                "rounded-full border px-3 py-1 text-sm",
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white hover:border-neutral-900"
              ].join(" ")}
              type="button"
            >
              {label(key)}
            </button>
          );
        })}
      </div>
    );
  }
  
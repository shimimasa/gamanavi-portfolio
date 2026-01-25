"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isKids = pathname.startsWith("/kids");
  const isParents = pathname === "/parents" || pathname.startsWith("/parents/");
  const isActive = (href) => pathname === href;
  const isKidsActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const base =
    "rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";
  const active =
    "bg-neutral-900 text-white hover:bg-neutral-900 hover:text-white";

  const brand =
    "inline-flex items-center gap-2 rounded-lg px-2 py-1 text-neutral-900 " +
    "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";
  const handleExitParentsMode = () => {
    const cookieBase =
      "gamanavi_audience=; Max-Age=0; Path=/; SameSite=Lax";
    document.cookie = cookieBase;
    if (window.location.protocol === "https:") {
      document.cookie = `${cookieBase}; Secure`;
    }
    router.push("/kids");
  };
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link
          href={isKids ? "/kids" : "/"}
          aria-label="Homeへ戻る"
          className={`${brand} whitespace-nowrap font-semibold tracking-tight`}
        >
          <span>gamanavi / 学習ゲーム置き場</span>
          <span className="hidden sm:inline text-xs font-medium text-neutral-500">
            Home
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {isKids ? (
            <>
              <Link
                href="/kids"
                className={`${base} ${isActive("/kids") ? active : ""}`}
                aria-current={isActive("/kids") ? "page" : undefined}
              >
                こどもトップ
              </Link>
              <Link
                href="/kids/works"
                className={`${base} ${isKidsActive("/kids/works") ? active : ""}`}
                aria-current={isKidsActive("/kids/works") ? "page" : undefined}
              >
                ゲーム一覧
              </Link>
              <Link
                href="/kids/parents-gate"
                className={`${base} ${isKidsActive("/kids/parents-gate") ? active : ""}`}
                aria-current={isKidsActive("/kids/parents-gate") ? "page" : undefined}
              >
                おうちの方へ
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/works"
                className={`${base} ${isActive("/works") ? active : ""}`}
                aria-current={isActive("/works") ? "page" : undefined}
              >
                制作物
              </Link>
              <Link
                href="/about"
                className={`${base} ${isActive("/about") ? active : ""}`}
                aria-current={isActive("/about") ? "page" : undefined}
              >
                自己紹介
              </Link>
              <Link
                href="/contact"
                className={`${base} ${isActive("/contact") ? active : ""}`}
                aria-current={isActive("/contact") ? "page" : undefined}
              >
                お問い合わせ
              </Link>
            </>
          )}
          {!isKids && isParents ? (
            <button
              type="button"
              onClick={handleExitParentsMode}
              className={`${base} border border-neutral-300`}
            >
              保護者モード終了
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

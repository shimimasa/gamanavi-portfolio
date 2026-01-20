"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  const base =
    "rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";
  const active =
    "bg-neutral-900 text-white hover:bg-neutral-900 hover:text-white";
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link
          href="/"
          className="whitespace-nowrap font-semibold tracking-tight text-neutral-900"
        >
          gamanavi / portfolio
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/works"
            className={`${base} ${isActive("/works") ? active : ""}`}
            aria-current={isActive("/works") ? "page" : undefined}
          >
            Works
          </Link>
          <Link
            href="/about"
            className={`${base} ${isActive("/about") ? active : ""}`}
            aria-current={isActive("/about") ? "page" : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`${base} ${isActive("/contact") ? active : ""}`}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          gamanavi / portfolio
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/works" className="hover:underline">Works</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

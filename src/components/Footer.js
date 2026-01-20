import links from "@/content/links.json";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-neutral-600">
      <div className="flex flex-wrap items-center gap-5">
          <a className="hover:underline" href={links.x} target="_blank" rel="noreferrer">
            X
          </a>
          <a className="hover:underline" href={links.note} target="_blank" rel="noreferrer">
            note
          </a>
          <a className="hover:underline" href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          © {new Date().getFullYear()} Masanobu Shimizu
        </div>
      </div>
    </footer>
  );
}

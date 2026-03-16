// GiftByte shared footer.
// Used on all public/auth pages via <Footer />.

const GITHUB_REPO = "https://github.com/PoPLama/GiftByte";
const CREATOR_GITHUB = "https://github.com/PoPLama";

const links = [
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support the Project", href: "/support-the-project" },
  { label: "GitHub", href: GITHUB_REPO, external: true },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-sky-900/20 pt-5 pb-7 text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-300/40 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] text-sky-300/40 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          )
        )}
      </nav>
      <p className="mt-2.5 text-[10px] text-sky-400/28">
        © 2026 GiftByte — Cyber Celebration Platform
      </p>
      <p className="mt-0.5 text-[10px] text-sky-400/22">
        Built by{" "}
        <a
          href={CREATOR_GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400/40 transition-colors hover:text-cyan-300"
        >
          Metsuki
        </a>
      </p>
    </footer>
  );
}

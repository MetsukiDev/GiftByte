// GiftByte shared footer.
// Used on public/auth pages. Can be dropped into internal pages later.
// Placeholders to replace: GITHUB_URL, SUPPORT_EMAIL

const GITHUB_URL = "https://github.com/your-org/giftbyte"; // TODO: replace with real repo URL

const links = [
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support the Project", href: "/support-the-project" },
  { label: "GitHub", href: GITHUB_URL, external: true },
];

export default function Footer() {
  return (
    <footer className="mt-8 w-full text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-300/60 hover:text-cyan-300 transition-colors"
            >
              {link.label}
            </a>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] text-sky-300/60 hover:text-cyan-300 transition-colors"
            >
              {link.label}
            </a>
          )
        )}
      </nav>
      <p className="mt-3 text-[10px] text-sky-400/40">
        © {new Date().getFullYear()} GiftByte. All rights reserved.
      </p>
    </footer>
  );
}

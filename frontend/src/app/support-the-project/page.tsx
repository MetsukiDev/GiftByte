import Footer from "@/components/Footer";

// TODO: replace these with real links when monetization is configured
const GITHUB_URL = "https://github.com/your-org/giftbyte";
const GITHUB_SPONSORS_URL = "https://github.com/sponsors/your-username"; // TODO: replace
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/your-username"; // TODO: replace or remove

export default function SupportTheProjectPage() {
  return (
    <div className="auth-wrapper flex-col items-center">
      <div className="cyber-grid" />
      <div className="cyber-glow" />

      <div className="relative z-10 w-full max-w-2xl space-y-6 px-4 py-10">
        <div className="card-holo px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
            GIFTBYTE // COMMUNITY
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-sky-50">
            Support the Project
          </h1>
          <p className="mt-3 text-sm text-sky-100/80">
            GiftByte is an evolving open project built by a small team. If you
            find it useful, there are a few ways to help it grow.
          </p>
        </div>

        <div className="card-holo px-6 py-6 space-y-4">
          <h2 className="text-sm font-semibold text-cyan-200">
            Star & share on GitHub
          </h2>
          <p className="text-sm text-sky-100/80">
            The easiest way to support GiftByte is to star the repository and
            share it with people who might find it useful.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber-primary inline-flex items-center justify-center px-5 py-2 text-xs tracking-[0.18em]"
          >
            View on GitHub
          </a>
        </div>

        <div className="card-holo px-6 py-6 space-y-4">
          <h2 className="text-sm font-semibold text-cyan-200">
            Sponsor the author
          </h2>
          <p className="text-sm text-sky-100/80">
            Sponsoring helps fund continued development, new features, and
            keeping the project maintained.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={GITHUB_SPONSORS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-holo card-holo-hover inline-flex items-center justify-center border border-cyan-500/40 px-4 py-2 text-xs font-medium text-sky-100/90"
            >
              GitHub Sponsors
            </a>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-holo card-holo-hover inline-flex items-center justify-center border border-cyan-500/40 px-4 py-2 text-xs font-medium text-sky-100/90"
            >
              Buy Me a Coffee
            </a>
          </div>
          <p className="text-[11px] text-sky-400/50">
            Sponsorship links are placeholders — replace with real URLs before publishing.
          </p>
        </div>

        <div className="card-holo px-6 py-6 space-y-3">
          <h2 className="text-sm font-semibold text-cyan-200">
            Contribute
          </h2>
          <p className="text-sm text-sky-100/80">
            Found a bug? Have a feature idea? Pull requests and issues are
            welcome on GitHub.
          </p>
          <a
            href={`${GITHUB_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-300 underline-offset-4 hover:underline"
          >
            Open an issue
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

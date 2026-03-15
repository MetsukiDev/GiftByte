import Footer from "@/components/Footer";

// TODO: replace GITHUB_URL with real repo URL
const GITHUB_URL = "https://github.com/your-org/giftbyte";

export default function AboutPage() {
  return (
    <div className="auth-wrapper flex-col items-center">
      <div className="cyber-grid" />
      <div className="cyber-glow" />

      <div className="relative z-10 w-full max-w-2xl space-y-6 px-4 py-10">
        <div className="card-holo px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
            GIFTBYTE // ABOUT
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-sky-50">
            What is GiftByte?
          </h1>
          <p className="mt-3 text-sm text-sky-100/80">
            GiftByte is a wishlist platform built for celebrations. Create a
            wishlist for a birthday, wedding, or any event, add the gifts you
            actually want, publish a shareable link, and let friends reserve or
            contribute — without spoiling the surprise.
          </p>
          <p className="mt-2 text-sm text-sky-100/80">
            Owners never see who reserved or contributed to a gift. Friends
            never need an account to participate.
          </p>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Core features
          </h2>
          <ul className="space-y-2 text-sm text-sky-100/80">
            <li>— Create wishlists with title, description, event date, and cover image</li>
            <li>— Add single gifts (one person reserves) or group gifts (multiple people contribute)</li>
            <li>— Publish a public share link — no login required for friends</li>
            <li>— Friends reserve or contribute directly from the public page</li>
            <li>— Owner sees funding progress without seeing contributor identities</li>
            <li>— Participation history for friends who have reserved or contributed</li>
            <li>— Wallet with mock top-up for local testing</li>
          </ul>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Tech stack
          </h2>
          <ul className="space-y-1 text-sm text-sky-100/80">
            <li>— Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT auth</li>
            <li>— Frontend: Next.js App Router, TypeScript, Tailwind CSS</li>
            <li>— Realtime (MVP): WebSocket rooms per wishlist</li>
          </ul>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Roadmap
          </h2>
          <ul className="space-y-2 text-sm text-sky-100/80">
            <li>— Final cyberpunk visual design pass</li>
            <li>— Real payment provider integration</li>
            <li>— Email notifications for owners and contributors</li>
            <li>— Mobile app</li>
            <li>— Social sharing improvements</li>
          </ul>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Open source
          </h2>
          <p className="text-sm text-sky-100/80">
            GiftByte is an open project.{" "}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline-offset-4 hover:underline"
            >
              View the repository on GitHub
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

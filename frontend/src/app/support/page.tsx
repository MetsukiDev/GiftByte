import Footer from "@/components/Footer";

// TODO: replace with real support email
const SUPPORT_EMAIL = "support@giftbyte.app";

const faqs = [
  {
    q: "How do I share my wishlist with friends?",
    a: "Open your wishlist, click Publish & Share, then copy the share link. Anyone with the link can view and interact with your wishlist — no account needed.",
  },
  {
    q: "Can friends see who else reserved or contributed?",
    a: "No. Contributor and reserver identities are never shown to anyone. The owner only sees safe statuses and funding progress.",
  },
  {
    q: "How do I delete a wishlist?",
    a: "Open the wishlist detail page and click Delete wishlist at the top right. You will be asked to confirm before it is removed.",
  },
  {
    q: "What is a group gift?",
    a: "A group gift allows multiple friends to contribute partial amounts toward a single gift. The owner sees total funding progress but not individual contributions.",
  },
  {
    q: "Is my account data safe?",
    a: "Passwords are hashed and never stored in plain text. Access tokens are stored in your browser's localStorage and are not shared with third parties.",
  },
  {
    q: "How do I report a bug or issue?",
    a: "Email us or open an issue on GitHub. See the links below.",
  },
];

export default function SupportPage() {
  return (
    <div className="auth-wrapper flex-col items-center">
      <div className="cyber-grid" />
      <div className="cyber-glow" />

      <div className="relative z-10 w-full max-w-2xl space-y-6 px-4 py-10">
        <div className="card-holo px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
            GIFTBYTE // SUPPORT
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-sky-50">
            Help & Support
          </h1>
          <p className="mt-3 text-sm text-sky-100/80">
            Need help with GiftByte? Start with the FAQ below. If you can&apos;t
            find an answer, reach out directly.
          </p>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-4 text-sm font-semibold text-cyan-200">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {faqs.map((item) => (
              <div key={item.q}>
                <p className="text-xs font-semibold text-sky-50">{item.q}</p>
                <p className="mt-1 text-xs text-sky-200/80">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Contact support
          </h2>
          <p className="text-sm text-sky-100/80">
            Email us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-cyan-300 underline-offset-4 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-sky-200/70">
            For bug reports and feature requests, please open an issue on{" "}
            <a
              href="https://github.com/your-org/giftbyte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            . {/* TODO: replace GitHub URL */}
          </p>
        </div>

        <div className="card-holo px-6 py-6">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Account help
          </h2>
          <p className="text-sm text-sky-100/80">
            If you need to delete your account or request removal of your data,
            email us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-cyan-300 underline-offset-4 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            with the subject line <span className="text-sky-50">Account deletion request</span>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

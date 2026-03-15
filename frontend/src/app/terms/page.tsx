import Footer from "@/components/Footer";

// TODO: replace with real contact email
const CONTACT_EMAIL = "support@giftbyte.app";

export default function TermsPage() {
  return (
    <div className="auth-wrapper flex-col items-center">
      <div className="cyber-grid" />
      <div className="cyber-glow" />

      <div className="relative z-10 w-full max-w-2xl space-y-6 px-4 py-10">
        <div className="card-holo px-6 py-6">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
            GIFTBYTE // LEGAL
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-sky-50">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-sky-300/70">Last updated: 2025</p>
        </div>

        <div className="card-holo px-6 py-6 space-y-4 text-sm text-sky-100/80">
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Acceptable use
            </h2>
            <p>
              GiftByte is provided for personal, non-commercial use to create
              and share celebration wishlists. You agree not to use GiftByte
              for any unlawful, abusive, or fraudulent purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Account responsibility
            </h2>
            <p>
              You are responsible for maintaining the security of your account
              credentials. Do not share your password. You are responsible for
              all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Public wishlist usage
            </h2>
            <p>
              When you publish a wishlist, you make it accessible to anyone
              with the share link. Do not include sensitive personal information
              in public wishlist titles, descriptions, or gift details.
            </p>
            <p className="mt-2">
              Friends who interact with your wishlist (reserving or
              contributing) do so voluntarily. GiftByte does not guarantee
              that any gift will be reserved, contributed to, or fulfilled.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              No abuse or misuse
            </h2>
            <p>
              You agree not to attempt to reverse-engineer, scrape, or
              interfere with the GiftByte service. Accounts found to be
              abusing the platform may be suspended or removed without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Service availability
            </h2>
            <p>
              GiftByte is provided as-is. We do not guarantee uninterrupted
              availability. The service may be updated, modified, or
              discontinued at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, GiftByte and
              its contributors are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-cyan-300 underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

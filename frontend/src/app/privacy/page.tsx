import Footer from "@/components/Footer";

// TODO: replace with real support/privacy contact email
const PRIVACY_EMAIL = "privacy@giftbyte.app";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-sky-300/70">Last updated: 2025</p>
        </div>

        <div className="card-holo px-6 py-6 space-y-4 text-sm text-sky-100/80">
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              What data we collect
            </h2>
            <p>
              When you create an account, we collect your email address,
              nickname, and password (stored as a secure hash). You may
              optionally provide an avatar URL and payout method.
            </p>
            <p className="mt-2">
              When you create wishlists or gifts, we store the content you
              provide: titles, descriptions, event dates, product URLs, and
              images.
            </p>
            <p className="mt-2">
              When a friend reserves or contributes to a gift on a public
              wishlist, we store the action and any optional name they provide.
              We do not require friends to create an account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              How we use your data
            </h2>
            <p>
              Your data is used solely to operate the GiftByte service: to
              authenticate your account, display your wishlists, and process
              gift reservations and contributions. We do not sell your data to
              third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Authentication & tokens
            </h2>
            <p>
              We use JWT-based authentication. Your access token is stored in
              your browser&apos;s <code className="text-cyan-300">localStorage</code>.
              It is not shared with third parties and expires after a
              configurable period.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Public wishlist links
            </h2>
            <p>
              When you publish a wishlist, a public share link is generated.
              Anyone with this link can view your wishlist and interact with
              gifts. You can archive (delete) a wishlist at any time to make
              the public link inaccessible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Cookies & local storage
            </h2>
            <p>
              GiftByte does not use tracking cookies. We use
              browser <code className="text-cyan-300">localStorage</code> to
              store your authentication token for the duration of your session.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Your rights
            </h2>
            <p>
              You may request deletion of your account and associated data at
              any time by contacting us. We will process deletion requests
              within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Contact
            </h2>
            <p>
              For privacy questions or data deletion requests, email{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="text-cyan-300 underline-offset-4 hover:underline"
              >
                {PRIVACY_EMAIL}
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

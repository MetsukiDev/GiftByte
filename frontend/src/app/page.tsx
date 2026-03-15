import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="auth-wrapper">
      <div className="cyber-grid" />
      <div className="cyber-glow" />
      <div className="pixel-skyline">
        <div className="pixel-car" />
        <div className="pixel-car pixel-car--2" />
        <div className="pixel-car pixel-car--3" />
      </div>

      <div className="auth-inner">
        <main className="relative panel-cyber px-6 py-7 sm:px-8 sm:py-9">
          <div className="pixel-scanlines" />
          <div className="relative z-10 text-center">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-cyan-300">
              GIFTBYTE // CYBER CELEBRATION
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-sky-50">
              CyberPixel Celebration Grid
            </h1>
            <p className="mt-2 text-xs text-sky-200/70">
              Spin up wishlists in a neon skyline and share them with your crew.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/login"
                className="btn-cyber-primary flex w-full items-center justify-center px-4 py-2 text-xs tracking-[0.18em]"
              >
                LOGIN TO GRID
              </a>
              <a
                href="/register"
                className="card-holo card-holo-hover flex w-full items-center justify-center border px-4 py-2 text-xs font-medium tracking-[0.16em] text-sky-100/90"
              >
                CREATE NEW ID
              </a>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

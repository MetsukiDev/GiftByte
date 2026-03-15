import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="auth-scene">
      {/* Fixed scene layers */}
      <div className="scene-sky" />
      <div className="scene-moon" />
      <div className="cyber-grid" />
      <div className="cyber-glow" />
      <div className="skyline-fog" />
      <div className="skyline-far" />
      <div className="skyline-fog-mid" />
      <div className="skyline-mid" />
      <div className="skyline-near" />
      <div className="skyline-ground" />
      <div className="pixel-car" />
      <div className="pixel-car pixel-car--2" />
      <div className="pixel-car pixel-car--3" />
      <div className="pixel-car pixel-car--4" />
      <div className="pixel-drone pixel-drone--1"><div className="drone-beam" /></div>
      <div className="pixel-drone pixel-drone--2" />
      <div className="pixel-drone pixel-drone--3" />
      <div className="pixel-drone pixel-drone--4" />
      <div className="holo-orb holo-orb--1" />
      <div className="holo-orb holo-orb--2" />
      <div className="holo-orb holo-orb--3" />

      <div className="auth-scene-body">
        {/* Left: landing panel */}
        <div className="auth-panel-col">
          <div className="relative panel-cyber px-7 py-9 sm:px-9 sm:py-11">
            <div className="pixel-scanlines" />
            <div className="relative z-10 text-center">
              <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-300/80">
                GIFTBYTE // CYBER CELEBRATION
              </p>
              <h1 className="mt-3 text-3xl font-bold text-sky-50 tracking-tight leading-tight">
                CyberPixel<br />Celebration Grid
              </h1>
              <p className="mt-3 text-xs text-sky-200/60 leading-relaxed">
                Spin up wishlists in a neon skyline and share them with your crew.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href="/login"
                  className="btn-cyber-primary flex w-full items-center justify-center px-4 py-3 text-xs tracking-[0.2em]"
                >
                  LOGIN TO GRID
                </a>
                <a
                  href="/register"
                  className="card-holo card-holo-hover flex w-full items-center justify-center border border-cyan-500/30 px-4 py-3 text-xs font-semibold tracking-[0.16em] text-sky-100/80"
                >
                  CREATE NEW ID
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: atmospheric scene */}
        <div className="auth-scene-col">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-400/45 mb-1.5">
            OPEN SOURCE // FREE TO USE
          </p>
          <h2 className="text-2xl font-bold text-sky-50/85 leading-tight tracking-tight mb-2.5">
            Gifts, funded<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
              by the grid.
            </span>
          </h2>
          <p className="text-xs text-sky-200/45 max-w-[220px] leading-relaxed mb-4">
            The cyberpunk wishlist platform for modern celebrations. Share a link. Let your crew contribute.
          </p>
          <div className="flex flex-col gap-1.5">
            <div className="scene-feature-pill">
              <span className="scene-feature-dot bg-cyan-400"></span>
              Single gifts — reserve in one click
            </div>
            <div className="scene-feature-pill">
              <span className="scene-feature-dot bg-fuchsia-400"></span>
              Group gifts — crowdfund together
            </div>
            <div className="scene-feature-pill">
              <span className="scene-feature-dot bg-indigo-400"></span>
              Public links, no account to gift
            </div>
            <div className="scene-feature-pill">
              <span className="scene-feature-dot bg-emerald-400"></span>
              Follow wishlists from your crew
            </div>
          </div>
        </div>
      </div>

      <div className="auth-scene-footer">
        <Footer />
      </div>
    </div>
  );
}

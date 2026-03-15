import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="auth-scene">
      {/* Fixed scene layers */}
      <div className="cyber-grid" />
      <div className="cyber-glow" />
      <div className="skyline-fog" />
      <div className="skyline-far" />
      <div className="skyline-mid" />
      <div className="skyline-near" />
      <div className="skyline-ground" />
      <div className="pixel-car" />
      <div className="pixel-car pixel-car--2" />
      <div className="pixel-car pixel-car--3" />
      <div className="pixel-drone pixel-drone--1"><div className="drone-beam" /></div>
      <div className="pixel-drone pixel-drone--2" />
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
          <div className="flex h-full flex-col justify-center gap-6 pl-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-400/50 mb-2">
                OPEN SOURCE // FREE TO USE
              </p>
              <h2 className="text-3xl font-bold text-sky-50/80 leading-tight tracking-tight">
                Gifts, funded<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
                  by the grid.
                </span>
              </h2>
              <p className="mt-3 text-sm text-sky-200/40 max-w-xs leading-relaxed">
                The cyberpunk wishlist platform for modern celebrations. Share a link. Let your crew contribute.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[11px] text-sky-300/35">
              <span>✦ Single gifts — reserve in one click</span>
              <span>✦ Group gifts — crowdfund together</span>
              <span>✦ Public share links, no account needed to gift</span>
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

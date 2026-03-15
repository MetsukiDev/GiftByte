"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerRequest({ email, password, nickname });
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error during registration.");
    } finally {
      setLoading(false);
    }
  }

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
        {/* Left: auth panel */}
        <div className="auth-panel-col">
          <div className="relative panel-cyber px-7 py-9 sm:px-9 sm:py-11">
            <div className="pixel-scanlines" />
            <div className="relative z-10">
              <div className="mb-7">
                <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-300/80">
                  GIFTBYTE // NEW USER
                </p>
                <h1 className="mt-2 text-2xl font-bold text-sky-50 tracking-tight">
                  Register Celebration ID
                </h1>
                <p className="mt-1.5 text-xs text-sky-200/60">
                  Spin up your cyber wishlist identity.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-rose-500/55 bg-rose-950/40 px-4 py-2.5 text-xs text-rose-100 shadow-[0_0_16px_rgba(248,113,113,0.35)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.18em] text-cyan-300/75">
                    EMAIL IDENT
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-cyber w-full px-4 py-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nickname" className="block text-[11px] font-semibold tracking-[0.18em] text-cyan-300/75">
                    HANDLE
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="input-cyber w-full px-4 py-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-[11px] font-semibold tracking-[0.18em] text-cyan-300/75">
                    ACCESS KEY
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-cyber w-full px-4 py-2.5 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyber-primary mt-1 flex w-full items-center justify-center px-4 py-3 text-xs tracking-[0.2em]"
                >
                  {loading ? "CREATING NODE..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <p className="mt-5 text-center text-[11px] text-sky-200/55">
                Already part of the grid?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-semibold text-fuchsia-300 underline-offset-4 hover:underline"
                >
                  Return to login
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right: atmospheric scene copy */}
        <div className="auth-scene-col">
          <div className="flex h-full flex-col justify-center gap-6 pl-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-400/50 mb-2">
                GIFTBYTE // CYBER CELEBRATION PLATFORM
              </p>
              <h2 className="text-3xl font-bold text-sky-50/80 leading-tight tracking-tight">
                Your celebration<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
                  starts here.
                </span>
              </h2>
              <p className="mt-3 text-sm text-sky-200/40 max-w-xs leading-relaxed">
                Create your free account and start building wishlists for every occasion — birthdays, weddings, and beyond.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[11px] text-sky-300/35">
              <span>✦ Free to use, open source</span>
              <span>✦ Share wishlists with a single link</span>
              <span>✦ Group funding for bigger gifts</span>
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

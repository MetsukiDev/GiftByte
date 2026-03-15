"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth";

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
      const message =
        err instanceof Error ? err.message : "Unexpected error during registration.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

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
        <div className="relative panel-cyber px-6 py-8 sm:px-8 sm:py-10">
          <div className="pixel-scanlines" />
          <div className="pixel-drone" style={{ top: "-32px", left: "8%" }} />
          <div
            className="pixel-drone"
            style={{ top: "-10px", right: "6%", animationDelay: "0.8s" }}
          />
          <div
            className="pixel-drone"
            style={{ top: "30px", left: "14%", animationDelay: "1.4s" }}
          />

          <div className="holo-balloons">
            <div className="holo-balloon" />
            <div className="holo-balloon" />
            <div className="holo-balloon" />
          </div>

          <div className="relative z-10">
            <div className="mb-6 text-center">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
                GIFTBYTE // NEW USER
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-sky-50">
                Register Celebration ID
              </h1>
              <p className="mt-1 text-xs text-sky-200/70">
                Spin up your cyber wishlist identity.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-100 shadow-[0_0_18px_rgba(248,113,113,0.45)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold tracking-[0.16em] text-cyan-300/80"
                >
                  EMAIL IDENT
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-cyber w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="nickname"
                  className="block text-xs font-semibold tracking-[0.16em] text-cyan-300/80"
                >
                  HANDLE
                </label>
                <input
                  id="nickname"
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="input-cyber w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-[0.16em] text-cyan-300/80"
                >
                  ACCESS KEY
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-cyber w-full px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-primary mt-2 flex w-full items-center justify-center px-4 py-2 text-xs tracking-[0.18em]"
              >
                {loading ? "CREATING NODE..." : "CREATE ACCOUNT"}
              </button>
            </form>

            <p className="mt-4 text-center text-[11px] text-sky-200/70">
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
    </div>
  );
}


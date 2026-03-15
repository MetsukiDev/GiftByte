"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, type User } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(token);
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("access_token");
        }
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load your account. Please sign in again.";
          setError(message);
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#02030a] text-sky-100">
      <aside className="flex h-screen w-60 flex-col border-r border-sky-900/70 bg-slate-950/70 px-4 py-6 shadow-[8px_0_32px_rgba(15,23,42,0.9)]">
        <div className="mb-6 px-2 text-lg font-semibold tracking-[0.18em] text-cyan-300">
          GIFTBYTE
        </div>
        <nav className="flex-1 space-y-1 text-xs">
          <button
            type="button"
            className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => router.push("/wishlists")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            My Wishlists
          </button>
          <button
            type="button"
            onClick={() => router.push("/wishlists/create")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Create Wishlist
          </button>
          <button
            type="button"
            onClick={() => router.push("/participation")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Participation
          </button>
          <button
            type="button"
            onClick={() => router.push("/wallet")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Wallet
          </button>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center rounded-md border border-rose-500/60 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-rose-100 hover:bg-rose-950/60"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-sky-50">
          {user ? `Welcome, ${user.nickname}` : "Welcome to GiftByte"}
        </h1>
        <p className="mb-6 text-xs text-sky-200/70">
          This is your dashboard. Here you&apos;ll manage your wishlists and
          wallet once those features are added.
        </p>

        {user && (
          <div className="card-holo mt-2 max-w-md px-4 py-3 text-sm">
            <h2 className="mb-2 text-sm font-semibold text-cyan-200">
              Your account
            </h2>
            <dl className="space-y-1 text-sky-100/80">
              <div className="flex justify-between">
                <dt className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                  Email
                </dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                  Nickname
                </dt>
                <dd>{user.nickname}</dd>
              </div>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}


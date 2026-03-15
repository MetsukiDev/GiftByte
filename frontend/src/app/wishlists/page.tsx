"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyWishlists, type Wishlist } from "@/lib/wishlists";

export default function WishlistsPage() {
  const router = useRouter();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const data = await fetchMyWishlists(token);
        if (isMounted) {
          setWishlists(data);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your wishlists. Please try again.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">
          Loading your wishlists...
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
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
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
            className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
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
            onClick={() => router.push("/wallet")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Wallet
          </button>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-sky-50">My Wishlists</h1>
          <button
            type="button"
            onClick={() => router.push("/wishlists/create")}
            className="btn-cyber-primary rounded-full px-4 py-2 text-xs tracking-[0.18em]"
          >
            New Wishlist
          </button>
        </div>

        {wishlists.length === 0 ? (
          <div className="card-holo max-w-md border border-dashed border-cyan-400/60 px-4 py-6 text-sm text-sky-200/80">
            You don&apos;t have any wishlists yet. Create your first one for an
            upcoming celebration.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlists.map((wl) => (
              <button
                key={wl.id}
                type="button"
                onClick={() => router.push(`/wishlists/${wl.id}`)}
                className="card-holo card-holo-hover flex flex-col items-start border border-cyan-500/40 p-4 text-left text-sm text-sky-100/90"
              >
                <div className="mb-1 text-sm font-semibold text-zinc-900">
                  {wl.title}
                </div>
                {wl.description && (
                  <p className="mb-2 line-clamp-2 text-xs text-sky-200/70">
                    {wl.description}
                  </p>
                )}
                <div className="mt-auto flex w-full items-center justify-between text-xs text-sky-300/80">
                  <span>
                    {wl.event_date
                      ? new Date(wl.event_date).toLocaleDateString()
                      : "No event date"}
                  </span>
                  <span className="badge-neon">
                    {wl.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


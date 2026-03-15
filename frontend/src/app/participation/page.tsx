"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyParticipation, type ParticipationItem } from "@/lib/participation";

export default function ParticipationPage() {
  const router = useRouter();
  const [items, setItems] = useState<ParticipationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const data = await fetchMyParticipation(token);
        if (isMounted) setItems(data);
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : "Failed to load participation.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-4 py-3 text-sm">Loading your participation...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#02030a] text-sky-100">
      <aside className="flex h-screen w-60 flex-col border-r border-sky-900/70 bg-slate-950/70 px-4 py-6 shadow-[8px_0_32px_rgba(15,23,42,0.9)]">
        <div className="mb-6 px-2 text-lg font-semibold tracking-[0.18em] text-cyan-300">GIFTBYTE</div>
        <nav className="flex-1 space-y-1 text-xs">
          <button type="button" onClick={() => router.push("/dashboard")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Dashboard</button>
          <button type="button" onClick={() => router.push("/wishlists")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">My Wishlists</button>
          <button type="button" onClick={() => router.push("/wishlists/create")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Create Wishlist</button>
          <button type="button" className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]">Participation</button>
          <button type="button" onClick={() => router.push("/wallet")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Wallet</button>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-sky-50">Participation</h1>
        <p className="mb-6 text-xs text-sky-200/70">Gifts you have reserved or contributed to on friends&apos; wishlists.</p>

        {items.length === 0 ? (
          <div className="card-holo max-w-md border border-dashed border-cyan-400/60 px-4 py-6 text-sm text-sky-200/80">
            You haven&apos;t reserved or contributed to any gifts yet. Share a friend&apos;s wishlist link to get started.
          </div>
        ) : (
          <div className="max-w-2xl space-y-3">
            {items.map((item) => (
              <div
                key={`${item.participation_type}-${item.gift_id}`}
                className="card-holo flex flex-col gap-1 rounded-md border border-cyan-500/40 bg-slate-950/70 px-4 py-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-100 truncate">{item.gift_title}</span>
                  <div className="flex gap-1 shrink-0">
                    <span className="badge-neon">{item.participation_type}</span>
                    <span className="badge-neon">{item.gift_status}</span>
                  </div>
                </div>
                <span className="text-[11px] text-sky-300/70">
                  Wishlist: {item.wishlist_title}
                </span>
                {item.participation_type === "contributed" && item.amount != null && (
                  <span className="text-[11px] text-cyan-300/80">
                    Your total contribution: {Number(item.amount).toFixed(2)}
                  </span>
                )}
                {/* Only link when wishlist is still published and has a valid slug */}
                {item.wishlist_slug ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/public/${item.wishlist_slug}`)}
                    className="mt-1 self-start text-[10px] font-medium text-cyan-400 hover:text-cyan-200 underline-offset-2 hover:underline"
                  >
                    View wishlist
                  </button>
                ) : (
                  <span className="mt-1 text-[10px] text-sky-400/50">Wishlist no longer publicly available</span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

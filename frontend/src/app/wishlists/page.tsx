"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyWishlists, type Wishlist } from "@/lib/wishlists";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";

export default function WishlistsPage() {
  const router = useRouter();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const data = await fetchMyWishlists(token);
        if (isMounted) setWishlists(data);
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : "Failed to load your wishlists.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-5 py-3 text-sm tracking-wide">Loading wishlists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo max-w-md border border-rose-500/60 bg-rose-950/30 px-5 py-3 text-sm text-rose-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Sidebar active="/wishlists" />
      <main className="page-main">
        <div className="page-content">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="page-title">My Wishlists</h1>
              <p className="page-subtitle">All your celebration wishlists in one place.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/wishlists/create")}
              className="btn-cyber-primary shrink-0 px-4 py-2 text-xs tracking-[0.16em]"
            >
              + New Wishlist
            </button>
          </div>

          {wishlists.length === 0 ? (
            <div className="empty-state max-w-md">
              <span className="empty-state-icon">🎁</span>
              <p className="empty-state-title">No wishlists yet</p>
              <p className="empty-state-body">
                Create your first wishlist for an upcoming birthday, wedding, or any celebration.
              </p>
              <button
                type="button"
                onClick={() => router.push("/wishlists/create")}
                className="btn-cyber-primary mt-2 px-4 py-2 text-xs tracking-[0.16em]"
              >
                Create Wishlist
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlists.map((wl) => (
                <button
                  key={wl.id}
                  type="button"
                  onClick={() => router.push(`/wishlists/${wl.id}`)}
                  className="card-holo card-holo-hover flex flex-col items-start border border-cyan-500/25 p-4 text-left"
                >
                  <div className="mb-1.5 text-sm font-semibold text-sky-50 leading-snug">
                    {wl.title}
                  </div>
                  {wl.description && (
                    <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-sky-200/55">
                      {wl.description}
                    </p>
                  )}
                  <div className="mt-auto flex w-full items-center justify-between gap-2">
                    <span className="text-[10px] text-sky-300/50">
                      {wl.event_date
                        ? new Date(wl.event_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                        : "No event date"}
                    </span>
                    <StatusBadge status={wl.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyParticipation, type ParticipationItem } from "@/lib/participation";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";

export default function ParticipationPage() {
  const router = useRouter();
  const [items, setItems] = useState<ParticipationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const data = await fetchMyParticipation(token);
        if (isMounted) setItems(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load participation.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-6 py-4 text-sm">Loading your participation...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-6 py-4 text-sm text-rose-100">{error}</div>
    </div>
  );

  return (
    <div className="page-shell">
      <Sidebar active="/participation" />
      <main className="page-main">
        <div className="page-content">
          <h1 className="page-title">Participation</h1>
          <p className="page-subtitle">Gifts you have reserved or contributed to on friends&apos; wishlists.</p>

          <div className="mt-6">
            {items.length === 0 ? (
              <div className="empty-state">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="empty-state-icon" aria-hidden="true">
                  <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 28c0-5.523 4.477-9 10-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="23" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M23 20c4 0 7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="empty-state-title">No participation yet</p>
                <p className="empty-state-body">
                  You haven&apos;t reserved or contributed to any gifts yet. Share a friend&apos;s wishlist link to get started.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl space-y-3">
                {items.map((item) => {
                  const typeColor =
                    item.participation_type === "contributed"
                      ? "border-l-indigo-400/60"
                      : item.participation_type === "followed"
                      ? "border-l-cyan-400/60"
                      : "border-l-amber-400/60";
                  return (
                    <div
                      key={`${item.participation_type}-${item.gift_id}`}
                      className={`card-holo card-action flex flex-col gap-2 px-4 py-3 text-xs border-l-2 ${typeColor}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-sky-100 truncate">{item.gift_title}</span>
                        <div className="flex shrink-0 gap-1">
                          <StatusBadge status={item.participation_type} />
                          <StatusBadge status={item.gift_status} />
                        </div>
                      </div>
                      <span className="text-[11px] text-sky-300/60">
                        Wishlist: {item.wishlist_title}
                      </span>
                      {item.participation_type === "contributed" && item.amount != null && (
                        <span className="text-[11px] text-cyan-300/80">
                          Your total contribution: {Number(item.amount).toFixed(2)}
                        </span>
                      )}
                      {item.wishlist_slug ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/public/${item.wishlist_slug}`)}
                          className="mt-1 self-start text-[10px] font-medium text-cyan-400 underline-offset-2 hover:underline"
                        >
                          View wishlist ↗
                        </button>
                      ) : (
                        <span className="mt-1 text-[10px] text-sky-400/40">Wishlist no longer publicly available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

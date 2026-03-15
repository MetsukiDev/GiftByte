"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMyParticipation, type ParticipationItem } from "@/lib/participation";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";

const TYPE_META: Record<string, { label: string; borderClass: string; dotColor: string; desc: string }> = {
  followed: {
    label: "Following",
    borderClass: "card-action--cyan",
    dotColor: "bg-cyan-400",
    desc: "Saved wishlist",
  },
  reserved: {
    label: "Reserved",
    borderClass: "card-action--amber",
    dotColor: "bg-amber-400",
    desc: "Gift reserved by you",
  },
  contributed: {
    label: "Contributed",
    borderClass: "card-action--indigo",
    dotColor: "bg-indigo-400",
    desc: "Group gift contribution",
  },
};

export default function ParticipationPage() {
  const router = useRouter();
  const [items, setItems] = useState<ParticipationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "followed" | "reserved" | "contributed">("all");

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

  const followed = items.filter((i) => i.participation_type === "followed");
  const reserved = items.filter((i) => i.participation_type === "reserved");
  const contributed = items.filter((i) => i.participation_type === "contributed");

  const filtered = filter === "all" ? items : items.filter((i) => i.participation_type === filter);

  return (
    <div className="page-shell">
      <Sidebar active="/participation" />
      <main className="page-main">
        <div className="page-content">

          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-cyan-400/55 mb-1">
              GIFTBYTE // PARTICIPATION
            </p>
            <h1 className="page-title">Participation</h1>
            <p className="page-subtitle">Wishlists you follow and gifts you&apos;ve reserved or contributed to.</p>
          </div>

          {/* Summary strip */}
          {items.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-3 max-w-lg">
              {[
                { key: "followed", count: followed.length, label: "Following", color: "text-cyan-300" },
                { key: "reserved", count: reserved.length, label: "Reserved", color: "text-amber-300" },
                { key: "contributed", count: contributed.length, label: "Contributed", color: "text-indigo-300" },
              ].map(({ key, count, label, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(filter === key ? "all" : key as typeof filter)}
                  className={`card-holo card-action px-3 py-3 text-center transition-all ${
                    filter === key ? "border-opacity-80" : ""
                  } ${TYPE_META[key].borderClass}`}
                >
                  <p className={`text-xl font-bold ${color}`}>{count}</p>
                  <p className="text-[10px] text-sky-300/60 mt-0.5">{label}</p>
                </button>
              ))}
            </div>
          )}

          {/* Filter label */}
          {filter !== "all" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[11px] text-sky-300/60">Showing: {filter}</span>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="text-[10px] text-cyan-400 hover:underline underline-offset-2"
              >
                Clear filter
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state max-w-md">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="empty-state-icon" aria-hidden="true">
                <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 28c0-5.523 4.477-9 10-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="23" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M23 20c4 0 7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="empty-state-title">
                {filter === "all" ? "No participation yet" : `No ${filter} items`}
              </p>
              <p className="empty-state-body">
                {filter === "all"
                  ? "Open a friend's wishlist link to reserve gifts, contribute, or save it to your account."
                  : `You have no ${filter} items yet.`}
              </p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-3">
              {filtered.map((item, idx) => {
                const meta = TYPE_META[item.participation_type] ?? TYPE_META.followed;
                const key = `${item.participation_type}-${item.wishlist_id}-${item.gift_id ?? idx}`;
                return (
                  <div
                    key={key}
                    className={`card-holo card-action flex flex-col gap-2 px-4 py-3 text-xs ${meta.borderClass}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${meta.dotColor}`} />
                        <span className="text-sm font-semibold text-sky-100 truncate">
                          {item.participation_type === "followed"
                            ? item.wishlist_title
                            : item.gift_title ?? item.wishlist_title}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <StatusBadge status={item.participation_type} />
                        {item.gift_status && <StatusBadge status={item.gift_status} />}
                      </div>
                    </div>

                    <span className="text-[11px] text-sky-300/60 pl-3.5">
                      {item.participation_type === "followed"
                        ? "Saved wishlist"
                        : `Wishlist: ${item.wishlist_title}`}
                    </span>

                    {item.participation_type === "contributed" && item.amount != null && (
                      <span className="text-[11px] text-indigo-300/80 pl-3.5">
                        Your total contribution: {Number(item.amount).toFixed(2)}
                      </span>
                    )}

                    {item.wishlist_slug ? (
                      <button
                        type="button"
                        onClick={() => router.push(`/public/${item.wishlist_slug}`)}
                        className="mt-1 self-start pl-3.5 text-[10px] font-medium text-cyan-400 underline-offset-2 hover:underline"
                      >
                        View wishlist ↗
                      </button>
                    ) : (
                      <span className="mt-1 pl-3.5 text-[10px] text-sky-400/35">
                        Wishlist no longer publicly available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

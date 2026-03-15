"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchPublicWishlistBySlug,
  getFollowStatus,
  followWishlist,
  unfollowWishlist,
  type PublicWishlist,
} from "@/lib/public";
import {
  listGiftsForWishlist,
  reserveGift,
  contributeToGift,
  getFundingSummary,
  type Gift,
  type FundingSummary,
} from "@/lib/gifts";
import Footer from "@/components/Footer";

export default function PublicWishlistPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [fundingMap, setFundingMap] = useState<Record<string, FundingSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);
  // Per-gift action state
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<Record<string, string>>({});
  // Guest name inputs per gift
  const [guestNames, setGuestNames] = useState<Record<string, string>>({});
  // Contribution amount inputs per gift
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function loadFunding(giftList: Gift[]) {
    const groupGifts = giftList.filter((g) => g.gift_type === "group");
    const results = await Promise.allSettled(
      groupGifts.map((g) => getFundingSummary(g.id))
    );
    const map: Record<string, FundingSummary> = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled") map[groupGifts[i].id] = r.value;
    });
    setFundingMap(map);
  }

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!params?.slug) return;
      try {
        const wl = await fetchPublicWishlistBySlug(params.slug);
        const giftList = await listGiftsForWishlist(wl.id);
        const followStatus = await getFollowStatus(params.slug, authToken);
        if (isMounted) {
          setWishlist(wl);
          setGifts(giftList);
          setFollowing(followStatus.following);
          await loadFunding(giftList);
        }
      } catch (err) {
        if (isMounted)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this wishlist link."
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [params]);

  async function handleFollow() {
    if (!authToken) {
      router.push("/login");
      return;
    }
    setFollowLoading(true);
    setFollowError(null);
    try {
      if (following) {
        await unfollowWishlist(params!.slug, authToken);
        setFollowing(false);
      } else {
        await followWishlist(params!.slug, authToken);
        setFollowing(true);
      }
    } catch (err) {
      setFollowError(
        err instanceof Error ? err.message : "Follow action failed."
      );
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleReserve(gift: Gift) {
    setActionError((p) => ({ ...p, [gift.id]: "" }));
    setActionLoading((p) => ({ ...p, [gift.id]: true }));
    try {
      await reserveGift(gift.id, guestNames[gift.id] || undefined);
      setGifts((prev) =>
        prev.map((g) =>
          g.id === gift.id ? { ...g, status: "reserved" } : g
        )
      );
    } catch (err) {
      setActionError((p) => ({
        ...p,
        [gift.id]:
          err instanceof Error ? err.message : "Failed to reserve.",
      }));
    } finally {
      setActionLoading((p) => ({ ...p, [gift.id]: false }));
    }
  }

  async function handleContribute(gift: Gift) {
    const amount = parseFloat(amounts[gift.id] ?? "");
    if (!amount || amount <= 0) {
      setActionError((p) => ({ ...p, [gift.id]: "Enter a valid amount." }));
      return;
    }
    setActionError((p) => ({ ...p, [gift.id]: "" }));
    setActionLoading((p) => ({ ...p, [gift.id]: true }));
    try {
      await contributeToGift(gift.id, amount, guestNames[gift.id] || undefined);
      const summary = await getFundingSummary(gift.id);
      setFundingMap((p) => ({ ...p, [gift.id]: summary }));
      if (summary.progress != null && summary.progress >= 1) {
        setGifts((prev) =>
          prev.map((g) => (g.id === gift.id ? { ...g, status: "funded" } : g))
        );
      } else {
        setGifts((prev) =>
          prev.map((g) =>
            g.id === gift.id ? { ...g, status: "funding" } : g
          )
        );
      }
      setAmounts((p) => ({ ...p, [gift.id]: "" }));
    } catch (err) {
      setActionError((p) => ({
        ...p,
        [gift.id]:
          err instanceof Error ? err.message : "Failed to contribute.",
      }));
    } finally {
      setActionLoading((p) => ({ ...p, [gift.id]: false }));
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">
          Loading celebration wishlist...
        </div>
      </div>
    );

  if (error || !wishlist)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error ?? "Wishlist not found."}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#02030a] text-sky-100">
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 lg:flex-row">
          {/* Wishlist info */}
          <section className="card-holo flex-1 px-5 py-4 text-sm">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300">
              PUBLIC CELEBRATION
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-sky-50">
              {wishlist.title}
            </h1>
            {wishlist.event_date && (
              <p className="mt-1 text-xs text-sky-300/80">
                Event date:{" "}
                {new Date(wishlist.event_date).toLocaleDateString()}
              </p>
            )}
            {wishlist.description && (
              <p className="mt-3 max-w-2xl text-sm text-sky-100/80">
                {wishlist.description}
              </p>
            )}
            {wishlist.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wishlist.cover_image_url}
                alt={wishlist.title}
                className="mt-4 w-full max-h-48 object-cover rounded-md border border-cyan-400/40"
              />
            )}
            <span className="badge-neon mt-4 inline-flex">
              {wishlist.status}
            </span>

            {/* Follow / Unfollow */}
            <div className="mt-4">
              <button
                type="button"
                disabled={followLoading}
                onClick={handleFollow}
                className="btn-cyber-primary px-4 py-1.5 text-[11px] tracking-[0.15em] disabled:opacity-60"
              >
                {followLoading
                  ? "..."
                  : following
                  ? "Unfollow"
                  : "Follow Wishlist"}
              </button>
              {followError && (
                <p className="mt-1 text-[11px] text-rose-300">{followError}</p>
              )}
            </div>
          </section>

          {/* Gift list */}
          <section className="card-holo flex-[1.4] px-5 py-4 text-sm">
            <h2 className="mb-3 text-sm font-semibold text-sky-50">Gifts</h2>
            {gifts.length === 0 ? (
              <p className="text-xs text-sky-200/80">
                No gifts have been added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {gifts.map((gift) => {
                  const funding = fundingMap[gift.id];
                  const progress = funding?.progress ?? null;
                  const isBusy = actionLoading[gift.id] ?? false;
                  const errMsg = actionError[gift.id] ?? "";
                  const isReserved = gift.status === "reserved";
                  const isFunded = gift.status === "funded";

                  return (
                    <div
                      key={gift.id}
                      className="rounded-md border border-cyan-500/40 bg-slate-950/70 p-3 text-xs"
                    >
                      <div className="flex gap-3">
                        {gift.image_url && (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-cyan-400/60 bg-slate-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={gift.image_url}
                              alt={gift.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs font-semibold text-sky-100 truncate">
                              {gift.title}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <span className="badge-neon">{gift.gift_type}</span>
                              <span className="badge-neon">{gift.status}</span>
                            </div>
                          </div>
                          {gift.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-sky-200/80">
                              {gift.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[11px] text-sky-200/90">
                              {gift.price != null
                                ? `${gift.price} ${gift.currency ?? ""}`.trim()
                                : "No price set"}
                            </span>
                            {gift.product_url && (
                              <a
                                href={gift.product_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-zinc-800 underline-offset-2 hover:underline"
                              >
                                View product
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Group gift funding progress */}
                      {gift.gift_type === "group" && funding && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-sky-300/80 mb-0.5">
                            <span>
                              {Number(funding.total_contributed).toFixed(2)}{" "}
                              {funding.currency ?? ""} raised
                            </span>
                            {funding.target_amount != null && (
                              <span>
                                goal:{" "}
                                {Number(funding.target_amount).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {progress != null && (
                            <div className="h-1.5 w-full rounded-full bg-slate-700">
                              <div
                                className="h-1.5 rounded-full bg-cyan-400"
                                style={{
                                  width: `${Math.min(
                                    progress * 100,
                                    100
                                  ).toFixed(1)}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {errMsg && (
                        <p className="mt-2 text-[11px] text-rose-300">
                          {errMsg}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-3 space-y-2">
                        {gift.gift_type === "single" && !isReserved && (
                          <>
                            <input
                              type="text"
                              placeholder="Your name (optional)"
                              value={guestNames[gift.id] ?? ""}
                              onChange={(e) =>
                                setGuestNames((p) => ({
                                  ...p,
                                  [gift.id]: e.target.value,
                                }))
                              }
                              className="input-cyber w-full px-2 py-1 text-[11px]"
                            />
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleReserve(gift)}
                              className="btn-cyber-primary w-full py-1.5 text-[11px] tracking-[0.15em] disabled:opacity-60"
                            >
                              {isBusy ? "Reserving..." : "Reserve this gift"}
                            </button>
                          </>
                        )}
                        {gift.gift_type === "single" && isReserved && (
                          <p className="text-[11px] text-sky-300/70">
                            Someone has already reserved this gift.
                          </p>
                        )}

                        {gift.gift_type === "group" && !isFunded && (
                          <>
                            <input
                              type="text"
                              placeholder="Your name (optional)"
                              value={guestNames[gift.id] ?? ""}
                              onChange={(e) =>
                                setGuestNames((p) => ({
                                  ...p,
                                  [gift.id]: e.target.value,
                                }))
                              }
                              className="input-cyber w-full px-2 py-1 text-[11px]"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Amount"
                                value={amounts[gift.id] ?? ""}
                                onChange={(e) =>
                                  setAmounts((p) => ({
                                    ...p,
                                    [gift.id]: e.target.value,
                                  }))
                                }
                                className="input-cyber flex-1 px-2 py-1 text-[11px]"
                              />
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleContribute(gift)}
                                className="btn-cyber-primary px-3 py-1 text-[11px] tracking-[0.15em] disabled:opacity-60"
                              >
                                {isBusy ? "..." : "Contribute"}
                              </button>
                            </div>
                          </>
                        )}
                        {gift.gift_type === "group" && isFunded && (
                          <p className="text-[11px] text-cyan-300">
                            Fully funded — thank you to everyone who
                            contributed!
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

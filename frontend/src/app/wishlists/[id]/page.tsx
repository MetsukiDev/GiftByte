"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWishlistById, publishWishlist, deleteWishlist, type Wishlist } from "@/lib/wishlists";
import {
  createGiftForWishlist,
  listOwnerGifts,
  deleteGift,
  getFundingSummary,
  type Gift,
  type FundingSummary,
} from "@/lib/gifts";
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";

export default function WishlistDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [fundingMap, setFundingMap] = useState<Record<string, FundingSummary>>({});
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [giftType, setGiftType] = useState<"single" | "group">("single");

  function getToken() {
    return typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
  }

  async function loadFunding(giftList: Gift[]) {
    const groupGifts = giftList.filter((g) => g.gift_type === "group");
    const results = await Promise.allSettled(groupGifts.map((g) => getFundingSummary(g.id)));
    const map: Record<string, FundingSummary> = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled") map[groupGifts[i].id] = r.value;
    });
    setFundingMap(map);
  }

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const token = getToken();
      if (!token) { router.replace("/login"); return; }
      try {
        const [wishlistData, giftsData] = await Promise.all([
          fetchWishlistById(token, params.id),
          listOwnerGifts(token, params.id),
        ]);
        if (isMounted) {
          setWishlist(wishlistData);
          setGifts(giftsData);
          await loadFunding(giftsData);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load wishlist.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (params?.id) load();
    return () => { isMounted = false; };
  }, [params, router]);

  async function handlePublish() {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    setPublishing(true); setPublishError(null);
    try {
      const updated = await publishWishlist(token, params.id);
      setWishlist(updated);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to publish.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDeleteGift(giftId: string) {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    try {
      await deleteGift(token, giftId);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete gift.");
    }
  }

  function handleCopyLink() {
    if (!wishlist?.public_slug) return;
    const url = `${window.location.origin}/public/${wishlist.public_slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDeleteWishlist() {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    setDeleting(true); setDeleteError(null);
    try {
      await deleteWishlist(token, params.id);
      router.replace("/wishlists");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete wishlist.");
      setDeleting(false); setConfirmDelete(false);
    }
  }

  async function handleAddGift(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null); setAdding(true);
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    const priceValue = price.trim() ? Number(price) : null;
    try {
      const gift = await createGiftForWishlist(token, params.id, {
        title, description: description || undefined,
        product_url: productUrl || undefined, image_url: imageUrl || undefined,
        price: priceValue, currency: currency || undefined, gift_type: giftType,
      });
      const updated = [gift, ...gifts];
      setGifts(updated);
      await loadFunding(updated);
      setTitle(""); setDescription(""); setProductUrl(""); setImageUrl(""); setPrice(""); setCurrency(""); setGiftType("single");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add gift.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-5 py-3 text-sm tracking-wide">Loading wishlist...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo max-w-md border border-rose-500/60 bg-rose-950/30 px-5 py-3 text-sm text-rose-200">{error}</div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-5 py-3 text-sm">Wishlist not found.</div>
    </div>
  );

  const shareUrl = wishlist.public_slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/public/${wishlist.public_slug}`
    : null;

  return (
    <div className="page-shell">
      <Sidebar active="/wishlists" />
      <main className="page-main">
        <div className="page-content">

          {/* Header row */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="page-title">{wishlist.title}</h1>
                <StatusBadge status={wishlist.status} />
              </div>
              {wishlist.event_date && (
                <p className="text-[11px] text-sky-300/60">
                  Event: {new Date(wishlist.event_date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
              {wishlist.description && (
                <p className="mt-1 max-w-xl text-sm text-sky-100/70">{wishlist.description}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {wishlist.status === "draft" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="btn-cyber-primary px-4 py-2 text-xs tracking-[0.16em] disabled:opacity-70"
                >
                  {publishing ? "Publishing..." : "Publish & Share"}
                </button>
              )}
              {publishError && <p className="text-[11px] text-rose-300">{publishError}</p>}
              {deleteError && <p className="text-[11px] text-rose-300">{deleteError}</p>}
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="btn-cyber-danger px-3 py-1.5 text-[11px] tracking-[0.12em]"
                >
                  Delete wishlist
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-300">Are you sure?</span>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteWishlist}
                    className="btn-cyber-danger px-3 py-1 text-[11px] disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="btn-cyber-secondary px-3 py-1 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share link card */}
          {shareUrl && (
            <div className="mb-6 card-holo flex flex-wrap items-center gap-3 border border-cyan-400/30 px-5 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/70 shrink-0">Share link</span>
              <span className="flex-1 truncate text-xs text-sky-100/70 font-mono">{shareUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-cyber-primary shrink-0 px-4 py-1.5 text-[11px] tracking-[0.14em]"
              >
                {copied ? "✓ Copied" : "Copy link"}
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* Add gift form */}
            <div className="card-holo px-5 py-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">Add a gift</h2>
              {addError && (
                <div className="mb-3 rounded-lg border border-rose-500/60 bg-rose-950/30 px-3 py-2 text-xs text-rose-200">{addError}</div>
              )}
              <form className="space-y-3" onSubmit={handleAddGift}>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-cyan-300/70">Title *</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-cyber w-full px-3 py-2 text-sm" placeholder="e.g. Wireless headphones" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-cyan-300/70">Description</label>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="input-cyber w-full px-3 py-2 text-sm" placeholder="Optional details..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-cyan-300/70">Price</label>
                    <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-cyber w-full px-3 py-2 text-sm" placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-cyan-300/70">Currency</label>
                    <input placeholder="USD" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className="input-cyber w-full px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-cyan-300/70">Product URL</label>
                  <input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} className="input-cyber w-full px-3 py-2 text-sm" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-cyan-300/70">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-cyber w-full px-3 py-2 text-sm" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-cyan-300/70">Gift type</label>
                  <select value={giftType} onChange={(e) => setGiftType(e.target.value as "single" | "group")} className="input-cyber w-full px-3 py-2 text-sm">
                    <option value="single">Single — one person reserves</option>
                    <option value="group">Group — multiple people contribute</option>
                  </select>
                </div>
                <button type="submit" disabled={adding} className="btn-cyber-primary w-full py-2 text-xs tracking-[0.16em] disabled:opacity-70">
                  {adding ? "Adding..." : "Add gift"}
                </button>
              </form>
            </div>

            {/* Gift list */}
            <div className="card-holo px-5 py-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                Gifts <span className="text-sky-400/50">({gifts.length})</span>
              </h2>
              {gifts.length === 0 ? (
                <div className="empty-state py-10">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="empty-state-icon" aria-hidden="true">
                    <rect x="3" y="10" width="22" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M14 10V25" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M3 16h22" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M14 10c0 0-3.5-5 0-7s3.5 7 0 7z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M14 10c0 0 3.5-5 0-7s-3.5 7 0 7z" stroke="currentColor" strokeWidth="1.4"/>
                  </svg>
                  <p className="empty-state-title">No gifts yet</p>
                  <p className="empty-state-body">Add your first gift using the form on the left.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gifts.map((gift) => {
                    const funding = fundingMap[gift.id];
                    const progress = funding?.progress ?? null;
                    return (
                      <div key={gift.id} className="card-holo-hover flex gap-3 rounded-xl border border-cyan-500/25 bg-slate-950/60 p-3 transition-all">
                        {gift.image_url && (
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-cyan-400/40 bg-slate-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={gift.image_url} alt={gift.title} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-sky-100 leading-snug truncate">{gift.title}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <StatusBadge status={gift.gift_type} />
                              <StatusBadge status={gift.status} />
                            </div>
                          </div>
                          {gift.description && (
                            <p className="line-clamp-2 text-[11px] text-sky-200/55 mb-1">{gift.description}</p>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-sky-300/60">
                              {gift.price != null ? `${gift.price} ${gift.currency ?? ""}`.trim() : "No price set"}
                            </span>
                            {gift.product_url && (
                              <a href={gift.product_url} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400/70 hover:text-cyan-300 underline-offset-2 hover:underline transition-colors">
                                View product ↗
                              </a>
                            )}
                          </div>
                          {gift.gift_type === "group" && funding && (
                            <div className="mt-2">
                              <div className="flex justify-between text-[10px] text-sky-300/60 mb-1">
                                <span>{Number(funding.total_contributed).toFixed(2)} {funding.currency ?? ""} raised</span>
                                {funding.target_amount != null && (
                                  <span>goal: {Number(funding.target_amount).toFixed(2)}</span>
                                )}
                              </div>
                              {progress != null && (
                                <div className="progress-track h-1.5 w-full rounded-full">
                                  <div
                                    className="progress-bar-fill h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                                    style={{ width: `${Math.min(progress * 100, 100).toFixed(1)}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteGift(gift.id)}
                            className="mt-2 text-[10px] text-rose-400/70 hover:text-rose-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

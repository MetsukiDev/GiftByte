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
    setPublishing(true);
    setPublishError(null);
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
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteWishlist(token, params.id);
      router.replace("/wishlists");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete wishlist.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleAddGift(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    setAdding(true);
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
      <div className="card-holo px-4 py-3 text-sm">Loading wishlist...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">{error}</div>
    </div>
  );

  if (!wishlist) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-4 py-3 text-sm">Wishlist not found.</div>
    </div>
  );

  const shareUrl = wishlist.public_slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/public/${wishlist.public_slug}` : null;

  return (
    <div className="min-h-screen flex bg-[#02030a] text-sky-100">
      <aside className="flex h-screen w-60 flex-col border-r border-sky-900/70 bg-slate-950/70 px-4 py-6 shadow-[8px_0_32px_rgba(15,23,42,0.9)]">
        <div className="mb-6 px-2 text-lg font-semibold tracking-[0.18em] text-cyan-300">GIFTBYTE</div>
        <nav className="flex-1 space-y-1 text-xs">
          <button type="button" onClick={() => router.push("/dashboard")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Dashboard</button>
          <button type="button" onClick={() => router.push("/wishlists")} className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]">My Wishlists</button>
          <button type="button" onClick={() => router.push("/wishlists/create")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Create Wishlist</button>
          <button type="button" onClick={() => router.push("/participation")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Participation</button>
          <button type="button" onClick={() => router.push("/wallet")} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80">Wallet</button>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-10">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-sky-50">{wishlist.title}</h1>
            {wishlist.event_date && (
              <p className="text-xs text-sky-300/80">Event: {new Date(wishlist.event_date).toLocaleDateString()}</p>
            )}
            {wishlist.description && <p className="mt-1 max-w-xl text-sm text-sky-100/80">{wishlist.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="badge-neon">{wishlist.status}</span>
            {wishlist.status === "draft" && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="btn-cyber-primary px-3 py-1.5 text-xs tracking-[0.18em] disabled:opacity-70"
              >
                {publishing ? "Publishing..." : "Publish & Share"}
              </button>
            )}
            {publishError && <p className="text-xs text-rose-300">{publishError}</p>}
            {/* Delete wishlist */}
            {deleteError && <p className="text-xs text-rose-300">{deleteError}</p>}
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-[10px] text-rose-400 hover:text-rose-300 mt-1"
              >
                Delete wishlist
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-rose-300">Sure?</span>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteWishlist}
                  className="text-[10px] font-semibold text-rose-400 hover:text-rose-200 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-[10px] text-sky-400 hover:text-sky-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Share link */}
        {shareUrl && (
          <div className="mb-6 card-holo flex items-center gap-3 px-4 py-3 text-sm border border-cyan-400/40">
            <span className="text-xs text-cyan-300 shrink-0">Share link:</span>
            <span className="flex-1 truncate text-xs text-sky-100/80">{shareUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-cyber-primary shrink-0 px-3 py-1 text-[11px] tracking-[0.15em]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <section className="mt-2 max-w-2xl space-y-4">
          {/* Add gift form */}
          <div className="card-holo px-4 py-3 text-sm">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900">Add gift</h2>
            {addError && (
              <div className="mb-3 rounded-md border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">{addError}</div>
            )}
            <form className="space-y-3" onSubmit={handleAddGift}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium text-cyan-200">Title</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium text-cyan-200">Description</label>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">Product URL</label>
                  <input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">Price</label>
                  <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">Currency</label>
                  <input placeholder="USD, EUR..." value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className="input-cyber w-full px-3 py-1.5 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">Gift type</label>
                  <select value={giftType} onChange={(e) => setGiftType(e.target.value as "single" | "group")} className="input-cyber w-full px-3 py-1.5 text-sm">
                    <option value="single">Single gift</option>
                    <option value="group">Group gift</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={adding} className="btn-cyber-primary inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] disabled:opacity-70">
                {adding ? "Adding..." : "Add gift"}
              </button>
            </form>
          </div>

          {/* Gift list */}
          <div className="card-holo px-4 py-3 text-sm">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900">Gifts ({gifts.length})</h2>
            {gifts.length === 0 ? (
              <p className="text-xs text-sky-200/80">No gifts yet. Add your first gift above.</p>
            ) : (
              <div className="space-y-3">
                {gifts.map((gift) => {
                  const funding = fundingMap[gift.id];
                  const progress = funding?.progress ?? null;
                  return (
                    <div key={gift.id} className="card-holo-hover flex gap-3 rounded-md border border-cyan-500/40 bg-slate-950/70 p-2 text-xs">
                      {gift.image_url && (
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-cyan-400/60 bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={gift.image_url} alt={gift.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-semibold text-sky-100 truncate">{gift.title}</div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="badge-neon">{gift.gift_type}</span>
                            <span className="badge-neon">{gift.status}</span>
                          </div>
                        </div>
                        {gift.description && <p className="mt-1 line-clamp-2 text-[11px] text-sky-200/80">{gift.description}</p>}
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-[11px] text-sky-200/90">
                            {gift.price != null ? `${gift.price} ${gift.currency ?? ""}`.trim() : "No price set"}
                          </div>
                          {gift.product_url && (
                            <a href={gift.product_url} target="_blank" rel="noreferrer" className="text-[10px] text-zinc-800 underline-offset-2 hover:underline">View product</a>
                          )}
                        </div>
                        {/* Funding progress for group gifts — owner sees amounts, not identities */}
                        {gift.gift_type === "group" && funding && (
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-sky-300/80 mb-0.5">
                              <span>{Number(funding.total_contributed).toFixed(2)} {funding.currency ?? ""} raised</span>
                              {funding.target_amount != null && <span>goal: {Number(funding.target_amount).toFixed(2)}</span>}
                            </div>
                            {progress != null && (
                              <div className="h-1.5 w-full rounded-full bg-slate-700">
                                <div
                                  className="h-1.5 rounded-full bg-cyan-400"
                                  style={{ width: `${Math.min(progress * 100, 100).toFixed(1)}%` }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteGift(gift.id)}
                          className="mt-2 text-[10px] text-rose-400 hover:text-rose-300"
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
        </section>
      </main>
    </div>
  );
}

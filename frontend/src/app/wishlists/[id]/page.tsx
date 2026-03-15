"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWishlistById, type Wishlist } from "@/lib/wishlists";
import {
  createGiftForWishlist,
  listGiftsForWishlist,
  type Gift,
} from "@/lib/gifts";

export default function WishlistDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [giftsLoading, setGiftsLoading] = useState(true);
  const [giftsError, setGiftsError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [giftType, setGiftType] = useState<"single" | "group">("single");

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
        const [wishlistData, giftsData] = await Promise.all([
          fetchWishlistById(token, params.id),
          listGiftsForWishlist(params.id),
        ]);
        if (isMounted) {
          setWishlist(wishlistData);
          setGifts(giftsData);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load wishlist. Please try again.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setGiftsLoading(false);
        }
      }
    }

    if (params?.id) {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">Loading wishlist...</div>
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

  if (!wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">Wishlist not found.</div>
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
            onClick={() => router.push("/wishlists")}
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
          <div>
            <h1 className="text-2xl font-semibold text-sky-50">
              {wishlist.title}
            </h1>
            {wishlist.event_date && (
              <p className="text-xs text-sky-300/80">
                Event date:{" "}
                {new Date(wishlist.event_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <span className="badge-neon">
            {wishlist.status}
          </span>
        </div>

        {wishlist.description && (
          <p className="mb-4 max-w-2xl text-sm text-sky-100/80">
            {wishlist.description}
          </p>
        )}

        <section className="mt-6 max-w-2xl space-y-4">
          <div className="card-holo px-4 py-3 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Add gift</h2>
            </div>
            {addError && (
              <div className="mb-3 rounded-md border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
                {addError}
              </div>
            )}
            <form
              className="space-y-3"
              onSubmit={async (e: FormEvent) => {
                e.preventDefault();
                setAddError(null);
                setAdding(true);

                const token =
                  typeof window !== "undefined"
                    ? window.localStorage.getItem("access_token")
                    : null;

                if (!token) {
                  router.replace("/login");
                  return;
                }

                let priceValue: number | null = null;
                if (price.trim()) {
                  const parsed = Number(price);
                  if (!Number.isNaN(parsed)) {
                    priceValue = parsed;
                  }
                }

                try {
                  const gift = await createGiftForWishlist(token, params.id, {
                    title,
                    description: description || undefined,
                    product_url: productUrl || undefined,
                    image_url: imageUrl || undefined,
                    price: priceValue,
                    currency: currency || undefined,
                    gift_type: giftType,
                  });
                  setGifts((prev) => [gift, ...prev]);
                  setTitle("");
                  setDescription("");
                  setProductUrl("");
                  setImageUrl("");
                  setPrice("");
                  setCurrency("");
                  setGiftType("single");
                } catch (err) {
                  const message =
                    err instanceof Error
                      ? err.message
                      : "Failed to add gift. Please try again.";
                  setAddError(message);
                } finally {
                  setAdding(false);
                }
              }}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium text-cyan-200">
                    Title
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium text-cyan-200">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">
                    Product URL
                  </label>
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">
                    Currency
                  </label>
                  <input
                    placeholder="USD, EUR..."
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-cyan-200">
                    Gift type
                  </label>
                  <select
                    value={giftType}
                    onChange={(e) =>
                      setGiftType(e.target.value as "single" | "group")
                    }
                    className="input-cyber w-full px-3 py-1.5 text-sm"
                  >
                    <option value="single">Single gift</option>
                    <option value="group">Group gift</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={adding}
                className="btn-cyber-primary inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {adding ? "Adding..." : "Add gift"}
              </button>
            </form>
          </div>

          <div className="card-holo px-4 py-3 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Gifts</h2>
            </div>
            {giftsLoading ? (
              <p className="text-xs text-sky-200/80">Loading gifts...</p>
            ) : giftsError ? (
              <p className="text-xs text-rose-200">{giftsError}</p>
            ) : gifts.length === 0 ? (
              <p className="text-xs text-sky-200/80">
                No gifts yet. Add your first gift using the form above.
              </p>
            ) : (
              <div className="space-y-3">
                {gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="card-holo-hover flex gap-3 rounded-md border border-cyan-500/40 bg-slate-950/70 p-2 text-xs"
                  >
                    {gift.image_url && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-cyan-400/60 bg-slate-900 shadow-[0_0_18px_rgba(56,189,248,0.55)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={gift.image_url}
                          alt={gift.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-sky-100">
                          {gift.title}
                        </div>
                        <span className="badge-neon">
                          {gift.gift_type}
                        </span>
                      </div>
                      {gift.description && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-sky-200/80">
                          {gift.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-[11px] text-sky-200/90">
                          {gift.price != null
                            ? `${gift.price} ${gift.currency ?? ""}`.trim()
                            : "No price set"}
                        </div>
                        <span className="badge-neon">
                          {gift.status}
                        </span>
                      </div>
                      {gift.product_url && (
                        <a
                          href={gift.product_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex text-[10px] font-medium text-zinc-800 underline-offset-2 hover:underline"
                        >
                          View product
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


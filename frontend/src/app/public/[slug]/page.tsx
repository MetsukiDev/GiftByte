"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPublicWishlistBySlug, type PublicWishlist } from "@/lib/public";
import { listGiftsForWishlist, type Gift } from "@/lib/gifts";

export default function PublicWishlistPage() {
  const params = useParams<{ slug: string }>();
  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!params?.slug) return;
      try {
        const wl = await fetchPublicWishlistBySlug(params.slug);
        const giftList = await listGiftsForWishlist(wl.id);
        if (isMounted) {
          setWishlist(wl);
          setGifts(giftList);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load this wishlist link.";
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
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">
          Loading celebration wishlist...
        </div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error ?? "Wishlist not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02030a] px-4 py-6 text-sky-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 lg:flex-row">
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
          <span className="badge-neon mt-4 inline-flex">
            {wishlist.status}
          </span>
        </section>

        <section className="card-holo flex-[1.4] px-5 py-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-sky-50">Gifts</h2>
          </div>
          {gifts.length === 0 ? (
            <p className="text-xs text-sky-200/80">
              No gifts have been added yet.
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
                      <span className="badge-neon">{gift.gift_type}</span>
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
                      <span className="badge-neon">{gift.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


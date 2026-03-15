"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createWishlist } from "@/lib/wishlists";

export default function CreateWishlistPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const wl = await createWishlist(token, {
        title,
        description: description || undefined,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        cover_image_url: coverImageUrl || undefined,
      });
      router.replace(`/wishlists/${wl.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create wishlist.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            My Wishlists
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
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
        <h1 className="mb-4 text-2xl font-semibold text-sky-50">
          Create Wishlist
        </h1>

        {error && (
          <div className="mb-4 card-holo border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="card-holo max-w-lg space-y-4 px-4 py-4 text-sm"
        >
          <div className="space-y-1">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-cyan-200"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-cyber w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-cyan-200"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-cyber w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="eventDate"
              className="block text-sm font-medium text-cyan-200"
            >
              Event date
            </label>
            <input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="input-cyber w-full px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="coverImageUrl"
              className="block text-sm font-medium text-cyan-200"
            >
              Cover image URL (optional)
            </label>
            <input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="input-cyber w-full px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber-primary inline-flex items-center justify-center px-4 py-2 text-xs font-medium tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create wishlist"}
          </button>
        </form>
      </main>
    </div>
  );
}


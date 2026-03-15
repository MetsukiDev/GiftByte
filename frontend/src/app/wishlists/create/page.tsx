"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWishlist } from "@/lib/wishlists";
import Sidebar from "@/components/Sidebar";

export default function CreateWishlistPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
    if (!token) { router.replace("/login"); return; }
    try {
      const wl = await createWishlist(token, {
        title,
        description: description || undefined,
        event_date: eventDate ? new Date(eventDate).toISOString() : null,
        cover_image_url: coverImageUrl || undefined,
      });
      router.replace(`/wishlists/${wl.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wishlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <Sidebar active="/wishlists/create" />
      <main className="page-main">
        <div className="page-content">
          <h1 className="page-title">Create Wishlist</h1>
          <p className="page-subtitle">Set up a new celebration wishlist to share with friends.</p>

          {error && (
            <div className="mt-4 rounded-md border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 card-holo max-w-lg space-y-4 px-5 py-5 text-sm">
            <div className="space-y-1">
              <label htmlFor="title" className="block text-xs font-medium text-cyan-200">Title</label>
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
              <label htmlFor="description" className="block text-xs font-medium text-cyan-200">Description</label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-cyber w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="eventDate" className="block text-xs font-medium text-cyan-200">Event date</label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="input-cyber w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="coverImageUrl" className="block text-xs font-medium text-cyan-200">
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
              className="btn-cyber-primary px-5 py-2 text-xs tracking-[0.18em] disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create wishlist"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

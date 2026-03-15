const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. Public API requests will fail.");
}

export type PublicWishlist = {
  id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  cover_image_url?: string | null;
  status: string;
  created_at: string;
};

export async function fetchPublicWishlistBySlug(
  slug: string,
): Promise<PublicWishlist> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/public/${slug}`);

  if (!res.ok) {
    let message = "Wishlist not found.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}


function authHeader(token: string | null) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function getFollowStatus(
  slug: string,
  token: string | null,
): Promise<{ following: boolean }> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/public/${slug}/follow-status`, {
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) return { following: false };
  return res.json();
}

export async function followWishlist(slug: string, token: string): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/public/${slug}/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = "Failed to follow wishlist.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}

export async function unfollowWishlist(slug: string, token: string): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/public/${slug}/follow`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = "Failed to unfollow wishlist.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}

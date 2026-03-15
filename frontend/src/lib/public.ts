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


import { User } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. Wishlist API requests will fail.");
}

export type Wishlist = {
  id: string;
  owner_id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  is_public: boolean;
  public_slug?: string | null;
  cover_image_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type WishlistCreateInput = {
  title: string;
  description?: string;
  event_date?: string | null;
  cover_image_url?: string | null;
};

function getAuthHeader(token: string | null) {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchMyWishlists(token: string | null): Promise<Wishlist[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wishlists/me`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token),
    },
  });

  if (!res.ok) {
    let message = "Failed to load wishlists.";
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

export async function createWishlist(
  token: string | null,
  input: WishlistCreateInput,
): Promise<Wishlist> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const body: any = {
    title: input.title,
    description: input.description ?? null,
    event_date: input.event_date ?? null,
    cover_image_url: input.cover_image_url ?? null,
  };

  const res = await fetch(`${API_URL}/wishlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Failed to create wishlist.";
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

export async function fetchWishlistById(
  token: string | null,
  id: string,
): Promise<Wishlist> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wishlists/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token),
    },
  });

  if (!res.ok) {
    let message = "Failed to load wishlist.";
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

export type WishlistUpdateInput = {
  title?: string;
  description?: string | null;
  event_date?: string | null;
  cover_image_url?: string | null;
  status?: string;
};

export async function updateWishlist(
  token: string | null,
  id: string,
  input: WishlistUpdateInput,
): Promise<Wishlist> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/wishlists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader(token) },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let message = "Failed to update wishlist.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function publishWishlist(
  token: string | null,
  id: string,
): Promise<Wishlist> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/wishlists/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader(token) },
  });
  if (!res.ok) {
    let message = "Failed to publish wishlist.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function deleteWishlist(
  token: string | null,
  id: string,
): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/wishlists/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeader(token) },
  });
  if (!res.ok) {
    let message = "Failed to delete wishlist.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}


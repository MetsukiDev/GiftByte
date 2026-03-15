const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. Gift API requests will fail.");
}

export type Gift = {
  id: string;
  title: string;
  description?: string | null;
  product_url?: string | null;
  image_url?: string | null;
  price?: number | null;
  currency?: string | null;
  gift_type: string;
  status: string;
  created_at: string;
};

export type GiftCreateInput = {
  title: string;
  description?: string;
  product_url?: string;
  image_url?: string;
  price?: number | null;
  currency?: string | null;
  gift_type: "single" | "group";
};

function authHeader(token: string | null) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function listGiftsForWishlist(
  wishlistId: string,
): Promise<Gift[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wishlists/${wishlistId}/gifts`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = "Failed to load gifts.";
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

export async function createGiftForWishlist(
  token: string | null,
  wishlistId: string,
  input: GiftCreateInput,
): Promise<Gift> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const body: any = {
    title: input.title,
    description: input.description ?? null,
    product_url: input.product_url ?? null,
    image_url: input.image_url ?? null,
    price: input.price ?? null,
    currency: input.currency ?? null,
    gift_type: input.gift_type,
  };

  const res = await fetch(`${API_URL}/wishlists/${wishlistId}/gifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Failed to add gift.";
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

export async function listOwnerGifts(
  token: string | null,
  wishlistId: string,
): Promise<Gift[]> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/wishlists/${wishlistId}/gifts/owner`, {
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) {
    let message = "Failed to load gifts.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function deleteGift(
  token: string | null,
  giftId: string,
): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/gifts/${giftId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) {
    let message = "Failed to delete gift.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}

export async function reserveGift(
  giftId: string,
  guestName?: string,
): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/public/gifts/${giftId}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guest_name: guestName ?? null }),
  });
  if (!res.ok) {
    let message = "Failed to reserve gift.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}

export async function contributeToGift(
  giftId: string,
  amount: number,
  guestName?: string,
): Promise<void> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/public/gifts/${giftId}/contribute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, guest_name: guestName ?? null }),
  });
  if (!res.ok) {
    let message = "Failed to contribute.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
}

export type FundingSummary = {
  gift_id: string;
  total_contributed: number;
  target_amount?: number | null;
  progress?: number | null;
  currency?: string | null;
};

export async function getFundingSummary(giftId: string): Promise<FundingSummary> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/gifts/${giftId}/funding-summary`);
  if (!res.ok) {
    let message = "Failed to load funding summary.";
    try { const d = await res.json(); if (typeof d?.detail === "string") message = d.detail; } catch {}
    throw new Error(message);
  }
  return res.json();
}


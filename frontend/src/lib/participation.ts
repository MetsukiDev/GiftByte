const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. Participation API requests will fail.");
}

export type ParticipationItem = {
  wishlist_id: string;
  wishlist_title: string;
  wishlist_slug: string | null;
  gift_id: string;
  gift_title: string;
  gift_status: string;
  participation_type: "reserved" | "contributed";
  amount?: number | null;
};

export async function fetchMyParticipation(
  token: string | null,
): Promise<ParticipationItem[]> {
  if (!API_URL) throw new Error("API URL is not configured.");
  const res = await fetch(`${API_URL}/participation/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    let message = "Failed to load participation.";
    try {
      const d = await res.json();
      if (typeof d?.detail === "string") message = d.detail;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

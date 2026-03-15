const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. User API requests will fail.");
}

export type UserMe = {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string | null;
  payout_method?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserUpdateInput = {
  nickname?: string;
  avatar_url?: string | null;
  payout_method?: string | null;
};

function authHeader(token: string | null) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchCurrentUserProfile(
  token: string | null,
): Promise<UserMe> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
  });

  if (!res.ok) {
    let message = "Failed to load profile.";
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

export async function updateCurrentUserProfile(
  token: string | null,
  payload: UserUpdateInput,
): Promise<UserMe> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Failed to update profile.";
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


export type User = {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string | null;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // This will help catch misconfiguration early without crashing the app
  console.warn("NEXT_PUBLIC_API_URL is not set. API requests will fail.");
}

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Failed to login. Please check your credentials.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors and use default message
    }
    throw new Error(message);
  }

  return res.json();
}

export async function registerRequest(params: {
  email: string;
  password: string;
  nickname: string;
}): Promise<User> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let message = "Failed to register. Please try again.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors and use default message
    }
    throw new Error(message);
  }

  return res.json();
}

export async function fetchCurrentUser(token: string): Promise<User> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to load user information.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors and use default message
    }
    throw new Error(message);
  }

  return res.json();
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. Wallet API requests will fail.");
}

export type Wallet = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  wallet_id: string;
  type: string;
  amount: number;
  status: string;
  metadata_json?: string | null;
  created_at: string;
};

function authHeader(token: string | null) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMyWallet(token: string | null): Promise<Wallet> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wallet/me`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
  });

  if (!res.ok) {
    let message = "Failed to load wallet.";
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

export async function fetchMyTransactions(
  token: string | null,
): Promise<Transaction[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wallet/me/transactions`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
  });

  if (!res.ok) {
    let message = "Failed to load transactions.";
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

export async function mockTopup(
  token: string | null,
  amount: number,
  currency: string,
): Promise<Transaction> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(`${API_URL}/wallet/mock-topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ amount, currency }),
  });

  if (!res.ok) {
    let message = "Failed to top up wallet.";
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


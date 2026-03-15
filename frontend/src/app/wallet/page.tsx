"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchMyTransactions,
  fetchMyWallet,
  mockTopup,
  type Transaction,
  type Wallet,
} from "@/lib/wallet";

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [topupCurrency, setTopupCurrency] = useState("USD");
  const [topupLoading, setTopupLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [w, txs] = await Promise.all([
          fetchMyWallet(token),
          fetchMyTransactions(token),
        ]);
        if (isMounted) {
          setWallet(w);
          setTransactions(txs);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load wallet. Please try again.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleTopup() {
    setError(null);
    setTopupLoading(true);

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    const amount = Number(topupAmount);
    if (!amount || amount <= 0) {
      setError("Enter a positive amount to top up.");
      setTopupLoading(false);
      return;
    }

    try {
      const tx = await mockTopup(token, amount, topupCurrency || "USD");
      const w = await fetchMyWallet(token);
      setWallet(w);
      setTransactions((prev) => [tx, ...prev]);
      setTopupAmount("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to top up wallet.";
      setError(message);
    } finally {
      setTopupLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">
          Loading wallet console...
        </div>
      </div>
    );
  }

  if (error && !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      </div>
    );
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
            onClick={() => router.push("/profile")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Profile
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
            onClick={() => router.push("/wishlists/create")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Create Wishlist
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
          >
            Wallet
          </button>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-sky-50">
          Celebration Wallet
        </h1>

        {wallet && (
          <section className="card-holo mb-6 max-w-md px-4 py-4 text-sm">
            <h2 className="mb-2 text-sm font-semibold text-cyan-200">
              Balance
            </h2>
            <p className="text-2xl font-semibold text-sky-50">
              {wallet.balance}{" "}
              <span className="text-sm font-normal text-sky-300/80">
                {wallet.currency}
              </span>
            </p>
          </section>
        )}

        <section className="card-holo mb-6 max-w-md px-4 py-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold text-cyan-200">
            Mock top-up
          </h2>
          {error && (
            <div className="mb-3 rounded-md border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="input-cyber w-full px-3 py-2 text-sm"
              placeholder="Amount"
            />
            <input
              value={topupCurrency}
              onChange={(e) => setTopupCurrency(e.target.value.toUpperCase())}
              className="input-cyber w-24 px-2 py-2 text-sm"
              placeholder="CUR"
            />
            <button
              type="button"
              disabled={topupLoading}
              onClick={handleTopup}
              className="btn-cyber-primary inline-flex items-center justify-center px-3 py-2 text-[11px] font-medium tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {topupLoading ? "TOPPING..." : "TOP UP"}
            </button>
          </div>
        </section>

        <section className="card-holo max-w-3xl px-4 py-4 text-sm">
          <h2 className="mb-2 text-sm font-semibold text-cyan-200">
            Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-xs text-sky-200/80">
              No wallet activity yet.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-md border border-slate-700/70 bg-slate-950/80 px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-sky-50">
                      {tx.type} • {tx.amount}{" "}
                      <span className="text-[10px] text-sky-300/80">
                        {wallet?.currency}
                      </span>
                    </p>
                    <p className="text-[10px] text-sky-300/80">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="badge-neon">{tx.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}


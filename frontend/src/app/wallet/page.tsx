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
import Sidebar from "@/components/Sidebar";
import StatusBadge from "@/components/StatusBadge";

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
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const [w, txs] = await Promise.all([fetchMyWallet(token), fetchMyTransactions(token)]);
        if (isMounted) { setWallet(w); setTransactions(txs); }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Unable to load wallet.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [router]);

  async function handleTopup() {
    setError(null);
    setTopupLoading(true);
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
    if (!token) { router.replace("/login"); return; }
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
      setError(err instanceof Error ? err.message : "Failed to top up wallet.");
    } finally {
      setTopupLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-6 py-4 text-sm">Loading wallet console...</div>
    </div>
  );

  if (error && !wallet) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-6 py-4 text-sm text-rose-100">{error}</div>
    </div>
  );

  return (
    <div className="page-shell">
      <Sidebar active="/wallet" />
      <main className="page-main">
        <div className="page-content">
          <h1 className="page-title">Celebration Wallet</h1>
          <p className="page-subtitle">Manage your balance and transaction history.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-2xl">
            {/* Balance */}
            {wallet && (
              <div className="card-holo px-5 py-4">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-cyan-300/80">BALANCE</p>
                <p className="mt-2 text-3xl font-semibold text-sky-50">
                  {wallet.balance}
                  <span className="ml-2 text-sm font-normal text-sky-300/70">{wallet.currency}</span>
                </p>
              </div>
            )}

            {/* Top-up */}
            <div className="card-holo px-5 py-4">
              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/80">MOCK TOP-UP</p>
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
                  className="input-cyber flex-1 px-3 py-2 text-sm"
                  placeholder="Amount"
                />
                <input
                  value={topupCurrency}
                  onChange={(e) => setTopupCurrency(e.target.value.toUpperCase())}
                  className="input-cyber w-20 px-2 py-2 text-sm"
                  placeholder="CUR"
                />
                <button
                  type="button"
                  disabled={topupLoading}
                  onClick={handleTopup}
                  className="btn-cyber-primary px-3 py-2 text-[11px] tracking-[0.15em] disabled:opacity-70"
                >
                  {topupLoading ? "..." : "TOP UP"}
                </button>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mt-6 max-w-2xl">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/80">TRANSACTIONS</p>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">💳</span>
                <p className="empty-state-title">No transactions yet</p>
                <p className="empty-state-body">Top up your wallet or contribute to a gift to see activity here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-holo flex items-center justify-between px-4 py-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-sky-50">
                        {tx.type} &bull; {tx.amount}{" "}
                        <span className="text-[10px] font-normal text-sky-300/70">{wallet?.currency}</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-sky-300/60">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={tx.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

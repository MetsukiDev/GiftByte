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
      setTopupCurrency("USD");
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

          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-cyan-400/55 mb-1">
              GIFTBYTE // WALLET
            </p>
            <h1 className="page-title">Celebration Wallet</h1>
            <p className="page-subtitle">Manage your balance and transaction history.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mb-6">
            {/* Balance */}
            {wallet && (
              <div className="card-holo card-action card-action--cyan px-5 py-5">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-cyan-300/70 mb-2">BALANCE</p>
                <p className="text-4xl font-bold text-sky-50 tracking-tight">
                  {Number(wallet.balance).toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-sky-300/60">{wallet.currency}</p>
              </div>
            )}

            {/* Top-up */}
            <div className="card-holo px-5 py-5">
              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/70">MOCK TOP-UP</p>
              {error && (
                <div className="mb-3 rounded-md border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
                  {error}
                </div>
              )}
              <div className="space-y-2">
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
                    className="input-cyber w-20 px-2 py-2 text-sm text-center"
                    placeholder="USD"
                    maxLength={5}
                  />
                </div>
                <button
                  type="button"
                  disabled={topupLoading}
                  onClick={handleTopup}
                  className="btn-cyber-primary w-full py-2 text-xs tracking-[0.18em] disabled:opacity-70"
                >
                  {topupLoading ? "Processing..." : "Top up wallet"}
                </button>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="max-w-2xl">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/70">
              TRANSACTION HISTORY
              {transactions.length > 0 && (
                <span className="ml-2 text-sky-400/40">({transactions.length})</span>
              )}
            </p>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="empty-state-icon" aria-hidden="true">
                  <rect x="3" y="7" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 13h26" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="22" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="empty-state-title">No transactions yet</p>
                <p className="empty-state-body">Top up your wallet or contribute to a gift to see activity here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-holo flex items-center justify-between gap-4 px-4 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sky-50 capitalize">{tx.type}</p>
                        <p className="text-[10px] text-sky-300/55">
                          {new Date(tx.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-emerald-300">
                        +{Number(tx.amount).toFixed(2)}
                        <span className="ml-1 text-[10px] font-normal text-sky-300/60">{wallet?.currency}</span>
                      </span>
                      <StatusBadge status={tx.status} />
                    </div>
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

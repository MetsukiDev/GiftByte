"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { fetchCurrentUser, type User } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

// Minimal cyber SVG icons
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <line x1="5" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="2" cy="5" r="1" fill="currentColor" />
    <circle cx="2" cy="9" r="1" fill="currentColor" />
    <circle cx="2" cy="13" r="1" fill="currentColor" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 16c0-3.314 2.686-5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="13" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M13 12c2.5 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconWallet = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1" y="5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 8h16" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="13.5" cy="11.5" r="1.5" fill="currentColor" />
    <path d="M4 3h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 17c0-3.866 3.134-6 7-6s7 2.134 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <line x1="9" y1="5" x2="9" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

type QuickAction = {
  label: string;
  desc: string;
  href: string;
  Icon: () => React.ReactElement;
  accentColor: string;
  cardAccent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "New Wishlist",
    desc: "Create a wishlist for your next celebration.",
    href: "/wishlists/create",
    Icon: IconPlus,
    accentColor: "text-cyan-300",
    cardAccent: "card-action--cyan",
  },
  {
    label: "My Wishlists",
    desc: "View and manage all your wishlists.",
    href: "/wishlists",
    Icon: IconList,
    accentColor: "text-indigo-300",
    cardAccent: "card-action--indigo",
  },
  {
    label: "Participation",
    desc: "Gifts you've reserved or contributed to.",
    href: "/participation",
    Icon: IconUsers,
    accentColor: "text-fuchsia-300",
    cardAccent: "card-action--fuchsia",
  },
  {
    label: "Wallet",
    desc: "Check your balance and transactions.",
    href: "/wallet",
    Icon: IconWallet,
    accentColor: "text-emerald-300",
    cardAccent: "card-action--emerald",
  },
  {
    label: "Profile",
    desc: "Update your nickname, avatar, and payout info.",
    href: "/profile",
    Icon: IconPerson,
    accentColor: "text-sky-300",
    cardAccent: "card-action--sky",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      const token =
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const currentUser = await fetchCurrentUser(token);
        if (isMounted) setUser(currentUser);
      } catch {
        if (typeof window !== "undefined") window.localStorage.removeItem("access_token");
        if (isMounted) router.replace("/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUser();
    return () => { isMounted = false; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-5 py-3 text-sm tracking-wide">Initializing console...</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Sidebar active="/dashboard" />
      <main className="page-main">
        <div className="page-content">

          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-cyan-400/55 mb-1">
              GIFTBYTE // CONTROL CENTER
            </p>
            <h1 className="page-title">
              {user ? `Welcome back, ${user.nickname}` : "Welcome to GiftByte"}
            </h1>
            <p className="page-subtitle">
              Your celebration hub. Create wishlists, share them with friends, and track gifts.
            </p>
          </div>

          {/* Quick action grid */}
          <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label + action.href}
                type="button"
                onClick={() => router.push(action.href)}
                className={`card-holo card-action ${action.cardAccent} group flex flex-col gap-3 border border-slate-700/50 px-5 py-4 text-left`}
              >
                <div className={`${action.accentColor} transition-colors`}>
                  <action.Icon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-sky-100 tracking-wide">{action.label}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-sky-200/45">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom row: account + quick tips */}
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
            {/* Account panel */}
            {user && (
              <div className="card-holo px-5 py-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400/55">
                  Account
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900 text-sm font-bold text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.3)]">
                    {user.nickname?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <dl className="space-y-0.5 text-xs min-w-0">
                    <div className="flex gap-2">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/50 w-14 shrink-0">Handle</dt>
                      <dd className="text-sky-100 truncate">{user.nickname}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/50 w-14 shrink-0">Email</dt>
                      <dd className="text-sky-100/70 truncate">{user.email}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Quick tips */}
            <div className="card-holo px-5 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400/55">
                Quick start
              </p>
              <ol className="space-y-2 text-[11px] text-sky-200/55 list-none">
                {[
                  "Create a wishlist for your celebration",
                  "Add gifts — single or group-funded",
                  "Publish and share the link with friends",
                  "Track reservations and contributions",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 text-[10px] font-bold text-cyan-400/40 mt-0.5">{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

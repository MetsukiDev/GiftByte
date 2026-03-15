"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchCurrentUserProfile,
  updateCurrentUserProfile,
  type UserMe,
} from "@/lib/user";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMe | null>(null);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        const me = await fetchCurrentUserProfile(token);
        if (isMounted) {
          setUser(me);
          setNickname(me.nickname ?? "");
          setAvatarUrl(me.avatar_url ?? "");
          setPayoutMethod(me.payout_method ?? "");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load profile. Please try again.";
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const updated = await updateCurrentUserProfile(token, {
        nickname: nickname || undefined,
        avatar_url: avatarUrl || undefined,
        payout_method: payoutMethod || undefined,
      });
      setUser(updated);
      setSuccess("Profile updated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo px-4 py-3 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
        <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error ?? "Profile not available."}
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
            className="flex w-full items-center rounded-md bg-cyan-500/20 px-3 py-2 text-left font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.5)]"
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
            onClick={() => router.push("/wallet")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sky-200/70 hover:bg-slate-900/80"
          >
            Wallet
          </button>
        </nav>
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="mb-4 text-2xl font-semibold text-sky-50">Profile</h1>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <section className="card-holo px-4 py-4 text-sm">
            <h2 className="mb-3 text-sm font-semibold text-cyan-200">
              Account details
            </h2>
            <dl className="space-y-1 text-sky-100/80">
              <div className="flex justify-between">
                <dt className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                  Email
                </dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                  Created
                </dt>
                <dd>
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card-holo px-4 py-4 text-sm flex flex-col items-center gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-cyan-400/70 bg-slate-900 shadow-[0_0_24px_rgba(56,189,248,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.nickname}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-cyan-200">
                  {user.nickname?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <p className="text-xs text-sky-200/80">
              Your cyber avatar used across wishlists.
            </p>
          </section>
        </div>

        <section className="mt-6 card-holo max-w-xl px-4 py-4 text-sm">
          <h2 className="mb-3 text-sm font-semibold text-cyan-200">
            Edit profile
          </h2>

          {success && (
            <div className="mb-3 rounded-md border border-emerald-500/70 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-md border border-rose-500/70 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-cyan-200">
                Nickname
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input-cyber w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-cyan-200">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="input-cyber w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-cyan-200">
                Payout method
              </label>
              <input
                placeholder="e.g. bank account, PayPal, etc."
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="input-cyber w-full px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-cyber-primary inline-flex items-center justify-center px-4 py-2 text-xs font-medium tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}


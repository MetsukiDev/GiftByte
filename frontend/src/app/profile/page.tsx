"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUserProfile, updateCurrentUserProfile, type UserMe } from "@/lib/user";
import Sidebar from "@/components/Sidebar";

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
        typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const me = await fetchCurrentUserProfile(token);
        if (isMounted) {
          setUser(me);
          setNickname(me.nickname ?? "");
          setAvatarUrl(me.avatar_url ?? "");
          setPayoutMethod(me.payout_method ?? "");
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [router]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    const token =
      typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
    if (!token) { router.replace("/login"); return; }
    try {
      const updated = await updateCurrentUserProfile(token, {
        nickname: nickname || undefined,
        avatar_url: avatarUrl || undefined,
        payout_method: payoutMethod || undefined,
      });
      setUser(updated);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo px-6 py-4 text-sm">Loading profile...</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#02030a] text-sky-100">
      <div className="card-holo w-full max-w-md border border-rose-500/70 bg-rose-950/40 px-6 py-4 text-sm text-rose-100">
        {error ?? "Profile not available."}
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <Sidebar active="/profile" />
      <main className="page-main">
        <div className="page-content">

          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-cyan-400/55 mb-1">
              GIFTBYTE // PROFILE
            </p>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your identity and account settings.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[auto_1fr] max-w-3xl">
            {/* Avatar + account info */}
            <div className="flex flex-col gap-4">
              <div className="card-holo flex flex-col items-center gap-3 px-6 py-6 min-w-[160px]">
                <div className="h-20 w-20 overflow-hidden rounded-full border border-cyan-400/60 bg-slate-900 shadow-[0_0_24px_rgba(56,189,248,0.4)]">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt={user.nickname} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-cyan-200">
                      {user.nickname?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-sky-100">{user.nickname}</p>
                  <p className="text-[10px] text-sky-300/50 mt-0.5">Cyber identity</p>
                </div>
              </div>

              <div className="card-holo px-4 py-4 text-xs">
                <p className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-cyan-300/60">ACCOUNT</p>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/50">Email</dt>
                    <dd className="mt-0.5 text-sky-100/80 break-all">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/50">Joined</dt>
                    <dd className="mt-0.5 text-sky-100/80">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Edit form */}
            <div className="card-holo px-5 py-5 text-sm">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/70">EDIT PROFILE</p>

              {success && (
                <div className="mb-3 rounded-md border border-emerald-500/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-3 rounded-md border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold tracking-[0.14em] text-cyan-300/70">NICKNAME</label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="input-cyber w-full px-3 py-2 text-sm"
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold tracking-[0.14em] text-cyan-300/70">AVATAR URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="input-cyber w-full px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold tracking-[0.14em] text-cyan-300/70">PAYOUT METHOD</label>
                  <input
                    placeholder="e.g. bank account, PayPal, etc."
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="input-cyber w-full px-3 py-2 text-sm"
                  />
                  <p className="text-[10px] text-sky-300/40">Used when wishlist funds are released to you.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-cyber-primary px-5 py-2 text-xs tracking-[0.18em] disabled:opacity-70"
                >
                  {saving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

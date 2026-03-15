"use client";

import { FormEvent, useEffect, useState } from "react";
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

  async function handleSubmit(e: FormEvent) {
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

  if (error || !user) return (
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
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your identity and account settings.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
            {/* Account details */}
            <div className="card-holo px-5 py-4 text-sm">
              <p className="mb-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/80">ACCOUNT</p>
              <dl className="space-y-2 text-sky-100/80">
                <div className="flex justify-between gap-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">Email</dt>
                  <dd className="text-xs">{user.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">Joined</dt>
                  <dd className="text-xs">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Avatar */}
            <div className="card-holo flex flex-col items-center gap-3 px-5 py-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-cyan-400/60 bg-slate-900 shadow-[0_0_24px_rgba(56,189,248,0.5)]">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={user.nickname} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-cyan-200">
                    {user.nickname?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-sky-200/60 text-center">Cyber avatar</p>
            </div>
          </div>

          {/* Edit form */}
          <div className="mt-4 card-holo max-w-lg px-5 py-5 text-sm">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-cyan-300/80">EDIT PROFILE</p>

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
                <label className="block text-xs font-medium text-cyan-200">Nickname</label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="input-cyber w-full px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-cyan-200">Avatar URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="input-cyber w-full px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-cyan-200">Payout method</label>
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
                className="btn-cyber-primary px-5 py-2 text-xs tracking-[0.18em] disabled:opacity-70"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

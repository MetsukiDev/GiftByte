"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, type User } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(token);
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("access_token");
        }
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load your account. Please sign in again.";
          setError(message);
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-full max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-50 text-zinc-900">
      <aside className="flex h-screen w-60 flex-col border-r border-zinc-200 bg-white px-4 py-6 shadow-sm">
        <div className="mb-6 px-2 text-lg font-semibold tracking-tight">
          GiftByte
        </div>
        <nav className="flex-1 space-y-1 text-sm">
          <button
            type="button"
            className="flex w-full items-center rounded-md bg-zinc-900 px-3 py-2 text-left font-medium text-white"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-zinc-700 hover:bg-zinc-100"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => router.push("/wishlists")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-zinc-700 hover:bg-zinc-100"
          >
            My Wishlists
          </button>
          <button
            type="button"
            onClick={() => router.push("/wallet")}
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-zinc-700 hover:bg-zinc-100"
          >
            Wallet
          </button>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 px-8 py-10">
        <h1 className="mb-2 text-2xl font-semibold">
          {user ? `Welcome, ${user.nickname}` : "Welcome to GiftByte"}
        </h1>
        <p className="mb-6 text-sm text-zinc-600">
          This is your dashboard. Here you&apos;ll manage your wishlists and
          wallet once those features are added.
        </p>

        {user && (
          <div className="max-w-md rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-zinc-900">
              Your account
            </h2>
            <dl className="space-y-1 text-zinc-700">
              <div className="flex justify-between">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Email
                </dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Nickname
                </dt>
                <dd>{user.nickname}</dd>
              </div>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}


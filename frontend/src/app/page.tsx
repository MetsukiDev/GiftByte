export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="w-full max-w-md rounded-lg border border-zinc-200 bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
          GiftByte
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500">
          A simple wishlist platform.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="flex w-full items-center justify-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
          >
            Create an account
          </a>
        </div>
      </main>
    </div>
  );
}

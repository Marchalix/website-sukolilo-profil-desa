"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message || "Username atau password salah."
        );
        return;
      }

      router.push(redirect || "/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-900/5"
    >
      {/* CARD HEADER */}
      <div className="mb-7 flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-bold text-gray-900">
            Login Admin
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Akses khusus pengelola website
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
          {error}
        </div>
      )}

      {/* USERNAME */}
      <div>
        <label
          htmlFor="username"
          className="text-sm font-semibold text-gray-900"
        >
          Username
        </label>

        <div className="relative mt-2">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Masukkan username"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-gray-900"
        >
          Password
        </label>

        <div className="relative mt-2">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Masukkan password"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-green-700"
            aria-label={
              showPassword
                ? "Sembunyikan password"
                : "Lihat password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-200 border-t-white" />
            Memproses...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Masuk ke Admin
          </>
        )}
      </button>
    </form>
  );
}

function LoginFallback() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-900/5">
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7f4] px-6">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-100/70 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* BRAND */}
        <div className="mb-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-xl font-bold text-white shadow-lg shadow-green-900/10">
            DS
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
            Desa Sukolilo
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Admin Panel
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Masuk untuk mengelola informasi dan konten
            website Desa Sukolilo.
          </p>

        </div>

        {/* LOGIN */}
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>

        {/* BACK */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            ← Kembali ke website
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Sistem Informasi Desa Sukolilo
        </p>

      </div>
    </main>
  );
}
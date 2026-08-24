"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    const yakin = window.confirm(
      "Yakin ingin keluar dari halaman admin?"
    );

    if (!yakin) return;

    setLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Gagal logout.");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal logout."
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />

      {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}
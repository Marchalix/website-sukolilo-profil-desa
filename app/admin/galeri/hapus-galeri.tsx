"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

export default function HapusGaleri({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleHapus = async () => {
    const yakin = window.confirm(
      "Yakin ingin menghapus galeri ini?"
    );

    if (!yakin) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/galeri/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menghapus galeri"
        );
      }

      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus galeri"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleHapus}
      disabled={loading}
      className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
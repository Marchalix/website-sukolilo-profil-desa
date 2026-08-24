"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      title="Hapus galeri"
      aria-label="Hapus galeri"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
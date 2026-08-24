"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  id: number;
  nama: string;
};

export default function HapusPotensi({
  id,
  nama,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const yakin = window.confirm(
      `Yakin ingin menghapus potensi "${nama}"?`
    );

    if (!yakin) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/potensi/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menghapus potensi"
        );
      }

      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus potensi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Hapus potensi"
      aria-label={`Hapus potensi ${nama}`}
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
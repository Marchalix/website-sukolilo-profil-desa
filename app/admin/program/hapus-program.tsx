"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

export default function HapusProgram({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleHapus = async () => {
    const yakin = window.confirm(
      "Yakin ingin menghapus program ini?"
    );

    if (!yakin) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/program/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menghapus program"
        );
      }

      alert("Program berhasil dihapus.");

      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus program"
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
      className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
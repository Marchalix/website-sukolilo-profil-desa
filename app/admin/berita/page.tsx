"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  status: string;
};

export default function AdminBeritaPage() {
  const router = useRouter();

  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // =========================
  // AMBIL DATA BERITA
  // =========================
  useEffect(() => {
    const ambilBerita = async () => {
      try {
        const response = await fetch("/api/berita");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data berita"
          );
        }

        setBerita(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    ambilBerita();
  }, []);

  // =========================
  // HAPUS BERITA
  // =========================
  const handleDelete = async (id: number) => {
    const yakin = confirm(
      "Yakin ingin menghapus berita ini?"
    );

    if (!yakin) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(
        `/api/berita/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menghapus berita"
        );
      }

      // Hapus dari tampilan tanpa reload
      setBerita((prev) =>
        prev.filter((item) => item.id !== id)
      );

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus berita"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

        <div>
        <Link
            href="/admin"
            className="mb-2 inline-block text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
            ← Kembali ke Dashboard
        </Link>

        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Admin Desa Sukolilo
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Kelola Berita
        </h1>
        </div>

          <Link
            href="/berita"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-700 hover:text-green-700"
          >
            Lihat Website
          </Link>

        </div>
      </header>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Daftar Berita
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Kelola berita yang ditampilkan pada website Desa Sukolilo.
            </p>
          </div>

          <Link
            href="/admin/berita/tambah"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            + Tambah Berita
          </Link>

        </div>

        {/* ==================== TABLE ==================== */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">

          {loading ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-500">
                Memuat berita...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Judul
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Kategori
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Tanggal
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {berita.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* JUDUL */}
                      <td className="px-6 py-5">

                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.judul}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            /berita/{item.slug}
                          </p>
                        </div>

                      </td>

                      {/* KATEGORI */}
                      <td className="px-6 py-5">

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.kategori}
                        </span>

                      </td>

                      {/* TANGGAL */}
                      <td className="px-6 py-5 text-sm text-gray-600">

                        {new Date(
                          item.tanggal
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span
                          className={
                            item.status === "published"
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                              : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
                          }
                        >
                          {item.status}
                        </span>

                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-4">

                        <Link
                        href={`/admin/berita/${item.id}/preview`}
                        className="text-sm font-medium text-gray-600 hover:text-green-700"
                        >
                        Lihat
                        </Link>

                          <Link
                            href={`/admin/berita/${item.id}/edit`}
                            className="text-sm font-semibold text-green-700 hover:text-green-900"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            disabled={
                              deletingId === item.id
                            }
                            className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === item.id
                              ? "Menghapus..."
                              : "Hapus"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* TIDAK ADA BERITA */}
          {!loading && berita.length === 0 && (
            <div className="px-6 py-16 text-center">

              <p className="text-gray-500">
                Belum ada berita.
              </p>

              <Link
                href="/admin/berita/tambah"
                className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-900"
              >
                + Tambah Berita
              </Link>

            </div>
          )}

        </div>

      </section>
    </main>
  );
}
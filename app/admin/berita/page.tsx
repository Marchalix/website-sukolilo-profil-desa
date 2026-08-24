"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Eye,
  FileText,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

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
    <main className="min-h-screen bg-[#f7f8f6]">

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-sm font-bold text-white shadow-sm">
              DS
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Desa Sukolilo
              </p>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>

          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-green-200 hover:text-green-700 sm:flex"
          >
            <Eye className="h-4 w-4" />
            Preview Website
          </Link>

        </div>
      </header>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* BREADCRUMB */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        {/* PAGE HEADER */}
        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              <Newspaper className="h-4 w-4" />
              Content Management
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Berita Desa
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Kelola berita dan artikel yang ditampilkan pada
              website Desa Sukolilo.
            </p>

          </div>

          <Link
            href="/admin/berita/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Berita
          </Link>

        </div>

        {/* ==================== SUMMARY ==================== */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Total Berita
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {berita.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Eye className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Published
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    berita.filter(
                      (item) => item.status === "published"
                    ).length
                  }
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Terbaru
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {berita.length > 0
                    ? new Date(
                        berita[0].tanggal
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ==================== DATA ==================== */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center">

            <div>
              <h2 className="font-bold text-gray-900">
                Daftar Berita
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Semua berita yang tersimpan dalam sistem.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
              {berita.length} data
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

                <p className="mt-4 text-sm text-gray-500">
                  Memuat data berita...
                </p>

              </div>

            </div>
          )}

          {/* TABLE */}
          {!loading && berita.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-gray-50/80">

                  <tr>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Berita
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Kategori
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Tanggal
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {berita.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-gray-50/70"
                    >

                      {/* BERITA */}
                      <td className="px-6 py-5">

                        <div className="flex items-start gap-3">

                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Newspaper className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-md truncate font-semibold text-gray-900">
                              {item.judul}
                            </p>

                            <p className="mt-1 max-w-md truncate text-xs text-gray-400">
                              /berita/{item.slug}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* KATEGORI */}
                      <td className="px-6 py-5">

                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {item.kategori}
                        </span>

                      </td>

                      {/* TANGGAL */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <CalendarDays className="h-4 w-4 text-gray-400" />

                          {new Date(
                            item.tanggal
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span
                          className={
                            item.status === "published"
                              ? "inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                              : "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                          }
                        >
                          {item.status}
                        </span>

                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/admin/berita/${item.id}/preview`}
                            title="Lihat berita"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/berita/${item.id}/edit`}
                            title="Edit berita"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            disabled={
                              deletingId === item.id
                            }
                            title="Hapus berita"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-red-500" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && berita.length === 0 && (
            <div className="flex min-h-[320px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Newspaper className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Belum ada berita
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Belum ada berita yang tersimpan dalam sistem.
                </p>

                <Link
                  href="/admin/berita/tambah"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Berita
                </Link>

              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
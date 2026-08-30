import HapusGaleri from "./hapus-galeri";
import Link from "next/link";
import db from "@/lib/db";
import { getS3Url } from "@/lib/s3";

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Images,
  Pencil,
  Plus,
  ImageIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Galeri = {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

export default async function AdminGaleriPage() {
  const [rows] = await db.query(
    `SELECT
      id,
      judul,
      gambar,
      kategori,
      keterangan,
      tanggal
    FROM galeri
    ORDER BY tanggal DESC, id DESC`
  );

  const [profilRows] = await db.query(
    "SELECT logo FROM profil LIMIT 1"
  );

  const logoPath =
    (profilRows as { logo: string | null }[])[0]?.logo ?? null;

  const logo = logoPath
    ? await getS3Url(logoPath)
    : null;

  const galeri = rows as Galeri[];

  const galeriDenganUrl = await Promise.all(
  galeri.map(async (item) => {
    if (
      process.env.AWS_ENDPOINT_URL &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME
    ) {
      return {
        ...item,
        gambar: await getS3Url(item.gambar),
      };
    }

    return {
      ...item,
      gambar: `/uploads/galeri/${item.gambar}`,
    };
  })
);

  return (
    <main className="min-h-screen bg-[#f7f8f6]">

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

          <div className="flex items-center gap-3">

            {/* LOGO DESA */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo Desa Sukolilo"
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-bold text-green-700">
                  DS
                </span>
              )}
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
              <Images className="h-4 w-4" />
              Content Management
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Galeri Desa
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Kelola dokumentasi kegiatan dan informasi visual Desa
              Sukolilo.
            </p>

          </div>

          <Link
            href="/admin/galeri/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Galeri
          </Link>

        </div>

        {/* ==================== SUMMARY ==================== */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Images className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Total Galeri
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {galeri.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ImageIcon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Kategori
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {new Set(
                    galeri.map((item) => item.kategori)
                  ).size}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Dokumentasi Terbaru
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {galeri.length > 0
                    ? new Date(
                        galeri[0].tanggal
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
                Daftar Galeri
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Semua dokumentasi yang tersimpan dalam sistem.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
              {galeri.length} data
            </div>

          </div>

          {/* TABLE */}
          {galeri.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead className="bg-gray-50/80">

                  <tr>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Galeri
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Kategori
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Tanggal
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Keterangan
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {galeriDenganUrl.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-gray-50/70"
                    >

                      {/* GALERI */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                            <img
                            src={item.gambar}
                              alt={item.judul}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-sm truncate font-semibold text-gray-900">
                              {item.judul}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Galeri #{item.id}
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

                      {/* KETERANGAN */}
                      <td className="max-w-md px-6 py-5">

                        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                          {item.keterangan}
                        </p>

                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/admin/galeri/${item.id}/preview`}
                            title="Lihat galeri"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/galeri/${item.id}/edit`}
                            title="Edit galeri"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-700 hover:text-green-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <HapusGaleri id={item.id} />

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex min-h-[320px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Images className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Belum ada galeri
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Belum ada dokumentasi yang tersimpan dalam sistem.
                </p>

                <Link
                  href="/admin/galeri/tambah"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Galeri
                </Link>

              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
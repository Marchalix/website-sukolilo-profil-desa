import Link from "next/link";
import db from "@/lib/db";
import HapusProgram from "./hapus-program";
import {
  ArrowLeft,
  Eye,
  Images,
  Pencil,
  Plus,
  ClipboardList,
} from "lucide-react";
import { getS3Url } from "@/lib/s3";

export const dynamic = "force-dynamic";

type Program = {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
  detail: string;
  status: string;
  urutan: number | null;
};

export default async function AdminProgramPage() {
  const [rows] = await db.query(
    `SELECT
      id,
      nama,
      deskripsi,
      gambar,
      detail,
      status,
      urutan
    FROM program
    ORDER BY urutan ASC, id ASC`
  );

  // =========================
  // AMBIL LOGO DARI DATABASE
  // =========================
  const [profilRows] = await db.query(
    "SELECT logo FROM profil LIMIT 1"
  );

  const logoPath =
    (profilRows as { logo: string | null }[])[0]?.logo ?? null;

  const logo = logoPath
    ? await getS3Url(logoPath)
    : null;

  const program = rows as Program[];

    const programDenganUrl = await Promise.all(
    program.map(async (item) => {
      if (
        item.gambar &&
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
        gambar: item.gambar
          ? `/uploads/program/${item.gambar}`
          : null,
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
              <ClipboardList className="h-4 w-4" />
              Content Management
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Program Unggulan
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Kelola program unggulan yang ditampilkan pada website
              Desa Sukolilo.
            </p>

          </div>

          <Link
            href="/admin/program/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Program
          </Link>

        </div>

        {/* ==================== SUMMARY ==================== */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Total Program
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {program.length}
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
                    program.filter(
                      (item) => item.status === "published"
                    ).length
                  }
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Images className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Dengan Gambar
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    program.filter(
                      (item) => item.gambar
                    ).length
                  }
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
                Daftar Program
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Semua program yang tersimpan dalam sistem.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
              {program.length} data
            </div>

          </div>

          {/* TABLE */}
          {program.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-gray-50/80">

                  <tr>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Program
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Deskripsi
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Urutan
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {programDenganUrl.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-gray-50/70"
                    >

                      {/* PROGRAM */}
                      <td className="px-6 py-5">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber-50 text-amber-600">

                            {item.gambar ? (
                              <img
                                src={item.gambar}
                                alt={item.nama}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ClipboardList className="h-5 w-5" />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="max-w-sm truncate font-semibold text-gray-900">
                              {item.nama}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID #{item.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* DESKRIPSI */}
                      <td className="max-w-md px-6 py-5">

                        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                          {item.deskripsi}
                        </p>

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

                      {/* URUTAN */}
                      <td className="px-6 py-5">

                        <span className="inline-flex min-w-8 justify-center rounded-lg bg-gray-50 px-2.5 py-1 text-sm font-semibold text-gray-600">
                          {item.urutan ?? "-"}
                        </span>

                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <Link
                            href={`/admin/program/${item.id}/preview`}
                            title="Lihat program"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/program/${item.id}/edit`}
                            title="Edit program"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <HapusProgram
                            id={item.id}
                          />

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
                  <ClipboardList className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Belum ada program
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Belum ada program yang tersimpan dalam sistem.
                </p>

                <Link
                  href="/admin/program/tambah"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Program
                </Link>

              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
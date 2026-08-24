import HapusGaleri from "./hapus-galeri";
import Link from "next/link";
import db from "@/lib/db";

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

  const galeri = rows as Galeri[];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <Link
            href="/admin"
            className="inline-block text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            ← Kembali ke Dashboard
          </Link>

          <div className="mt-3 flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
                Admin Desa Sukolilo
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Kelola Galeri
              </h1>
            </div>

            <Link
              href="/galeri"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-700 hover:text-green-700"
            >
              Lihat Website
            </Link>

          </div>

        </div>
      </header>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Daftar Galeri
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Kelola dokumentasi kegiatan dan informasi visual Desa Sukolilo.
            </p>
          </div>

          <Link
            href="/admin/galeri/tambah"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            + Tambah Galeri
          </Link>

        </div>

        {/* ==================== TABLE ==================== */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">

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
                    Keterangan
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {galeri.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* JUDUL */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={`/uploads/galeri/${item.gambar}`}
                          alt={item.judul}
                          className="h-12 w-16 rounded-lg object-cover"
                        />

                        <div>
                          <p className="font-semibold text-gray-900">
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

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {item.kategori}
                      </span>

                    </td>

                    {/* TANGGAL */}
                    <td className="px-6 py-5 text-sm text-gray-600">

                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}

                    </td>

                    {/* KETERANGAN */}
                    <td className="max-w-md px-6 py-5 text-sm text-gray-600">

                      <p className="line-clamp-2">
                        {item.keterangan}
                      </p>

                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-4">

                        <Link
                          href={`/admin/galeri/${item.id}/preview`}
                          className="text-sm font-medium text-gray-600 transition hover:text-green-700"
                        >
                          Lihat
                        </Link>

                        <Link
                          href={`/admin/galeri/${item.id}/edit`}
                          className="text-sm font-semibold text-green-700 transition hover:text-green-900"
                        >
                          Edit
                        </Link>

                        <HapusGaleri id={item.id} />

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* TIDAK ADA DATA */}
          {galeri.length === 0 && (
            <div className="px-6 py-16 text-center">

              <p className="text-gray-500">
                Belum ada data galeri.
              </p>

              <Link
                href="/admin/galeri/tambah"
                className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-900"
              >
                + Tambah Galeri
              </Link>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
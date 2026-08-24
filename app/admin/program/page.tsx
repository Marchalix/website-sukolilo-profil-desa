import Link from "next/link";
import db from "@/lib/db";
import HapusProgram from "./hapus-program";

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

  const program = rows as Program[];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          <div>

           <Link
                href="/admin"
                className="mb-3 inline-block text-sm font-medium text-gray-500 transition hover:text-green-700"
            >
                ← Kembali ke Dashboard
            </Link>
            
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              Admin Desa Sukolilo
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Kelola Program Unggulan
            </h1>
          </div>

          <Link
            href="/program"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-700 hover:text-green-700"
          >
            Lihat Website
          </Link>

        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Daftar Program
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Kelola program unggulan yang ditampilkan pada website Desa
              Sukolilo.
            </p>
          </div>

          <Link
            href="/admin/program/tambah"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            + Tambah Program
          </Link>

        </div>

        {/* TABLE */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="border-b bg-gray-50">
                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Nama
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Deskripsi
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Urutan
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {program.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {item.nama}
                      </p>
                    </td>

                    <td className="max-w-md px-6 py-5 text-sm text-gray-600">
                      <p className="line-clamp-2">
                        {item.deskripsi}
                      </p>
                    </td>

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

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {item.urutan ?? "-"}
                    </td>

                    <td className="px-6 py-5 text-right">

                      <div className="flex justify-end gap-3">

                        <Link
                        href={`/admin/program/${item.id}/preview`}
                        className="text-sm font-medium text-gray-600 hover:text-green-700"
                        >
                        Lihat
                        </Link>

                        <Link
                          href={`/admin/program/${item.id}/edit`}
                          className="text-sm font-semibold text-green-700 hover:text-green-900"
                        >
                          Edit
                        </Link>

                        <HapusProgram id={item.id} />

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {program.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-500">
                Belum ada program.
              </p>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}
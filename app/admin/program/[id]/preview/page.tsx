import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { notFound } from "next/navigation";

type Program = {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
  detail: string | null;
  status: string;
  urutan: number | null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PreviewProgramPage({ params }: Props) {
  const { id } = await params;

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
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  const program = (rows as Program[])[0];

  if (!program) {
    notFound();
  }

  const gambarUrl = program.gambar || null;

  return (
    <main className="min-h-screen bg-white">

      {/* PREVIEW BAR */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              👁
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Preview
                </span>

                <span className="hidden text-sm font-medium text-amber-900 sm:inline">
                  Tampilan pratinjau program
                </span>
              </div>

              <p className="mt-0.5 hidden text-xs text-amber-700 sm:block">
                Tampilan ini hanya dapat dilihat oleh admin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <a
              href={`/admin/program/${program.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              ✏️ Edit Program
            </a>

            <a
              href="/admin/program"
              className="hidden rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 sm:inline-flex"
            >
              ← Daftar
            </a>

          </div>
        </div>
      </div>

      <Navbar />

      {/* HERO */}
      <section
        className="relative flex min-h-[400px] items-center bg-cover bg-center"
        style={{
          backgroundImage: gambarUrl
          ? `url('${gambarUrl}')`
          : "url('/images/gapura-sukolilo.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-950/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
              Kampung 13
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              {program.nama}
            </h1>

            <p className="mt-5 text-base leading-7 text-green-50 sm:text-lg">
              {program.deskripsi}
            </p>

          </div>
        </div>
      </section>

      {/* DETAIL */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Program Unggulan
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {program.nama}
          </h2>

          <div className="mt-8 rounded-2xl bg-green-50 p-8">
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {program.detail || program.deskripsi}
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
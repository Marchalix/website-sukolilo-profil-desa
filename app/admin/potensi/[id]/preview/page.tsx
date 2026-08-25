import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { getS3Url } from "@/lib/s3";
import { notFound } from "next/navigation";

type Potensi = {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  gambar: string | null;
  urutan: number | null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PreviewPotensiPage({ params }: Props) {
  const { id } = await params;

  const [rows] = await db.query(
    `SELECT
      id,
      nama,
      kategori,
      deskripsi,
      gambar,
      urutan
    FROM potensi
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  const potensi = (rows as Potensi[])[0];

  if (!potensi) {
    notFound();
  }

  const gambarUrl =
  potensi.gambar &&
  process.env.AWS_ENDPOINT_URL &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME
    ? await getS3Url(potensi.gambar)
    : potensi.gambar
      ? `/uploads/potensi/${potensi.gambar}`
      : null;

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
                  Tampilan pratinjau potensi
                </span>
              </div>

              <p className="mt-0.5 hidden text-xs text-amber-700 sm:block">
                Tampilan ini hanya dapat dilihat oleh admin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <a
              href={`/admin/potensi/${potensi.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              ✏️ Edit Potensi
            </a>

            <a
              href="/admin/potensi"
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
              Potensi Desa
            </p>

            <span className="mt-4 inline-block rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-800">
              {potensi.kategori}
            </span>

            <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
              {potensi.nama}
            </h1>

          </div>
        </div>
      </section>

        {/* ==================== ISI PREVIEW ==================== */}
        <section className="bg-green-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* ==================== GAMBAR ==================== */}
            <div className="overflow-hidden rounded-3xl">
              {gambarUrl ? (
                <img
                  src={gambarUrl}
                  alt={potensi.nama}
                  className="h-[350px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[350px] items-center justify-center rounded-3xl bg-gray-100">
                    <p className="text-sm text-gray-400">
                    Belum ada gambar
                    </p>
                </div>
                )}
            </div>

            {/* ==================== INFORMASI ==================== */}
            <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Potensi{" "}
                {potensi.urutan !== null
                    ? String(potensi.urutan).padStart(2, "0")
                    : ""}
                </p>

                <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {potensi.kategori}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {potensi.nama}
                </h1>

                <p className="mt-5 text-base leading-8 text-gray-600">
                {potensi.deskripsi}
                </p>

            </div>

            </div>

        </div>
        </section>

      <Footer />
    </main>
  );
}
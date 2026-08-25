import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { getS3Url } from "@/lib/s3";

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  gambar: string | null;
  ringkasan: string;
  isi: string;
  status: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PreviewBeritaPage({ params }: Props) {
  const { id } = await params;

  const [rows] = await db.query(
    `SELECT
      id,
      judul,
      slug,
      kategori,
      tanggal,
      gambar,
      ringkasan,
      isi,
      status
    FROM berita
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  const berita = (rows as Berita[])[0];

  if (!berita) {
    notFound();
  }
if (!berita) {
  notFound();
}

const gambarUrl =
  berita.gambar &&
  process.env.AWS_ENDPOINT_URL &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME
    ? await getS3Url(berita.gambar)
    : berita.gambar
      ? `/uploads/berita/${berita.gambar}`
      : "/images/gapura-sukolilo.jpg";

  return (
    <main className="min-h-screen bg-white">
      {/* BAR PREVIEW */}
    {/* ==================== PREVIEW BAR ==================== */}
    <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 shadow-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">

        {/* INFO PREVIEW */}
        <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <span className="text-lg">
            👁
            </span>
        </div>

        <div>
            <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Preview
            </span>

            <span className="hidden text-sm font-medium text-amber-900 sm:inline">
                Tampilan pratinjau berita
            </span>
            </div>

            <p className="mt-0.5 hidden text-xs text-amber-700 sm:block">
            Tampilan ini hanya dapat dilihat oleh admin.
            </p>
        </div>

        </div>

        {/* TOMBOL */}
        <div className="flex items-center gap-2">

        <a
            href={`/admin/berita/${berita.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md"
        >
            ✏️
            <span>Edit Berita</span>
        </a>

        <a
            href="/admin/berita"
            className="hidden rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 sm:inline-flex"
        >
            ← Daftar
        </a>

        </div>

    </div>
    </div>

      <Navbar />

      {/* HERO BERITA */}
      <section
        className="relative flex min-h-[420px] items-center bg-cover bg-center"
          style={{
            backgroundImage: `url('${gambarUrl}')`,
          }}
      >
        <div className="absolute inset-0 bg-green-950/65" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">

            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-800">
              {berita.kategori}
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {berita.judul}
            </h1>

            <p className="mt-5 text-sm text-green-50">
              {new Date(berita.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

          </div>
        </div>
      </section>

      {/* ISI */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          <p className="text-lg font-medium leading-8 text-gray-700">
            {berita.ringkasan}
          </p>

          <div className="mt-8">
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {berita.isi}
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
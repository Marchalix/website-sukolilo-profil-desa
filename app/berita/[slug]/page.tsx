import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { notFound } from "next/navigation";

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  gambar: string;
  ringkasan: string;
  isi: string;
  status: string;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;

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
    WHERE slug = ?
      AND status = 'published'
    LIMIT 1`,
    [slug]
  );

  const berita = (rows as Berita[])[0];

  if (!berita) {
    notFound();
  }

  return (
    <main>
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        className="relative flex min-h-[420px] items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/uploads/berita/${berita.gambar}')`,
        }}
      >
        <div className="absolute inset-0 bg-green-950/65" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">

            {/* Kategori */}
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-800">
              {berita.kategori}
            </span>

            {/* Judul */}
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {berita.judul}
            </h1>

            {/* Tanggal */}
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

      {/* ==================== ISI BERITA ==================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          {/* Ringkasan */}
          <p className="text-lg font-medium leading-8 text-gray-700">
            {berita.ringkasan}
          </p>

          {/* Isi berita */}
          <div className="mt-8">
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {berita.isi}
            </p>
          </div>

          {/* Kembali */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <a
              href="/berita"
              className="text-sm font-semibold text-green-700 transition hover:text-green-900"
            >
              ← Kembali ke Berita
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
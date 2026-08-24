import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { notFound } from "next/navigation";

type Galeri = {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PreviewGaleriPage({ params }: Props) {
  const { id } = await params;

  const [rows] = await db.query(
    `SELECT
      id,
      judul,
      gambar,
      kategori,
      keterangan,
      tanggal
    FROM galeri
    WHERE id = ?
    LIMIT 1`,
    [id]
  );

  const galeri = (rows as Galeri[])[0];

  if (!galeri) {
    notFound();
  }

  return (
    <main>

      {/* ==================== PREVIEW BAR ==================== */}
      <div className="border-b border-yellow-200 bg-yellow-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-xs">
              👁
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-yellow-700">
                Preview
              </p>

              <p className="text-xs text-yellow-700">
                Tampilan pratinjau galeri
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <Link
              href={`/admin/galeri/${galeri.id}/edit`}
              className="rounded-md bg-green-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-800"
            >
              ✎ Edit Galeri
            </Link>

            <Link
              href="/admin/galeri"
              className="rounded-md border border-yellow-500 bg-white px-4 py-2 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-50"
            >
              ← Daftar
            </Link>

          </div>

        </div>
      </div>

      {/* ==================== NAVBAR ==================== */}
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        className="relative flex min-h-[420px] items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/uploads/galeri/${galeri.gambar}')`,
        }}
      >

        <div className="absolute inset-0 bg-green-950/65" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">

          <div className="max-w-3xl">

            {/* KATEGORI */}
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-800">
              {galeri.kategori}
            </span>

            {/* JUDUL */}
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {galeri.judul}
            </h1>

            {/* TANGGAL */}
            <p className="mt-5 text-sm text-green-50">
              {new Date(galeri.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

          </div>

        </div>

      </section>

      {/* ==================== ISI GALERI ==================== */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          {/* GAMBAR UTAMA */}
          <div className="overflow-hidden rounded-2xl">

            <img
              src={`/uploads/galeri/${galeri.gambar}`}
              alt={galeri.judul}
              className="max-h-[650px] w-full object-cover"
            />

          </div>

          {/* KETERANGAN */}
          <div className="mt-10">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Dokumentasi Desa
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {galeri.judul}
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600">
              {galeri.keterangan}
            </p>

          </div>

        </div>

      </section>

      {/* ==================== FOOTER ==================== */}
      <Footer />

    </main>
  );
}
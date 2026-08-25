import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BeritaList from "./berita-list";
import db from "@/lib/db";

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

export default async function BeritaPage() {
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
    WHERE status = 'published'
    ORDER BY tanggal DESC`
  );

  const [profilRows] = await db.query(
  "SELECT logo FROM profil LIMIT 1"
);

const logo =
  (profilRows as { logo: string | null }[])[0]?.logo ?? null;

  const berita = rows as Berita[];

  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex min-h-[400px] items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/gapura-sukolilo.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-950/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
              Informasi Desa
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Berita Desa
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Informasi terbaru mengenai kegiatan, program, dan perkembangan
              Desa Sukolilo.
            </p>
          </div>
        </div>
      </section>

      <BeritaList berita={berita} />

      <Footer />
    </main>
  );
}
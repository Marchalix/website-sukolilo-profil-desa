import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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

export default async function GaleriPage() {
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
    <main>
      <Navbar />

      {/* ==================== HERO ==================== */}
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
              Dokumentasi
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Galeri Desa
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Dokumentasi berbagai kegiatan dan kehidupan masyarakat
              Desa Sukolilo.
            </p>

          </div>
        </div>
      </section>

      {/* ==================== GALERI ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Dokumentasi Desa
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Kegiatan Desa Sukolilo
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Lihat berbagai dokumentasi kegiatan, aktivitas masyarakat,
              dan momen Desa Sukolilo.
            </p>

          </div>

          {galeri.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {galeri.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* GAMBAR */}
                  <div className="overflow-hidden">

                    <img
                      src={`/uploads/galeri/${item.gambar}`}
                      alt={item.judul}
                      className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                  </div>

                  {/* INFORMASI */}
                  <div className="p-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      {item.kategori}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold text-gray-900">
                      {item.judul}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.keterangan}
                    </p>

                    <p className="mt-4 text-xs text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="mt-12 rounded-2xl bg-gray-50 py-16 text-center">

              <p className="text-gray-500">
                Belum ada dokumentasi galeri.
              </p>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
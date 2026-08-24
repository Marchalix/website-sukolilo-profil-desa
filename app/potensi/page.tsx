export const dynamic = "force-dynamic";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";

type Potensi = {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  gambar: string | null;
  urutan: number | null;
};

export default async function PotensiPage() {
  const [rows] = await db.query(
    `SELECT
      id,
      nama,
      kategori,
      deskripsi,
      gambar,
      urutan
    FROM potensi
    ORDER BY urutan ASC, id ASC`
  );

  const potensi = rows as Potensi[];

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
              Potensi Desa
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Potensi Desa Sukolilo
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Mengenal berbagai potensi yang dimiliki dan dikembangkan oleh
              masyarakat Desa Sukolilo.
            </p>

          </div>
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Potensi Sukolilo
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Kekayaan dan Potensi Desa
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Desa Sukolilo memiliki berbagai potensi yang dapat mendukung
              kehidupan masyarakat serta perkembangan ekonomi desa.
            </p>

          </div>

        </div>
      </section>

      {/* ==================== DATA POTENSI ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {potensi.length > 0 ? (
            <div className="space-y-16">

              {potensi.map((item, index) => (
                <article
                  key={item.id}
                  className="grid items-center gap-10 lg:grid-cols-2"
                >

                  {/* ==================== GAMBAR ==================== */}
                  <div
                    className={
                      index % 2 === 1
                        ? "lg:order-2"
                        : "lg:order-1"
                    }
                  >
                    <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-sm">

                      {item.gambar ? (
                        <img
                          src={`/uploads/potensi/${item.gambar}`}
                          alt={item.nama}
                          className="h-[350px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[350px] items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl">
                              🌱
                            </div>

                            <p className="mt-3 text-sm text-gray-400">
                              Belum ada gambar
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* ==================== INFORMASI ==================== */}
                  <div
                    className={
                      index % 2 === 1
                        ? "lg:order-1"
                        : "lg:order-2"
                    }
                  >

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                      Potensi {String(index + 1).padStart(2, "0")}
                    </p>

                    <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {item.kategori}
                    </span>

                    <h2 className="mt-4 text-3xl font-bold text-gray-900">
                      {item.nama}
                    </h2>

                    <p className="mt-5 text-base leading-8 text-gray-600">
                      {item.deskripsi}
                    </p>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">

              <div className="text-5xl">
                🌱
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Belum Ada Data Potensi
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Informasi potensi Desa Sukolilo belum tersedia.
              </p>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
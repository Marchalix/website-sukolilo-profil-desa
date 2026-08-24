import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";

type Program = {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
  detail: string | null;
  status: string;
  urutan: number | null;
};

export const dynamic = "force-dynamic";

export default async function ProgramPage() {
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
    WHERE status = 'published'
    ORDER BY urutan ASC, id ASC`
  );

  const program = rows as Program[];

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
              Kampung 13
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Program Unggulan
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Berbagai program unggulan yang dikembangkan untuk mendukung
              masyarakat dan kemajuan Desa Sukolilo.
            </p>

          </div>
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Program Desa
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Program Unggulan Desa Sukolilo
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600">
            Mengenal berbagai program unggulan yang dikembangkan untuk
            mendukung masyarakat dan kemajuan Desa Sukolilo.
          </p>

        </div>
      </section>

      {/* ==================== PROGRAM ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Heading */}
          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Program
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Kegiatan Unggulan
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Kenali berbagai program yang menjadi bagian dari pengembangan
              Desa Sukolilo.
            </p>

          </div>

          {/* ==================== CARD PROGRAM ==================== */}
          {program.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {program.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* GAMBAR */}
                  {item.gambar ? (
                    <img
                      src={`/uploads/program/${item.gambar}`}
                      alt={item.nama}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-400">
                        Belum ada gambar
                      </span>
                    </div>
                  )}

                  {/* ISI CARD */}
                  <div className="p-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Program{" "}
                      {item.urutan !== null
                        ? String(item.urutan).padStart(2, "0")
                        : "-"}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold text-gray-900">
                      {item.nama}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.deskripsi}
                    </p>

                    <a
                    href={`/program/${item.id}`}
                    className="mt-5 inline-block text-sm font-semibold text-green-700 hover:text-green-900"
                    >
                    Selengkapnya →
                    </a>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-white py-16 text-center shadow-sm">
              <p className="text-gray-500">
                Belum ada program yang tersedia.
              </p>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
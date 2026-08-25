import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { getS3Url } from "@/lib/s3";

type Potensi = {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  gambar: string | null;
  urutan: number | null;
};

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  gambar: string;
  ringkasan: string;
};

type Program = {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
  urutan: number | null;
};

type Galeri = {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

type Kontak = {
  alamat: string;
  telepon: string;
  email: string;
  jam_pelayanan: string | null;
  latitude: number | null;
  longitude: number | null;
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // =========================
  // AMBIL DATA POTENSI
  // =========================

  const [potensiRows] = await db.query(
    `SELECT
      id,
      nama,
      kategori,
      deskripsi,
      gambar,
      urutan
    FROM potensi
    ORDER BY urutan ASC, id ASC
    LIMIT 4`
  );

  const potensi = potensiRows as Potensi[];

  // =========================
  // AMBIL DATA BERITA
  // =========================

  const [beritaRows] = await db.query(
    `SELECT
      id,
      judul,
      slug,
      kategori,
      tanggal,
      gambar,
      ringkasan
    FROM berita
    WHERE status = 'published'
    ORDER BY tanggal DESC, id DESC
    LIMIT 3`
  );

  const berita = beritaRows as Berita[];

  const beritaDenganUrl = await Promise.all(
  berita.map(async (item) => {
    if (
      process.env.AWS_ENDPOINT_URL &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME
    ) {
      return {
        ...item,
        gambar: await getS3Url(item.gambar),
      };
    }

    return {
      ...item,
      gambar: `/uploads/berita/${item.gambar}`,
    };
  })
);

  // =========================
  // AMBIL DATA PROGRAM
  // =========================

  const [programRows] = await db.query(
    `SELECT
      id,
      nama,
      deskripsi,
      gambar,
      urutan
    FROM program
    WHERE status = 'published'
    ORDER BY urutan ASC, id ASC
    LIMIT 3`
  );

  const program = programRows as Program[];

  // =========================
  // AMBIL DATA GALERI
  // =========================

  const [galeriRows] = await db.query(
    `SELECT
      id,
      judul,
      gambar,
      kategori,
      keterangan,
      tanggal
    FROM galeri
    ORDER BY tanggal DESC, id DESC
    LIMIT 8`
  );

  const galeri = galeriRows as Galeri[];

  // =========================
// AMBIL DATA KONTAK
// =========================

const [kontakRows] = await db.query(
  `SELECT
    alamat,
    telepon,
    email,
    jam_pelayanan,
    latitude,
    longitude
  FROM kontak
  LIMIT 1`
);

const kontak = (kontakRows as Kontak[])[0];

  return (
    <main>
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        className="relative flex min-h-[500px] items-center bg-cover bg-center sm:min-h-[560px]"
        style={{
          backgroundImage: "url('/images/gapura-sukolilo.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-950/55" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
              Selamat Datang
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Desa Sukolilo
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Mengenal lebih dekat profil, potensi, kegiatan, dan kehidupan
              masyarakat Desa Sukolilo.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="/profil"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Lihat Profil Desa
              </a>

              <a
                href="/potensi"
                className="inline-flex items-center rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Jelajahi Potensi
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* ==================== SEKILAS DESA ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Tentang Desa
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Sekilas Desa Sukolilo
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600">
            Desa Sukolilo merupakan salah satu desa yang memiliki potensi dan
            karakteristik yang beragam. Melalui website ini, masyarakat dapat
            mengenal profil desa, potensi, kegiatan, serta berbagai informasi
            terbaru mengenai Desa Sukolilo.
          </p>

          <a
            href="/profil"
            className="mt-6 inline-block text-sm font-semibold text-green-700 transition hover:text-green-900"
          >
            Selengkapnya →
          </a>

        </div>
      </section>

      {/* ==================== POTENSI ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Mengenal Sukolilo
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Potensi Desa
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Berbagai potensi yang dimiliki Desa Sukolilo dan menjadi bagian
              penting dalam kehidupan masyarakat.
            </p>

          </div>

          {potensi.length > 0 ? (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {potensi.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {item.gambar ? (
                    <img
                      src={`/uploads/potensi/${item.gambar}`}
                      alt={item.nama}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-400">
                        Belum ada gambar
                      </span>
                    </div>
                  )}

                  <div className="p-6 text-center">

                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      {item.kategori}
                    </p>

                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      {item.nama}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.deskripsi}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="mt-12 rounded-2xl bg-white py-16 text-center shadow-sm">
              <p className="text-gray-500">
                Belum ada data potensi.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">

            <a
              href="/potensi"
              className="text-sm font-semibold text-green-700 hover:text-green-900"
            >
              Lihat Semua Potensi →
            </a>

          </div>

        </div>
      </section>

      {/* ==================== BERITA ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Kabar Sukolilo
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Berita Terbaru
              </h2>

            </div>

            <a
              href="/berita"
              className="text-sm font-semibold text-green-700 hover:text-green-900"
            >
              Lihat Semua Berita →
            </a>

          </div>

          {berita.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {beritaDenganUrl.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* GAMBAR */}
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-gray-100">
                      <span className="text-sm text-gray-400">
                        Belum ada gambar
                      </span>
                    </div>
                  )}

                  {/* INFORMASI BERITA */}
                  <div className="p-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      {item.kategori}
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-semibold text-gray-900">
                      {item.judul}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.ringkasan}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <a
                      href={`/berita/${item.slug}`}
                      className="mt-5 inline-block text-sm font-semibold text-green-700 hover:text-green-900"
                    >
                      Baca Selengkapnya →
                    </a>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-gray-50 py-16 text-center">
              <p className="text-gray-500">
                Belum ada berita.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ==================== PROGRAM ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Kampung 13
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Program Unggulan
              </h2>

            </div>

            <a
              href="/program"
              className="text-sm font-semibold text-green-700 hover:text-green-900"
            >
              Lihat Semua Program →
            </a>

          </div>

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

                  {/* INFORMASI PROGRAM */}
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

      {/* ==================== GALERI ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Dokumentasi
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Galeri Desa
              </h2>

            </div>

            <a
              href="/galeri"
              className="text-sm font-semibold text-green-700 hover:text-green-900"
            >
              Lihat Semua Galeri →
            </a>

          </div>

          {galeri.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">

              {galeri.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-gray-100"
                >

                  <img
                    src={`/uploads/galeri/${item.gambar}`}
                    alt={item.judul}
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                </div>
              ))}

            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-gray-50 py-16 text-center">
              <p className="text-gray-500">
                Belum ada dokumentasi galeri.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ==================== LOKASI ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Lokasi
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Temukan Desa Sukolilo
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                Kunjungi Kantor Desa Sukolilo untuk mendapatkan informasi dan
                pelayanan secara langsung.
              </p>

              <div className="mt-8">

                <p className="font-semibold text-gray-900">
                  Alamat
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {kontak?.alamat || "Alamat Kantor Desa Sukolilo belum tersedia."}
                </p>

              </div>

              <a
                href="/kontak"
                className="mt-6 inline-block rounded-md bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Lihat Lokasi & Kontak
              </a>

            </div>

            <div className="overflow-hidden rounded-3xl bg-gray-200">

              {kontak?.latitude !== null &&
              kontak?.latitude !== undefined &&
              kontak?.longitude !== null &&
              kontak?.longitude !== undefined ? (
                <iframe
                  src={`https://www.google.com/maps?q=${kontak.latitude},${kontak.longitude}&output=embed`}
                  className="h-[380px] w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Desa Sukolilo"
                />
              ) : (
                <div className="flex h-[380px] items-center justify-center">
                  <div className="text-center">

                    <div className="text-4xl">
                      📍
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      Lokasi Desa Sukolilo
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Lokasi belum tersedia.
                    </p>

                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";

type Kontak = {
  alamat: string;
  telepon: string;
  email: string;
  jam_pelayanan: string | null;
  latitude: number | null;
  longitude: number | null;
};

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const [rows] = await db.query(
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

  const kontak =
    Array.isArray(rows) && rows.length > 0
      ? (rows[0] as Kontak)
      : null;

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
              Hubungi Kami
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              Kontak Desa
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Informasi kontak dan lokasi Kantor Desa Sukolilo.
            </p>

          </div>
        </div>
      </section>

      {/* ==================== KONTAK ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2">

            {/* ==================== INFORMASI ==================== */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Informasi
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Hubungi Desa Sukolilo
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                Untuk mendapatkan informasi lebih lanjut mengenai Desa
                Sukolilo, masyarakat dapat menghubungi pemerintah desa
                melalui kontak yang tersedia.
              </p>

              {kontak ? (
                <div className="mt-10 space-y-6">

                  {/* ALAMAT */}
                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                      📍
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Alamat
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {kontak.alamat}
                      </p>
                    </div>

                  </div>

                  {/* TELEPON */}
                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                      ☎️
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Telepon
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {kontak.telepon}
                      </p>
                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                      ✉️
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Email
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {kontak.email}
                      </p>
                    </div>

                  </div>

                  {/* JAM PELAYANAN */}
                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
                      🕐
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Jam Pelayanan
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {kontak.jam_pelayanan || "Belum tersedia"}
                      </p>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="mt-10 rounded-xl bg-gray-50 p-6">
                  <p className="text-sm text-gray-500">
                    Informasi kontak belum tersedia.
                  </p>
                </div>
              )}

            </div>

            {/* ==================== PETA ==================== */}
            <div className="overflow-hidden rounded-3xl bg-gray-200">

              {kontak?.latitude !== null &&
              kontak?.latitude !== undefined &&
              kontak?.longitude !== null &&
              kontak?.longitude !== undefined ? (
                <iframe
                  src={`https://www.google.com/maps?q=${kontak.latitude},${kontak.longitude}&output=embed`}
                  className="h-[500px] w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor Desa Sukolilo"
                />
              ) : (
                <div className="flex h-[500px] items-center justify-center">
                  <div className="text-center">

                    <div className="text-4xl">
                      📍
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      Lokasi Desa Sukolilo
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Koordinat lokasi belum tersedia.
                    </p>

                  </div>
                </div>
              )}

            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Informasi lokasi dapat diperbarui melalui halaman admin kontak.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}
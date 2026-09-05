import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { getGlobalBannerUrl } from "@/lib/banner";

type Profil = {
  id: number;
  sejarah: string;
  visi: string;
  misi: string;
  jumlah_penduduk: number;
  jumlah_kk: number;
  jumlah_rt: number;
  jumlah_rw: number;
  nama_kepala_desa: string;
};

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const bannerUrl = await getGlobalBannerUrl();
  const [rows] = await db.query(
    `SELECT
      id,
      sejarah,
      visi,
      misi,
      jumlah_penduduk,
      jumlah_kk,
      jumlah_rt,
      jumlah_rw,
      nama_kepala_desa
    FROM profil
    ORDER BY id ASC
    LIMIT 1`
  );

  const profil = (rows as Profil[])[0];

  return (
    <main>
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        className="relative flex min-h-[450px] items-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${bannerUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-green-950/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
              Mengenal Desa
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              Profil Desa Sukolilo
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-green-50 sm:text-lg">
              Mengenal sejarah, wilayah, pemerintahan, serta karakteristik
              masyarakat Desa Sukolilo.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== TENTANG DESA ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Gambar */}

            {/* Text */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Tentang Desa
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Desa Sukolilo
              </h2>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-gray-600">
                {profil?.sejarah ||
                  "Informasi mengenai Desa Sukolilo belum tersedia."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== SEJARAH ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Sejarah
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Sejarah Desa Sukolilo
            </h2>
          </div>

          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {profil?.sejarah ||
                "Sejarah Desa Sukolilo belum tersedia."}
            </p>
          </div>

        </div>
      </section>

      {/* ==================== VISI MISI ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Arah Pembangunan
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Visi & Misi
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">

            {/* Visi */}
            <div className="rounded-2xl bg-green-50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
                🎯
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Visi
              </h3>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                {profil?.visi || "Visi belum tersedia."}
              </p>
            </div>

            {/* Misi */}
            <div className="rounded-2xl bg-green-50 p-8 sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
                🌱
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Misi
              </h3>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                {profil?.misi || "Misi belum tersedia."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== DATA DESA ==================== */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Data Desa
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Sekilas Data Sukolilo
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Penduduk */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Jumlah Penduduk
              </p>

              <p className="mt-3 text-3xl font-bold text-green-700">
                {profil?.jumlah_penduduk ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Jiwa
              </p>
            </div>

            {/* KK */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Jumlah KK
              </p>

              <p className="mt-3 text-3xl font-bold text-green-700">
                {profil?.jumlah_kk ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Kepala Keluarga
              </p>
            </div>

            {/* RT */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Jumlah RT
              </p>

              <p className="mt-3 text-3xl font-bold text-green-700">
                {profil?.jumlah_rt ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                RT
              </p>
            </div>

            {/* RW */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Jumlah RW
              </p>

              <p className="mt-3 text-3xl font-bold text-green-700">
                {profil?.jumlah_rw ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                RW
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== PEMERINTAHAN ==================== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              Pemerintahan
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Pemerintahan Desa
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Struktur pemerintahan yang menjalankan pelayanan dan
              penyelenggaraan pemerintahan Desa Sukolilo.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-2xl bg-green-50 p-8 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl">
              👤
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-green-700">
              Kepala Desa
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {profil?.nama_kepala_desa || "Nama Kepala Desa belum tersedia"}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Desa Sukolilo
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
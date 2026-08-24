import db from "@/lib/db";

export default async function Footer() {
  const [rows] = await db.query(
    `SELECT
      alamat,
      telepon,
      email
    FROM kontak
    LIMIT 1`
  );

  const kontak =
    Array.isArray(rows) && rows.length > 0
      ? (rows[0] as {
          alamat: string;
          telepon: string;
          email: string;
        })
      : null;

  return (
    <footer className="bg-green-950 py-12 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Tentang */}
          <div>
            <p className="text-lg font-bold">
              DESA SUKOLILO
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-green-100">
              Website informasi Desa Sukolilo sebagai media untuk
              mengenalkan profil, potensi, kegiatan, dan informasi
              desa kepada masyarakat.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="font-semibold">
              Navigasi
            </h3>

            <div className="mt-4 grid gap-2 text-sm text-green-100">

              <a href="/" className="hover:text-white">
                Beranda
              </a>

              <a href="/profil" className="hover:text-white">
                Profil Desa
              </a>

              <a href="/berita" className="hover:text-white">
                Berita
              </a>

              <a href="/potensi" className="hover:text-white">
                Potensi Desa
              </a>

              <a href="/program" className="hover:text-white">
                Program Unggulan
              </a>

              <a href="/galeri" className="hover:text-white">
                Galeri
              </a>

              <a href="/kontak" className="hover:text-white">
                Kontak
              </a>

            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-semibold">
              Kontak
            </h3>

            {kontak ? (
              <p className="mt-4 text-sm leading-6 text-green-100">
                Desa Sukolilo
                <br />
                {kontak.alamat}
                <br />
                {kontak.telepon}
                <br />
                {kontak.email}
              </p>
            ) : (
              <p className="mt-4 text-sm text-green-100">
                Informasi kontak belum tersedia.
              </p>
            )}

          </div>

        </div>

        <div className="mt-10 border-t border-green-800 pt-6 text-sm text-green-200">
          © 2026 Desa Sukolilo. Seluruh hak cipta dilindungi.
        </div>

      </div>
    </footer>
  );
}
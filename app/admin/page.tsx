import LogoutButton from "./logout-button";
import Link from "next/link";

const menu = [
  {
    nama: "Profil Desa",
    deskripsi: "Kelola informasi dan profil Desa Sukolilo.",
    href: "/admin/profil",
  },
  {
    nama: "Berita",
    deskripsi: "Kelola berita dan informasi terbaru desa.",
    href: "/admin/berita",
  },
  {
    nama: "Potensi",
    deskripsi: "Kelola berbagai potensi yang dimiliki desa.",
    href: "/admin/potensi",
  },
  {
    nama: "Program",
    deskripsi: "Kelola program unggulan Desa Sukolilo.",
    href: "/admin/program",
  },
  {
    nama: "Galeri",
    deskripsi: "Kelola dokumentasi dan foto kegiatan desa.",
    href: "/admin/galeri",
  },

  {
  nama: "Kontak",
  deskripsi: "Kelola alamat dan informasi kontak desa.",
  href: "/admin/kontak",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              Admin Desa Sukolilo
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-green-700 hover:text-green-700"
          >
            Lihat Website
          </Link>

        </div>
      </header>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Selamat Datang, Admin
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Pilih bagian website yang ingin kamu kelola.
          </p>
        </div>

        {/* ==================== MENU ==================== */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700">
                  {item.nama}
                </h3>

                <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-700">
                  →
                </span>

              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.deskripsi}
              </p>

            </Link>
          ))}

        </div>

        {/* ==================== LOGOUT ==================== */}
        <div className="mt-10 border-t border-gray-200 pt-8">
        <LogoutButton />
        </div>

      </section>

    </main>
  );
}
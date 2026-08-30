import Link from "next/link";
import db from "@/lib/db";
import { getS3Url } from "@/lib/s3";
import LogoutButton from "./logout-button";
import {
  LayoutDashboard,
  Newspaper,
  Sprout,
  ClipboardList,
  Images,
  UserRound,
  MapPin,
  ArrowUpRight,
  ExternalLink,
  Settings,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [beritaRows, potensiRows, programRows, galeriRows] =
    await Promise.all([
      db.query("SELECT COUNT(*) AS total FROM berita"),
      db.query("SELECT COUNT(*) AS total FROM potensi"),
      db.query("SELECT COUNT(*) AS total FROM program"),
      db.query("SELECT COUNT(*) AS total FROM galeri"),
    ]);

    const [profilRows] = await db.query(
      "SELECT logo FROM profil LIMIT 1"
    );

    const logoPath =
      (profilRows as { logo: string | null }[])[0]?.logo ?? null;

    let logo = logoPath;

    if (logoPath) {
      try {
        logo = await getS3Url(logoPath);
        console.log("ADMIN LOGO URL:", logo);
      } catch (error) {
        console.error("GAGAL GET LOGO:", error);
      }
    }

  const totalBerita = Number(
    (beritaRows[0] as any[])[0]?.total ?? 0
  );

  const totalPotensi = Number(
    (potensiRows[0] as any[])[0]?.total ?? 0
  );

  const totalProgram = Number(
    (programRows[0] as any[])[0]?.total ?? 0
  );

  const totalGaleri = Number(
    (galeriRows[0] as any[])[0]?.total ?? 0
  );

  const statistik = [
    {
      title: "Total Berita",
      value: totalBerita,
      label: "artikel",
      icon: Newspaper,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Potensi",
      value: totalPotensi,
      label: "potensi",
      icon: Sprout,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Program",
      value: totalProgram,
      label: "program",
      icon: ClipboardList,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Galeri",
      value: totalGaleri,
      label: "dokumentasi",
      icon: Images,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const menuUtama = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Berita",
      href: "/admin/berita",
      icon: Newspaper,
    },
    {
      label: "Potensi Desa",
      href: "/admin/potensi",
      icon: Sprout,
    },
    {
      label: "Program Unggulan",
      href: "/admin/program",
      icon: ClipboardList,
    },
    {
      label: "Galeri",
      href: "/admin/galeri",
      icon: Images,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f6]">

      {/* ==================== TOPBAR ==================== */}
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
     <div className="flex h-20 items-center justify-between px-6 lg:px-8">

          {/* BRAND */}
            <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">                {logo ? (
                <img
                    src={logo}
                    alt="Logo Desa Sukolilo"
                    className="h-full w-full object-contain p-1"
                />
                ) : (
                <span className="text-sm font-bold text-green-700">
                    DS
                </span>
                )}
            </div>

            <div>
                <p className="text-sm font-bold text-gray-900">
                Desa Sukolilo
                </p>

                <p className="text-xs text-gray-500">
                Admin Panel
                </p>
            </div>

            </div>

          {/* TOPBAR RIGHT */}
          <div className="flex items-center gap-3">

            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-green-200 hover:text-green-700 sm:flex"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Website
            </Link>

            <div className="h-7 w-px bg-gray-200" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
              A
            </div>

          </div>

        </div>
      </header>

      <div className="flex">

        {/* ==================== SIDEBAR ==================== */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-200 bg-white lg:flex">

          <div className="flex w-full flex-col">

            <nav className="flex-1 px-4 py-6">

              <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Menu Utama
              </p>

              <div className="mt-3 space-y-1">

                {menuUtama.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/admin";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        active
                          ? "flex items-center gap-3 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700"
                          : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                      }
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </Link>
                  );
                })}

              </div>

              <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Pengaturan
              </p>

              <div className="mt-3 space-y-1">

                <Link
                  href="/admin/profil"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                >
                  <UserRound className="h-[18px] w-[18px]" />
                  Profil Desa
                </Link>

                <Link
                  href="/admin/kontak"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                >
                  <MapPin className="h-[18px] w-[18px]" />
                  Kontak & Lokasi
                </Link>

              </div>

            </nav>

            <div className="border-t border-gray-100 p-4">
              <LogoutButton />
            </div>

          </div>

        </aside>

        {/* ==================== MAIN ==================== */}
        <section className="min-w-0 flex-1 px-6 py-8 lg:px-10">

          {/* ==================== WELCOME ==================== */}
          <div className="relative overflow-hidden rounded-3xl bg-green-700 px-7 py-8 text-white shadow-sm sm:px-9">

            <div className="relative z-10 max-w-2xl">

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-100">
                Administration Panel
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Selamat datang, Admin 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                Kelola dan pantau seluruh konten website Desa Sukolilo
                dari satu tempat.
              </p>

              <Link
                href="/"
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Lihat Website
                <ExternalLink className="h-4 w-4" />
              </Link>

            </div>

            {/* DECORATION */}
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/5" />

          </div>

          {/* ==================== STATISTIK ==================== */}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {statistik.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {item.title}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-gray-900">
                        {item.value}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.label}
                      </p>

                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${item.iconColor}`}
                      />
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ==================== KELOLA KONTEN ==================== */}
          <div className="mt-8">

            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                Content Management
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Kelola Konten
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Kelola informasi yang ditampilkan pada website Desa Sukolilo.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

              <Link
                href="/admin/berita"
                className="group flex items-center justify-between border-b border-gray-100 px-6 py-5 transition hover:bg-gray-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Newspaper className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Berita
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Kelola berita dan artikel desa
                    </p>
                  </div>

                </div>

                <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

              </Link>

              <Link
                href="/admin/potensi"
                className="group flex items-center justify-between border-b border-gray-100 px-6 py-5 transition hover:bg-gray-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Sprout className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Potensi Desa
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Kelola potensi dan sumber daya desa
                    </p>
                  </div>

                </div>

                <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

              </Link>

              <Link
                href="/admin/program"
                className="group flex items-center justify-between border-b border-gray-100 px-6 py-5 transition hover:bg-gray-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Program Unggulan
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Kelola program unggulan desa
                    </p>
                  </div>

                </div>

                <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

              </Link>

              <Link
                href="/admin/galeri"
                className="group flex items-center justify-between px-6 py-5 transition hover:bg-gray-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Images className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Galeri
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Kelola dokumentasi kegiatan desa
                    </p>
                  </div>

                </div>

                <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

              </Link>

            </div>

          </div>

          {/* ==================== PENGATURAN ==================== */}
          <div className="mt-8">

            <div className="mb-4">

              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-green-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Pengaturan Website
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Kelola informasi dasar dan lokasi Desa Sukolilo.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <Link
                href="/admin/profil"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Profil Desa
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Kelola sejarah, visi, misi, dan informasi kependudukan desa.
                </p>

              </Link>

              <Link
                href="/admin/kontak"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700" />

                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  Kontak & Lokasi
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Kelola alamat, kontak pelayanan, dan koordinat lokasi desa.
                </p>

              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
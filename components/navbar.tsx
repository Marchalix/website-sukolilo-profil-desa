"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState("");

  // =========================
  // AMBIL LOGO DARI DATABASE
  // =========================
  useEffect(() => {
    const ambilLogo = async () => {
      try {
        const response = await fetch("/api/profil");

        const data = await response.json();

        if (response.ok && data.data?.logo) {
          setLogo(data.data.logo);
        }
      } catch (error) {
        console.error("Gagal mengambil logo:", error);
      }
    };

    ambilLogo();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

        {/* ==================== LOGO ==================== */}

        <a href="/" className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            {logo ? (
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

          <div className="leading-tight">
            <p className="text-sm font-bold tracking-wide text-green-800">
              DESA
            </p>

            <p className="text-lg font-semibold text-gray-800">
              SUKOLILO
            </p>
          </div>

        </a>

        {/* ==================== NAVIGATION ==================== */}

        <div className="hidden items-center gap-8 md:flex">

          <a
            href="/"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Beranda
          </a>

          <a
            href="/profil"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Profil Desa
          </a>

          <a
            href="/berita"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Berita
          </a>

          <a
            href="/potensi"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Potensi Desa
          </a>

          <a
            href="/program"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Program Unggulan
          </a>

          <a
            href="/galeri"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Galeri
          </a>

          <a
            href="/kontak"
            className="text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            Kontak
          </a>

          <a
            href="/login"
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Login Admin
          </a>

        </div>

        {/* ==================== MOBILE MENU BUTTON ==================== */}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 text-gray-600 md:hidden"
          aria-label="Buka menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

      </nav>

      {/* ==================== MOBILE MENU ==================== */}

      {isOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">

          <div className="mx-auto grid max-w-7xl gap-1 px-6 py-4">

            <a
              href="/"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Beranda
            </a>

            <a
              href="/profil"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Profil Desa
            </a>

            <a
              href="/berita"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Berita
            </a>

            <a
              href="/potensi"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Potensi Desa
            </a>

            <a
              href="/program"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Program Unggulan
            </a>

            <a
              href="/galeri"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Galeri
            </a>

            <a
              href="/kontak"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Kontak
            </a>

            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-md bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
            >
              Login Admin
            </a>

          </div>

        </div>
      )}

    </header>
  );
}
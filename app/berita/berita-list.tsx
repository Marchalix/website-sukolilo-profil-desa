"use client";

import { useState } from "react";

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  gambar: string;
  ringkasan: string;
  isi: string;
  status: string;
};

type Props = {
  berita: Berita[];
};

const kategoriList = [
  "Semua",
  "Kegiatan Desa",
  "Pemerintahan",
  "Masyarakat",
  "Pengumuman",
];

export default function BeritaList({ berita }: Props) {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const dataBerita = Array.isArray(berita) ? berita : [];

  const beritaFiltered =
    kategoriAktif === "Semua"
      ? dataBerita
      : dataBerita.filter(
          (item) => item.kategori === kategoriAktif
        );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ==================== HEADING ==================== */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Informasi Terkini
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Berita Desa Sukolilo
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600">
            Berbagai informasi dan kegiatan terbaru yang berlangsung di
            Desa Sukolilo.
          </p>
        </div>

        {/* ==================== FILTER ==================== */}
        <div className="mt-10 flex flex-wrap gap-3">
          {kategoriList.map((kategori) => {
            const aktif = kategoriAktif === kategori;

            return (
              <button
                key={kategori}
                type="button"
                onClick={() => setKategoriAktif(kategori)}
                className={
                  aktif
                    ? "rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-white"
                    : "rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-green-700 hover:text-green-700"
                }
              >
                {kategori}
              </button>
            );
          })}
        </div>

        {/* ==================== NEWS GRID ==================== */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {beritaFiltered.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Gambar */}
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="h-56 w-full object-cover"
                />

              {/* Isi Card */}
              <div className="p-7">

                {/* Kategori + tanggal */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                    {item.kategori}
                  </span>

                  <span className="text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Judul */}
                <h3 className="mt-4 text-xl font-semibold leading-7 text-gray-900">
                  {item.judul}
                </h3>

                {/* Ringkasan */}
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.ringkasan}
                </p>

                {/* Link */}
                <a
                  href={`/berita/${item.slug}`}
                  className="mt-5 inline-block text-sm font-semibold text-green-700 transition hover:text-green-900"
                >
                  Baca Selengkapnya →
                </a>

              </div>
            </article>
          ))}

        </div>

        {/* ==================== TIDAK ADA BERITA ==================== */}
        {beritaFiltered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-500">
              Belum ada berita dalam kategori ini.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
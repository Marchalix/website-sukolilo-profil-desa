"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahBeritaPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    judul: "",
    slug: "",
    kategori: "Kegiatan Desa",
    tanggal: "",
    ringkasan: "",
    isi: "",
    status: "published",
  });

  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buatSlug = (judul: string) => {
    return judul
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleJudulChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const judul = e.target.value;

    setForm((prev) => ({
      ...prev,
      judul,
      slug: buatSlug(judul),
    }));
  };

  const handleGambarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setGambar(file);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!gambar) {
      setError("Silakan pilih gambar terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("judul", form.judul);
      formData.append("slug", form.slug);
      formData.append("kategori", form.kategori);
      formData.append("tanggal", form.tanggal);
      formData.append("ringkasan", form.ringkasan);
      formData.append("isi", form.isi);
      formData.append("status", form.status);
      formData.append("gambar", gambar);

      const response = await fetch("/api/berita", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menambahkan berita"
        );
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5 lg:px-8">

          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-green-700"
          >
            ← Kembali
          </button>

          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              Admin Desa Sukolilo
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Tambah Berita
            </h1>
          </div>

        </div>
      </header>

      {/* ==================== FORM ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ==================== JUDUL ==================== */}
          <div>
            <label
              htmlFor="judul"
              className="block text-sm font-semibold text-gray-900"
            >
              Judul Berita
            </label>

            <input
              id="judul"
              name="judul"
              type="text"
              value={form.judul}
              onChange={handleJudulChange}
              placeholder="Masukkan judul berita"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* ==================== SLUG ==================== */}
          <div className="mt-6">
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-gray-900"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              value={form.slug}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-400">
              Slug digunakan sebagai alamat halaman berita.
            </p>
          </div>

          {/* ==================== KATEGORI + TANGGAL ==================== */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* KATEGORI */}
            <div>
              <label
                htmlFor="kategori"
                className="block text-sm font-semibold text-gray-900"
              >
                Kategori
              </label>

              <select
                id="kategori"
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="Kegiatan Desa">
                  Kegiatan Desa
                </option>

                <option value="Pemerintahan">
                  Pemerintahan
                </option>

                <option value="Masyarakat">
                  Masyarakat
                </option>

                <option value="Pengumuman">
                  Pengumuman
                </option>
              </select>
            </div>

            {/* TANGGAL */}
            <div>
              <label
                htmlFor="tanggal"
                className="block text-sm font-semibold text-gray-900"
              >
                Tanggal
              </label>

              <input
                id="tanggal"
                name="tanggal"
                type="date"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>

          {/* ==================== GAMBAR ==================== */}
          <div className="mt-6">
            <label
              htmlFor="gambar"
              className="block text-sm font-semibold text-gray-900"
            >
              Gambar Berita
            </label>

            <input
              id="gambar"
              name="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGambarChange}
              required
              className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-400">
              Pilih gambar dari komputer. Format JPG, PNG, atau WEBP.
            </p>

            {gambar && (
              <p className="mt-2 text-xs font-medium text-green-700">
                File dipilih: {gambar.name}
              </p>
            )}
          </div>

          {/* ==================== RINGKASAN ==================== */}
          <div className="mt-6">
            <label
              htmlFor="ringkasan"
              className="block text-sm font-semibold text-gray-900"
            >
              Ringkasan
            </label>

            <textarea
              id="ringkasan"
              name="ringkasan"
              value={form.ringkasan}
              onChange={handleChange}
              placeholder="Tulis ringkasan singkat berita"
              rows={4}
              required
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* ==================== ISI ==================== */}
          <div className="mt-6">
            <label
              htmlFor="isi"
              className="block text-sm font-semibold text-gray-900"
            >
              Isi Berita
            </label>

            <textarea
              id="isi"
              name="isi"
              value={form.isi}
              onChange={handleChange}
              placeholder="Tulis isi berita secara lengkap"
              rows={10}
              required
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* ==================== STATUS ==================== */}
          <div className="mt-6">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-900"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>
            </select>
          </div>

          {/* ==================== TOMBOL ==================== */}
          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : "Simpan Berita"}
            </button>

          </div>

        </form>
      </section>
    </main>
  );
}
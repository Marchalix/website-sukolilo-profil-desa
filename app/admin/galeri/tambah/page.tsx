"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahGaleriPage() {
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!gambar) {
        setError("Gambar wajib dipilih.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("keterangan", keterangan);
      formData.append("tanggal", tanggal);
      formData.append("gambar", gambar);

      const response = await fetch("/api/galeri", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menambahkan galeri");
      }

      router.push("/admin/galeri");
      router.refresh();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan galeri"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================== HEADER ==================== */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-green-700"
          >
            ← Kembali
          </button>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Admin Desa Sukolilo
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Tambah Galeri
          </h1>

        </div>
      </header>

      {/* ==================== FORM ==================== */}
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Judul */}
          <div>
            <label className="text-sm font-semibold text-gray-900">
              Judul Galeri
            </label>

            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Contoh: Kegiatan Gotong Royong Desa"
            />
          </div>

          {/* Kategori */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900">
              Kategori
            </label>

            <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900"
            >
            <option value="">Pilih kategori</option>
            <option value="Kegiatan Desa">Kegiatan Desa</option>
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Sosial">Sosial</option>
            <option value="Budaya">Budaya</option>
            <option value="Lingkungan">Lingkungan</option>
            <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Tanggal */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900">
              Tanggal
            </label>

            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Gambar */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900">
              Gambar
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                setGambar(e.target.files?.[0] || null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-500">
              Format JPG, PNG, atau WEBP.
            </p>
          </div>

          {/* Keterangan */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900">
              Keterangan
            </label>

            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              required
              rows={6}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Tulis keterangan mengenai foto atau kegiatan..."
            />
          </div>

          {/* Tombol */}
          <div className="mt-8 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Galeri"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
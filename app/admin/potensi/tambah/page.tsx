"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahPotensiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    kategori: "Pertanian",
    deskripsi: "",
    urutan: "",
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("nama", form.nama);
      formData.append("kategori", form.kategori);
      formData.append("deskripsi", form.deskripsi);
      formData.append("urutan", form.urutan);

      if (gambar) {
        formData.append("gambar", gambar);
      }

      const response = await fetch("/api/potensi", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menambahkan potensi"
        );
      }

      router.push("/admin/potensi");
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
              Tambah Potensi
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

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Nama */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-semibold text-gray-900"
            >
              Nama Potensi
            </label>

            <input
              id="nama"
              name="nama"
              type="text"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Pertanian"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Kategori */}
          <div className="mt-6">

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
              <option value="Pertanian">
                Pertanian
              </option>

              <option value="Peternakan">
                Peternakan
              </option>

              <option value="UMKM">
                UMKM
              </option>

              <option value="Wisata">
                Wisata
              </option>

              <option value="Lainnya">
                Lainnya
              </option>
            </select>

          </div>

          {/* Gambar */}
          <div className="mt-6">

            <label
              htmlFor="gambar"
              className="block text-sm font-semibold text-gray-900"
            >
              Gambar
            </label>

            <input
              id="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setGambar(e.target.files?.[0] || null)
              }
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:border-0 file:bg-green-700 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-500">
              Format JPG, PNG, atau WEBP.
            </p>

          </div>

          {/* Deskripsi */}
          <div className="mt-6">

            <label
              htmlFor="deskripsi"
              className="block text-sm font-semibold text-gray-900"
            >
              Deskripsi
            </label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Tulis deskripsi mengenai potensi desa"
              rows={8}
              required
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

          </div>

          {/* Urutan */}
          <div className="mt-6">

            <label
              htmlFor="urutan"
              className="block text-sm font-semibold text-gray-900"
            >
              Urutan Tampilan
            </label>

            <input
              id="urutan"
              name="urutan"
              type="number"
              min="1"
              value={form.urutan}
              onChange={handleChange}
              placeholder="Contoh: 1"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Opsional. Digunakan untuk menentukan urutan potensi.
            </p>

          </div>

          {/* Tombol */}
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
              {loading ? "Menyimpan..." : "Simpan Potensi"}
            </button>

          </div>

        </form>

      </section>
    </main>
  );
}
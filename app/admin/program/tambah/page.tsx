"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahProgramPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    detail: "",
    status: "published",
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
      formData.append("deskripsi", form.deskripsi);
      formData.append("detail", form.detail);
      formData.append("status", form.status);
      formData.append("urutan", form.urutan);

      if (gambar) {
        formData.append("gambar", gambar);
      }

      const response = await fetch("/api/program", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menambahkan program"
        );
      }

      router.push("/admin/program");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">

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
              Tambah Program
            </h1>

          </div>

        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

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
              Nama Program
            </label>

            <input
              id="nama"
              name="nama"
              type="text"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama program"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

          </div>

          {/* Deskripsi */}
          <div className="mt-6">

            <label
              htmlFor="deskripsi"
              className="block text-sm font-semibold text-gray-900"
            >
              Deskripsi Singkat
            </label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi singkat program"
              rows={4}
              required
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

          </div>

          {/* Detail */}
          <div className="mt-6">

            <label
              htmlFor="detail"
              className="block text-sm font-semibold text-gray-900"
            >
              Detail Program
            </label>

            <textarea
              id="detail"
              name="detail"
              value={form.detail}
              onChange={handleChange}
              placeholder="Masukkan informasi lengkap mengenai program"
              rows={8}
              required
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

          </div>

          {/* Gambar */}
          <div className="mt-6">

            <label
              htmlFor="gambar"
              className="block text-sm font-semibold text-gray-900"
            >
              Gambar Program
            </label>

            <input
              id="gambar"
              name="gambar"
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

          {/* Status + Urutan */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

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
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>

            </div>

            <div>

              <label
                htmlFor="urutan"
                className="block text-sm font-semibold text-gray-900"
              >
                Urutan
              </label>

              <input
                id="urutan"
                name="urutan"
                type="number"
                min="1"
                value={form.urutan}
                onChange={handleChange}
                placeholder="Contoh: 1"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

            </div>

          </div>

          {/* Tombol */}
          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Program"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
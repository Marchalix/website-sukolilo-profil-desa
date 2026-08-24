"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Potensi = {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  gambar: string | null;
  urutan: number | null;
};

export default function EditPotensiPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [form, setForm] = useState({
    nama: "",
    kategori: "Pertanian",
    deskripsi: "",
    urutan: "",
  });

  const [gambarLama, setGambarLama] = useState<string | null>(null);
  const [gambarBaru, setGambarBaru] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA
  // =========================

  useEffect(() => {
    const ambilData = async () => {
      try {
        const response = await fetch(`/api/potensi/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data potensi"
          );
        }

        const potensi: Potensi = data.data;

        setForm({
          nama: potensi.nama,
          kategori: potensi.kategori,
          deskripsi: potensi.deskripsi,
          urutan:
            potensi.urutan !== null
              ? String(potensi.urutan)
              : "",
        });

        setGambarLama(potensi.gambar);

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

    ambilData();
  }, [id]);

  // =========================
  // HANDLE CHANGE
  // =========================

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

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("nama", form.nama);
      formData.append("kategori", form.kategori);
      formData.append("deskripsi", form.deskripsi);
      formData.append("urutan", form.urutan);

      if (gambarBaru) {
        formData.append("gambar", gambarBaru);
      }

      const response = await fetch(`/api/potensi/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengubah potensi"
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
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">
            Memuat data potensi...
          </p>
        </div>
      </main>
    );
  }

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
              Edit Potensi
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

            {gambarLama && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-gray-500">
                  Gambar saat ini:
                </p>

                <img
                  src={`/uploads/potensi/${gambarLama}`}
                  alt={form.nama}
                  className="h-40 w-64 rounded-xl object-cover"
                />
              </div>
            )}

            <input
              id="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setGambarBaru(e.target.files?.[0] || null)
              }
              className="mt-4 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:border-0 file:bg-green-700 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-500">
              Kosongkan jika tidak ingin mengganti gambar.
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
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Urutan tidak boleh sama dengan potensi lain.
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
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

          </div>

        </form>

      </section>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Galeri = {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  keterangan: string;
  tanggal: string;
};

export default function EditGaleriPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [data, setData] = useState<Galeri | null>(null);

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/galeri/${id}`);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Gagal mengambil data galeri"
          );
        }

        const item = result.data as Galeri;

        setData(item);

        setJudul(item.judul);
        setKategori(item.kategori);
        setKeterangan(item.keterangan);

        // Supaya input date bisa membaca format YYYY-MM-DD
        setTanggal(
          new Date(item.tanggal)
            .toISOString()
            .split("T")[0]
        );

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data galeri"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("keterangan", keterangan);
      formData.append("tanggal", tanggal);

      if (gambar) {
        formData.append("gambar", gambar);
      }

      const response = await fetch(
        `/api/galeri/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal memperbarui galeri"
        );
      }

        router.push("/admin/galeri");
        router.refresh();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui galeri"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Memuat data galeri...
        </p>
      </main>
    );
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
            Edit Galeri
          </h1>

        </div>
      </header>

      {/* ==================== FORM ==================== */}
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Kategori */}
            <label
            htmlFor="kategori"
            className="block text-sm font-medium text-gray-700"
            >
            Kategori
            </label>

            <select
            id="kategori"
            name="kategori"
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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Gambar Lama */}
          {data?.gambar && (
            <div className="mt-6">

              <label className="text-sm font-semibold text-gray-900">
                Gambar Saat Ini
              </label>

              <div className="mt-3">
                <img
                  src={`/uploads/galeri/${data.gambar}`}
                  alt={data.judul}
                  className="h-48 w-72 rounded-xl object-cover"
                />
              </div>

            </div>
          )}

          {/* Gambar Baru */}
          <div className="mt-6">

            <label className="text-sm font-semibold text-gray-900">
              Ganti Gambar
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                setGambar(
                  e.target.files?.[0] || null
                );
              }}
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-500">
              Kosongkan jika tidak ingin mengganti gambar.
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
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
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
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
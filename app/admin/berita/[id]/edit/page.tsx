"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [form, setForm] = useState({
    judul: "",
    slug: "",
    kategori: "Kegiatan Desa",
    tanggal: "",
    gambar: null as File | null,
    ringkasan: "",
    isi: "",
    status: "published",
  });

  const [gambarLama, setGambarLama] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA BERITA
  // =========================
  useEffect(() => {
    const ambilBerita = async () => {
      try {
        const response = await fetch(`/api/berita/${id}`);

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Server tidak mengembalikan data JSON yang valid."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data berita"
          );
        }

        const berita: Berita = data.data;

        setForm({
          judul: berita.judul,
          slug: berita.slug,
          kategori: berita.kategori,
          tanggal: berita.tanggal
            ? berita.tanggal.substring(0, 10)
            : "",
          gambar: null,
          ringkasan: berita.ringkasan,
          isi: berita.isi,
          status: berita.status,
        });

        setGambarLama(berita.gambar);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data berita"
        );
      } finally {
        setLoading(false);
      }
    };

    ambilBerita();
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
  // HANDLE GAMBAR
  // =========================
  const handleGambarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      gambar: file,
    }));
  };

  // =========================
  // SLUG
  // =========================
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

      formData.append("judul", form.judul);
      formData.append("slug", form.slug);
      formData.append("kategori", form.kategori);
      formData.append("tanggal", form.tanggal);
      formData.append("ringkasan", form.ringkasan);
      formData.append("isi", form.isi);
      formData.append("status", form.status);

      if (form.gambar) {
        formData.append("gambar", form.gambar);
      }

      const response = await fetch(
        `/api/berita/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server tidak mengembalikan response JSON yang valid."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal memperbarui berita"
        );
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
          <p className="text-sm text-gray-600">
            Memuat data berita...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
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
              Edit Berita
            </h1>
          </div>

        </div>
      </header>

      {/* FORM */}
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

          {/* JUDUL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Judul Berita
            </label>

            <input
              name="judul"
              type="text"
              value={form.judul}
              onChange={handleJudulChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* SLUG */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Slug
            </label>

            <input
              name="slug"
              type="text"
              value={form.slug}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Slug digunakan sebagai alamat halaman berita.
            </p>
          </div>

          {/* KATEGORI + TANGGAL */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Kategori
              </label>

              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
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

            <div>
              <label className="block text-sm font-semibold text-gray-900">
                Tanggal
              </label>

              <input
                name="tanggal"
                type="date"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>

          {/* GAMBAR */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Gambar Berita
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGambarChange}
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-500">
              Kosongkan jika tidak ingin mengganti gambar.
            </p>

            {gambarLama && (
              <p className="mt-1 text-xs text-gray-500">
                Gambar saat ini: {gambarLama}
              </p>
            )}
          </div>

          {/* RINGKASAN */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Ringkasan
            </label>

            <textarea
              name="ringkasan"
              value={form.ringkasan}
              onChange={handleChange}
              rows={4}
              required
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* ISI */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Isi Berita
            </label>

            <textarea
              name="isi"
              value={form.isi}
              onChange={handleChange}
              rows={10}
              required
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* STATUS */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-900">
              Status
            </label>

            <select
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

          {/* BUTTON */}
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
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

          </div>

        </form>
      </section>
    </main>
  );
}
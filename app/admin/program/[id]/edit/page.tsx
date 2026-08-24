"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    detail: "",
    status: "published",
    urutan: "",
  });

  const [gambarLama, setGambarLama] = useState("");
  const [gambarBaru, setGambarBaru] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA PROGRAM
  // =========================

  useEffect(() => {
    async function ambilData() {
      try {
        const response = await fetch(`/api/program/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data program"
          );
        }

        const program = data.data;

        setForm({
          nama: program.nama || "",
          deskripsi: program.deskripsi || "",
          detail: program.detail || "",
          status: program.status || "published",
          urutan:
            program.urutan !== null &&
            program.urutan !== undefined
              ? String(program.urutan)
              : "",
        });

        setGambarLama(program.gambar || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data program"
        );
      } finally {
        setLoading(false);
      }
    }

    ambilData();
  }, [id]);

  // =========================
  // HANDLE INPUT
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
  // SIMPAN
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
      formData.append("deskripsi", form.deskripsi);
      formData.append("detail", form.detail);
      formData.append("status", form.status);
      formData.append("urutan", form.urutan);

      if (gambarBaru) {
        formData.append("gambar", gambarBaru);
      }

      const response = await fetch(`/api/program/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menyimpan program"
        );
      }

      router.push("/admin/program");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan program"
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
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-gray-500">
            Memuat data program...
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
            className="text-sm font-medium text-gray-500 hover:text-green-700"
          >
            ← Kembali
          </button>

          <div className="mt-4">

            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              Admin Desa Sukolilo
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Edit Program
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

          {/* NAMA */}
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
              required
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* DESKRIPSI */}
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
              required
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* DETAIL */}
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
              rows={8}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* URUTAN + STATUS */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* URUTAN */}
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
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-400">
                Angka menentukan posisi program pada website.
              </p>
            </div>

            {/* STATUS */}
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

          </div>

          {/* GAMBAR */}
          <div className="mt-6">

            <label
              htmlFor="gambar"
              className="block text-sm font-semibold text-gray-900"
            >
              Gambar Program
            </label>

            {gambarLama && (
              <div className="mt-3">

                <p className="mb-2 text-xs text-gray-500">
                  Gambar saat ini:
                </p>

                <img
                  src={`/uploads/program/${gambarLama}`}
                  alt={form.nama}
                  className="h-40 w-64 rounded-lg object-cover"
                />

              </div>
            )}

            <input
              id="gambar"
              name="gambar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setGambarBaru(
                  e.target.files?.[0] || null
                )
              }
              className="mt-4 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:font-medium file:text-white hover:file:bg-green-800"
            />

            <p className="mt-2 text-xs text-gray-400">
              Kosongkan jika tidak ingin mengganti gambar.
            </p>

          </div>

          {/* TOMBOL */}
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
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
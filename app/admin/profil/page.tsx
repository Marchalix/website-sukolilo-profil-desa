"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Profil = {
  sejarah: string;
  visi: string;
  misi: string;
  jumlah_penduduk: number;
  jumlah_kk: number;
  jumlah_rt: number;
  jumlah_rw: number;
  nama_kepala_desa: string;
};

const profilAwal: Profil = {
  sejarah: "",
  visi: "",
  misi: "",
  jumlah_penduduk: 0,
  jumlah_kk: 0,
  jumlah_rt: 0,
  jumlah_rw: 0,
  nama_kepala_desa: "",
};

export default function AdminProfilPage() {
  const [form, setForm] = useState<Profil>(profilAwal);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // AMBIL DATA PROFIL
  // =========================
  useEffect(() => {
    const ambilProfil = async () => {
      try {
        const response = await fetch("/api/profil");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data profil"
          );
        }

        if (data.data) {
          setForm({
            sejarah: data.data.sejarah || "",
            visi: data.data.visi || "",
            misi: data.data.misi || "",
            jumlah_penduduk:
              data.data.jumlah_penduduk || 0,
            jumlah_kk:
              data.data.jumlah_kk || 0,
            jumlah_rt:
              data.data.jumlah_rt || 0,
            jumlah_rw:
              data.data.jumlah_rw || 0,
            nama_kepala_desa:
              data.data.nama_kepala_desa || "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data profil"
        );
      } finally {
        setLoading(false);
      }
    };

    ambilProfil();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SIMPAN PROFIL
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menyimpan profil"
        );
      }

      setMessage("Profil berhasil disimpan.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profil"
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
            Memuat data profil...
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

          <Link
            href="/admin"
            className="text-sm font-medium text-gray-500 hover:text-green-700"
          >
            ← Kembali ke Dashboard
          </Link>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Admin Desa Sukolilo
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Kelola Profil Desa
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi utama mengenai Desa Sukolilo.
          </p>

        </div>
      </header>

      {/* ==================== FORM ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

          {/* ==================== PESAN ==================== */}

          {message && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ==================== SEJARAH ==================== */}

          <div>
            <label
              htmlFor="sejarah"
              className="text-sm font-semibold text-gray-900"
            >
              Sejarah Desa
            </label>

            <textarea
              id="sejarah"
              name="sejarah"
              value={form.sejarah}
              onChange={handleChange}
              rows={7}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Masukkan sejarah Desa Sukolilo..."
            />
          </div>

          {/* ==================== VISI ==================== */}

          <div className="mt-6">
            <label
              htmlFor="visi"
              className="text-sm font-semibold text-gray-900"
            >
              Visi
            </label>

            <textarea
              id="visi"
              name="visi"
              value={form.visi}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Masukkan visi desa..."
            />
          </div>

          {/* ==================== MISI ==================== */}

          <div className="mt-6">
            <label
              htmlFor="misi"
              className="text-sm font-semibold text-gray-900"
            >
              Misi
            </label>

            <textarea
              id="misi"
              name="misi"
              value={form.misi}
              onChange={handleChange}
              rows={7}
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Masukkan misi desa..."
            />
          </div>

          {/* ==================== KEPALA DESA ==================== */}

          <div className="mt-6">
            <label
              htmlFor="nama_kepala_desa"
              className="text-sm font-semibold text-gray-900"
            >
              Nama Kepala Desa
            </label>

            <input
              id="nama_kepala_desa"
              name="nama_kepala_desa"
              type="text"
              value={form.nama_kepala_desa}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Masukkan nama kepala desa..."
            />
          </div>

          {/* ==================== DATA PENDUDUK ==================== */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Kependudukan
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">

              {/* Jumlah Penduduk */}
              <div>
                <label
                  htmlFor="jumlah_penduduk"
                  className="text-sm font-semibold text-gray-900"
                >
                  Jumlah Penduduk
                </label>

                <input
                  id="jumlah_penduduk"
                  name="jumlah_penduduk"
                  type="number"
                  min="0"
                  value={form.jumlah_penduduk}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Jumlah KK */}
              <div>
                <label
                  htmlFor="jumlah_kk"
                  className="text-sm font-semibold text-gray-900"
                >
                  Jumlah KK
                </label>

                <input
                  id="jumlah_kk"
                  name="jumlah_kk"
                  type="number"
                  min="0"
                  value={form.jumlah_kk}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Jumlah RT */}
              <div>
                <label
                  htmlFor="jumlah_rt"
                  className="text-sm font-semibold text-gray-900"
                >
                  Jumlah RT
                </label>

                <input
                  id="jumlah_rt"
                  name="jumlah_rt"
                  type="number"
                  min="0"
                  value={form.jumlah_rt}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              {/* Jumlah RW */}
              <div>
                <label
                  htmlFor="jumlah_rw"
                  className="text-sm font-semibold text-gray-900"
                >
                  Jumlah RW
                </label>

                <input
                  id="jumlah_rw"
                  name="jumlah_rw"
                  type="number"
                  min="0"
                  value={form.jumlah_rw}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

            </div>
          </div>

          {/* ==================== BUTTON ==================== */}

          <div className="mt-8 flex justify-between border-t border-gray-100 pt-6">

            <Link
              href="/admin"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
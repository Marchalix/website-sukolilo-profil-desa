"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Save,
  Users,
} from "lucide-react";

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
  // LOGO
  // =========================
  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

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

          setLogo(data.data.logo || "");
          setLogoPreview(data.data.logo || "");
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
  // HANDLE INPUT
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
  // PILIH LOGO
  // =========================
  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  // =========================
  // UPLOAD LOGO
  // =========================
  const handleUploadLogo = async () => {
    if (!logoFile) {
      setError("Pilih logo terlebih dahulu.");
      return;
    }

    setUploadingLogo(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("logo", logoFile);

      const response = await fetch("/api/logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Gagal mengupload logo"
        );
      }

      setLogo(data.data.logo);
      setLogoPreview(data.data.logo);
      setLogoFile(null);

      setMessage("Logo berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengupload logo"
      );
    } finally {
      setUploadingLogo(false);
    }
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
      <main className="min-h-screen bg-[#f7f8f6]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

            <p className="mt-4 text-sm text-gray-500">
              Memuat data profil...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* BRAND */}
          <div className="flex items-center gap-3">

            {/* LOGO DESA */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">

              {logo ? (
                <img
                  src={logo}
                  alt="Logo Desa Sukolilo"
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-xs font-bold text-green-700">
                  DS
                </span>
              )}

            </div>

            {/* TEXT BRAND */}
            <div>
              <p className="text-sm font-bold text-gray-900">
                Desa Sukolilo
              </p>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>

          </div>

          {/* PREVIEW */}
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-green-200 hover:text-green-700 sm:flex"
          >
            Lihat Website
          </Link>

        </div>
      </header>

      {/* ==================== CONTENT ==================== */}
      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* BREADCRUMB */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        {/* PAGE HEADER */}
        <div className="mt-6">

          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            <BookOpen className="h-4 w-4" />
            Content Management
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Profil Desa
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Kelola informasi utama mengenai Desa Sukolilo.
          </p>

        </div>

        {/* ==================== FORM ==================== */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-6"
        >

          {/* ==================== MESSAGE ==================== */}
          {message && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* ==================== LOGO DESA ==================== */}
          <div className="mb-8 border-b border-gray-100 pb-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Logo Desa
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gunakan logo resmi Desa Sukolilo. Format JPG, PNG, atau
              WEBP, maksimal 2 MB.
            </p>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* PREVIEW LOGO */}
              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Desa Sukolilo"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="text-center text-xs text-gray-400">
                    Belum ada logo
                  </div>
                )}

              </div>

              {/* PILIH & SIMPAN */}
              <div>

                <label
                  htmlFor="logo"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-700 hover:text-green-700"
                >
                  Pilih Logo
                </label>

                <input
                  id="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {logoFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    {logoFile.name}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleUploadLogo}
                  disabled={!logoFile || uploadingLogo}
                  className="mt-3 block rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadingLogo
                    ? "Mengupload..."
                    : "Simpan Logo"}
                </button>

              </div>

            </div>

          </div>

          {/* ==================== INFORMASI UTAMA ==================== */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Informasi Utama
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Sejarah, visi, misi, dan kepala desa.
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-6 p-6">

              {/* SEJARAH */}
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
                  placeholder="Masukkan sejarah Desa Sukolilo..."
                  className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* VISI */}
              <div>
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
                  placeholder="Masukkan visi desa..."
                  className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* MISI */}
              <div>
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
                  placeholder="Masukkan misi desa..."
                  className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* KEPALA DESA */}
              <div>
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
                  placeholder="Masukkan nama kepala desa..."
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

          </div>

          {/* ==================== DATA KEPENDUDUKAN ==================== */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Data Kependudukan
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Masukkan jumlah penduduk dan pembagian wilayah.
                  </p>
                </div>

              </div>

            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">

              {/* PENDUDUK */}
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* KK */}
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* RT */}
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* RW */}
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
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

          </div>

          {/* ==================== BUTTON ==================== */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <Link
              href="/admin"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
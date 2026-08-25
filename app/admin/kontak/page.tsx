"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

type Kontak = {
  alamat: string;
  telepon: string;
  email: string;
  jam_pelayanan: string;
  latitude: number | null;
  longitude: number | null;
};

const kontakAwal: Kontak = {
  alamat: "",
  telepon: "",
  email: "",
  jam_pelayanan: "",
  latitude: null,
  longitude: null,
};

export default function AdminKontakPage() {
  const [form, setForm] = useState<Kontak>(kontakAwal);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOGO
  // =========================
  const [logo, setLogo] = useState("");

  // =========================
  // AMBIL DATA KONTAK + LOGO
  // =========================
  useEffect(() => {
    const ambilData = async () => {
      try {
        // Ambil kontak
        const responseKontak = await fetch("/api/kontak");
        const dataKontak = await responseKontak.json();

        if (!responseKontak.ok) {
          throw new Error(
            dataKontak.message || "Gagal mengambil data kontak"
          );
        }

        if (dataKontak.data) {
          setForm({
            alamat: dataKontak.data.alamat || "",
            telepon: dataKontak.data.telepon || "",
            email: dataKontak.data.email || "",
            jam_pelayanan:
              dataKontak.data.jam_pelayanan || "",
            latitude:
              dataKontak.data.latitude !== null
                ? Number(dataKontak.data.latitude)
                : null,
            longitude:
              dataKontak.data.longitude !== null
                ? Number(dataKontak.data.longitude)
                : null,
          });
        }

        // Ambil logo
        const responseProfil = await fetch("/api/profil");
        const dataProfil = await responseProfil.json();

        if (
          responseProfil.ok &&
          dataProfil.data?.logo
        ) {
          setLogo(dataProfil.data.logo);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data"
        );
      } finally {
        setLoading(false);
      }
    };

    ambilData();
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
      [name]:
        name === "latitude" ||
        name === "longitude"
          ? value === ""
            ? null
            : Number(value)
          : value,
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
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/kontak", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menyimpan kontak"
        );
      }

      setMessage("Kontak berhasil disimpan.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kontak"
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
              Memuat data kontak...
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

          <div className="flex items-center gap-3">

            {/* LOGO DESA */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
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

            <div>
              <p className="text-sm font-bold text-gray-900">
                Desa Sukolilo
              </p>

              <p className="text-xs text-gray-500">
                Admin Panel
              </p>
            </div>

          </div>

          <Link
            href="/kontak"
            target="_blank"
            className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:border-green-200 hover:text-green-700 sm:flex"
          >
            <MapPin className="h-4 w-4" />
            Lihat Kontak
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
            <MapPin className="h-4 w-4" />
            Content Management
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Kontak Desa
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Kelola alamat, informasi kontak, jam pelayanan,
            dan lokasi Kantor Desa Sukolilo.
          </p>

        </div>

        {/* ==================== FORM ==================== */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-6"
        >

          {/* MESSAGE */}
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

          {/* ==================== INFORMASI KONTAK ==================== */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Informasi Kontak
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Informasi yang dapat digunakan masyarakat
                    untuk menghubungi desa.
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-6 p-6">

              {/* ALAMAT */}
              <div>

                <label
                  htmlFor="alamat"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                >
                  <MapPin className="h-4 w-4 text-green-700" />
                  Alamat
                </label>

                <textarea
                  id="alamat"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Masukkan alamat Kantor Desa Sukolilo..."
                  className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />

              </div>

              {/* TELEPON + EMAIL */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="telepon"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <Phone className="h-4 w-4 text-green-700" />
                    Nomor Telepon
                  </label>

                  <input
                    id="telepon"
                    name="telepon"
                    type="text"
                    value={form.telepon}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: 081234567890"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <div>

                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                  >
                    <Mail className="h-4 w-4 text-green-700" />
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: desa@sukolilo.id"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                </div>

              </div>

              {/* JAM PELAYANAN */}
              <div>

                <label
                  htmlFor="jam_pelayanan"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900"
                >
                  <Clock3 className="h-4 w-4 text-green-700" />
                  Jam Pelayanan
                </label>

                <input
                  id="jam_pelayanan"
                  name="jam_pelayanan"
                  type="text"
                  value={form.jam_pelayanan}
                  onChange={handleChange}
                  placeholder="Contoh: Senin - Jumat, 08.00 - 15.00"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />

              </div>

            </div>

          </div>

          {/* ==================== LOKASI ==================== */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Lokasi Kantor Desa
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Masukkan koordinat untuk menentukan lokasi
                    pada Google Maps.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="grid gap-5 sm:grid-cols-2">

                {/* LATITUDE */}
                <div>

                  <label
                    htmlFor="latitude"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Latitude
                  </label>

                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0000001"
                    value={form.latitude ?? ""}
                    onChange={handleChange}
                    placeholder="Contoh: -7.1234567"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Contoh: -7.1234567
                  </p>

                </div>

                {/* LONGITUDE */}
                <div>

                  <label
                    htmlFor="longitude"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Longitude
                  </label>

                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0000001"
                    value={form.longitude ?? ""}
                    onChange={handleChange}
                    placeholder="Contoh: 112.1234567"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Contoh: 112.1234567
                  </p>

                </div>

              </div>

              {/* INFO */}
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                Pastikan latitude dan longitude sesuai dengan
                lokasi Kantor Desa. Koordinat ini akan digunakan
                untuk menampilkan lokasi pada Google Maps.
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
              {saving ? "Menyimpan..." : "Simpan Kontak"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
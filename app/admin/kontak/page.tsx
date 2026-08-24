"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  // AMBIL DATA KONTAK
  // =========================
  useEffect(() => {
    const ambilKontak = async () => {
      try {
        const response = await fetch("/api/kontak");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data kontak"
          );
        }

        if (data.data) {
          setForm({
            alamat: data.data.alamat || "",
            telepon: data.data.telepon || "",
            email: data.data.email || "",
            jam_pelayanan: data.data.jam_pelayanan || "",
            latitude:
              data.data.latitude !== null
                ? Number(data.data.latitude)
                : null,
                longitude:
              data.data.longitude !== null
                ? Number(data.data.longitude)
                : null,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data kontak"
        );
      } finally {
        setLoading(false);
      }
    };

    ambilKontak();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "latitude" || name === "longitude"
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
      <main className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">
            Memuat data kontak...
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
            Kelola Kontak Desa
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola alamat dan informasi kontak Desa Sukolilo.
          </p>

        </div>
      </header>

      {/* FORM */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
        >

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

          {/* ALAMAT */}
          <div>
            <label
              htmlFor="alamat"
              className="text-sm font-semibold text-gray-900"
            >
              Alamat
            </label>

            <textarea
              id="alamat"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows={4}
              required
              className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Masukkan alamat Kantor Desa Sukolilo..."
            />
          </div>

          {/* TELEPON & EMAIL */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="telepon"
                className="text-sm font-semibold text-gray-900"
              >
                Nomor Telepon
              </label>

              <input
                id="telepon"
                name="telepon"
                type="text"
                value={form.telepon}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Contoh: 081234567890"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-900"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Contoh: desa@sukolilo.id"
              />
            </div>

          </div>

          {/* JAM PELAYANAN */}
          <div className="mt-6">
            <label
              htmlFor="jam_pelayanan"
              className="text-sm font-semibold text-gray-900"
            >
              Jam Pelayanan
            </label>

            <input
              id="jam_pelayanan"
              name="jam_pelayanan"
              type="text"
              value={form.jam_pelayanan}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Contoh: Senin - Jumat, 08.00 - 15.00"
            />
          </div>

          {/* LATITUDE */}
          <div className="mt-6">
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
              step="0.000001"
              value={form.latitude ?? ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Contoh: -7.123456"
            />

            <p className="mt-2 text-xs text-gray-500">
              Kosongkan jika belum memiliki koordinat.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
                Longitude
            </label>

            <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude ?? ""}
                onChange={handleChange}
                placeholder="Contoh: 112.123456"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
            />
            </div>

          {/* BUTTON */}
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
              {saving ? "Menyimpan..." : "Simpan Kontak"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}
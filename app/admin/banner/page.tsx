"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BannerAdminPage() {
  const [gambar, setGambar] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBanner = async () => {
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();

      if (data?.gambar) {
        setGambar(data.gambar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] || null;

    setFile(selectedFile);
    setMessage("");

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("gambar", file);

      const res = await fetch("/api/banner", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Gagal memperbarui banner.");
        return;
      }

      setMessage("Banner berhasil diperbarui.");

      setFile(null);
      setPreview("");

      await fetchBanner();
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat memperbarui banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Link
            href="/admin"
            className="mb-4 inline-block text-sm font-medium text-gray-600 hover:text-green-600"
        >
            ← Kembali
        </Link>

        <h1 className="text-2xl font-bold text-gray-800">
            Banner Website
        </h1>
        
      <p className="mt-1 text-sm text-gray-500">
        Gambar ini digunakan sebagai banner pada seluruh halaman website.
      </p>

      <div className="mt-6 max-w-4xl rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Banner Saat Ini
        </h2>

        {gambar && (
          <img
            src={gambar}
            alt="Banner saat ini"
            className="h-64 w-full rounded-lg object-cover"
          />
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ganti Banner
          </label>

          {/* Input asli disembunyikan */}
            <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-100 text-sm text-gray-700
                file:mr-4
                file:border-0
                file:bg-gray-200
                file:px-4
                file:py-2.5
                file:text-sm
                file:font-medium
                file:text-gray-700
                hover:file:bg-gray-300"
            />

          {/* Nama file */}
          {file ? (
            <p className="mt-3 text-sm text-gray-600">
              ✓ Gambar dipilih: <span className="font-medium">{file.name}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-gray-400">
              Belum ada gambar yang dipilih
            </p>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Preview Gambar Baru
              </p>

              <img
                src={preview}
                alt="Preview banner baru"
                className="h-64 w-full rounded-lg object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Banner"}
          </button>

          {message && (
            <p className="mt-3 text-sm text-gray-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
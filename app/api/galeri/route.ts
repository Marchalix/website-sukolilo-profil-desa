import db from "@/lib/db";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        judul,
        gambar,
        kategori,
        keterangan,
        tanggal
      FROM galeri
      ORDER BY tanggal DESC, id DESC`
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data galeri",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const judul = formData.get("judul") as string;
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;
    const tanggal = formData.get("tanggal") as string;

    const gambar = formData.get("gambar");

    // =========================
    // VALIDASI
    // =========================

    if (!judul || !kategori || !keterangan || !tanggal) {
      return Response.json(
        {
          success: false,
          message: "Semua data wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!(gambar instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Gambar wajib dipilih",
        },
        { status: 400 }
      );
    }

    // =========================
    // SIMPAN GAMBAR
    // =========================

    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = path.extname(gambar.name);

    const namaFile = `${Date.now()}-${gambar.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")}`;

    const folderUpload = path.join(
      process.cwd(),
      "public",
      "uploads",
      "galeri"
    );

    await mkdir(folderUpload, {
      recursive: true,
    });

    const lokasiFile = path.join(
      folderUpload,
      namaFile
    );

    await writeFile(lokasiFile, buffer);

    // =========================
    // SIMPAN KE DATABASE
    // =========================

    await db.query(
      `INSERT INTO galeri
      (
        judul,
        gambar,
        kategori,
        keterangan,
        tanggal
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        judul,
        namaFile,
        kategori,
        keterangan,
        tanggal,
      ]
    );

    return Response.json({
      success: true,
      message: "Galeri berhasil ditambahkan",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal menambahkan galeri",
      },
      { status: 500 }
    );
  }
}
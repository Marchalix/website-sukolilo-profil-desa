import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// =========================
// GET SEMUA BERITA
// =========================
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        judul,
        slug,
        kategori,
        tanggal,
        gambar,
        ringkasan,
        isi,
        status
      FROM berita
      ORDER BY tanggal DESC, id DESC`
    );

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET BERITA ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data berita",
      },
      { status: 500 }
    );
  }
}

// =========================
// TAMBAH BERITA
// =========================
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const judul = formData.get("judul") as string;
    const slug = formData.get("slug") as string;
    const kategori = formData.get("kategori") as string;
    const tanggal = formData.get("tanggal") as string;
    const ringkasan = formData.get("ringkasan") as string;
    const isi = formData.get("isi") as string;
    const status = formData.get("status") as string;

    const gambar = formData.get("gambar");

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
    // SIMPAN FILE GAMBAR
    // =========================

    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = path.extname(gambar.name);
    const namaFile = `${Date.now()}-${slug}${extension}`;

    const folderUpload = path.join(
      process.cwd(),
      "public",
      "uploads",
      "berita"
    );

    await mkdir(folderUpload, { recursive: true });

    const lokasiFile = path.join(
      folderUpload,
      namaFile
    );

    await writeFile(lokasiFile, buffer);

    // =========================
    // SIMPAN DATA KE DATABASE
    // =========================

    await db.query(
      `INSERT INTO berita
      (
        judul,
        slug,
        kategori,
        tanggal,
        gambar,
        ringkasan,
        isi,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul,
        slug,
        kategori,
        tanggal,
        namaFile,
        ringkasan,
        isi,
        status,
      ]
    );

    return Response.json({
      success: true,
      message: "Berita berhasil ditambahkan",
    });
  } catch (error) {
    console.error("POST BERITA ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan berita",
      },
      { status: 500 }
    );
  }
}
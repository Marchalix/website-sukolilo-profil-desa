import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET 1 BERITA
// =========================
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

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
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    const data = rows as any[];

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: data[0],
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
// UPDATE BERITA
// =========================
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const judul = formData.get("judul") as string;
    const slug = formData.get("slug") as string;
    const kategori = formData.get("kategori") as string;
    const tanggal = formData.get("tanggal") as string;
    const ringkasan = formData.get("ringkasan") as string;
    const isi = formData.get("isi") as string;
    const status = formData.get("status") as string;

    const gambar = formData.get("gambar");

    // =========================
    // AMBIL DATA LAMA
    // =========================

    const [rows] = await db.query(
      "SELECT gambar FROM berita WHERE id = ? LIMIT 1",
      [id]
    );

    const dataLama = rows as any[];

    if (dataLama.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }

    let namaFile = dataLama[0].gambar;

    // =========================
    // JIKA ADA GAMBAR BARU
    // =========================

    if (gambar instanceof File && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const extension = path.extname(gambar.name);

      namaFile = `${Date.now()}-${slug}${extension}`;

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
    }

    // =========================
    // UPDATE DATABASE
    // =========================

    await db.query(
      `UPDATE berita
       SET
         judul = ?,
         slug = ?,
         kategori = ?,
         tanggal = ?,
         gambar = ?,
         ringkasan = ?,
         isi = ?,
         status = ?
       WHERE id = ?`,
      [
        judul,
        slug,
        kategori,
        tanggal,
        namaFile,
        ringkasan,
        isi,
        status,
        id,
      ]
    );

    return Response.json({
      success: true,
      message: "Berita berhasil diperbarui",
    });
  } catch (error) {
    console.error("UPDATE BERITA ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui berita",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE BERITA
// =========================
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    await db.query(
      "DELETE FROM berita WHERE id = ?",
      [id]
    );

    return Response.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE BERITA ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghapus berita",
      },
      { status: 500 }
    );
  }
}
import db from "@/lib/db";
import { unlink, writeFile } from "fs/promises";
import path from "path";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

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
        gambar,
        kategori,
        keterangan,
        tanggal
      FROM galeri
      WHERE id = ?`,
      [id]
    );

    const data = rows as any[];

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Galeri tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: data[0],
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

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const judul = formData.get("judul") as string;
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;
    const tanggal = formData.get("tanggal") as string;

    const gambar = formData.get("gambar");

    if (!judul || !kategori || !keterangan || !tanggal) {
      return Response.json(
        {
          success: false,
          message: "Semua data wajib diisi",
        },
        { status: 400 }
      );
    }

    // Ambil gambar lama
    const [rows] = await db.query(
      "SELECT gambar FROM galeri WHERE id = ?",
      [id]
    );

    const data = rows as { gambar: string }[];

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Galeri tidak ditemukan",
        },
        { status: 404 }
      );
    }

    let namaFile = data[0].gambar;

    // Jika user memilih gambar baru
    if (gambar instanceof File && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const namaBaru = `${Date.now()}-${gambar.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "")}`;

      const folderUpload = path.join(
        process.cwd(),
        "public",
        "uploads",
        "galeri"
      );

      const lokasiFileBaru = path.join(
        folderUpload,
        namaBaru
      );

      await writeFile(lokasiFileBaru, buffer);

      // Hapus gambar lama
      if (namaFile) {
        const lokasiFileLama = path.join(
          folderUpload,
          namaFile
        );

        try {
          await unlink(lokasiFileLama);
        } catch {
          // File lama tidak ditemukan, lanjutkan saja
        }
      }

      namaFile = namaBaru;
    }

    await db.query(
      `UPDATE galeri
       SET
        judul = ?,
        gambar = ?,
        kategori = ?,
        keterangan = ?,
        tanggal = ?
       WHERE id = ?`,
      [
        judul,
        namaFile,
        kategori,
        keterangan,
        tanggal,
        id,
      ]
    );

    return Response.json({
      success: true,
      message: "Galeri berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui galeri",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    // Ambil nama gambar terlebih dahulu
    const [rows] = await db.query(
      "SELECT gambar FROM galeri WHERE id = ?",
      [id]
    );

    const data = rows as { gambar: string }[];

    if (data.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Galeri tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const namaFile = data[0].gambar;

    // Hapus data dari database
    await db.query(
      "DELETE FROM galeri WHERE id = ?",
      [id]
    );

    // Hapus file gambar
    if (namaFile) {
      const lokasiFile = path.join(
        process.cwd(),
        "public",
        "uploads",
        "galeri",
        namaFile
      );

      try {
        await unlink(lokasiFile);
      } catch {
        // Kalau file sudah tidak ada, tetap lanjut
      }
    }

    return Response.json({
      success: true,
      message: "Galeri berhasil dihapus",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus galeri",
      },
      { status: 500 }
    );
  }
}
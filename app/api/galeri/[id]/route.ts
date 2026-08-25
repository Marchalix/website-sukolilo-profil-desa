import db from "@/lib/db";
import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  uploadToS3,
  deleteFromS3,
  getS3Url,
} from "@/lib/s3";

export const runtime = "nodejs";

const useS3 =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET GALERI BY ID
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

    const galeri = data[0];

    if (galeri.gambar && useS3) {
      try {
        galeri.gambar = await getS3Url(galeri.gambar);
      } catch (error) {
        console.error(
          "GAGAL MEMBUAT URL GAMBAR GALERI:",
          error
        );
      }
    } else if (galeri.gambar) {
      galeri.gambar = `/uploads/galeri/${galeri.gambar}`;
    }

    return Response.json({
      success: true,
      data: galeri,
    });
  } catch (error) {
    console.error("GET GALERI BY ID ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data galeri",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE GALERI
// =========================
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

    // =========================
    // AMBIL GAMBAR LAMA
    // =========================
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

    // =========================
    // JIKA ADA GAMBAR BARU
    // =========================
    if (gambar instanceof File && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const extension =
        path.extname(gambar.name).toLowerCase() || ".jpg";

      const namaBaru = `${Date.now()}-${gambar.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "")}`;

      // =========================
      // STORAGE RAILWAY
      // =========================
      if (useS3) {
        await uploadToS3(
          namaBaru,
          buffer,
          gambar.type || "image/jpeg"
        );

        // Hapus gambar lama dari Storage
        if (namaFile) {
          try {
            await deleteFromS3(namaFile);
          } catch (error) {
            console.error(
              "GAGAL MENGHAPUS GAMBAR LAMA DARI STORAGE:",
              error
            );
          }
        }
      }

      // =========================
      // FALLBACK LOCAL
      // =========================
      else {
        const folderUpload = path.join(
          process.cwd(),
          "public",
          "uploads",
          "galeri"
        );

        await mkdir(folderUpload, {
          recursive: true,
        });

        const lokasiFileBaru = path.join(
          folderUpload,
          namaBaru
        );

        await writeFile(
          lokasiFileBaru,
          buffer
        );

        // Hapus gambar lama
        if (namaFile) {
          const lokasiFileLama = path.join(
            folderUpload,
            namaFile
          );

          try {
            await unlink(lokasiFileLama);
          } catch {
            // File lama tidak ditemukan
          }
        }
      }

      namaFile = namaBaru;
    }

    // =========================
    // UPDATE DATABASE
    // =========================
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
      message: useS3
        ? "Galeri berhasil diperbarui dan gambar disimpan ke Storage."
        : "Galeri berhasil diperbarui.",
    });
  } catch (error) {
    console.error("UPDATE GALERI ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui galeri",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE GALERI
// =========================
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    // =========================
    // AMBIL GAMBAR
    // =========================
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

    // =========================
    // HAPUS FILE
    // =========================
    if (namaFile) {
      if (useS3) {
        try {
          await deleteFromS3(namaFile);
        } catch (error) {
          console.error(
            "GAGAL MENGHAPUS GAMBAR DARI STORAGE:",
            error
          );
        }
      } else {
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
          // File sudah tidak ada
        }
      }
    }

    // =========================
    // HAPUS DATABASE
    // =========================
    await db.query(
      "DELETE FROM galeri WHERE id = ?",
      [id]
    );

    return Response.json({
      success: true,
      message: "Galeri berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE GALERI ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus galeri",
      },
      { status: 500 }
    );
  }
}
import db from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { uploadToS3, deleteFromS3, getS3Url } from "@/lib/s3";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const useS3 =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

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

    if (data.length > 0 && data[0].gambar && useS3) {
      data[0].gambar = await getS3Url(data[0].gambar);
    } else if (data.length > 0 && data[0].gambar) {
      data[0].gambar = `/uploads/berita/${data[0].gambar}`;
    }

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

  const extension =
    path.extname(gambar.name).toLowerCase() || ".jpg";

  namaFile = `${Date.now()}-${slug}${extension}`;

  if (useS3) {
    await uploadToS3(
      namaFile,
      buffer,
      gambar.type || "image/jpeg"
    );

    if (dataLama[0].gambar) {
        try {
          await deleteFromS3(dataLama[0].gambar);
        } catch (error) {
          console.error("GAGAL HAPUS GAMBAR LAMA:", error);
        }
      }
    } else {
      const folderUpload = path.join(
        process.cwd(),
        "public",
        "uploads",
        "berita"
      );

      await mkdir(folderUpload, {
        recursive: true,
      });

      await writeFile(
        path.join(folderUpload, namaFile),
        buffer
      );

      if (dataLama[0].gambar) {
        try {
          await unlink(
            path.join(
              folderUpload,
              dataLama[0].gambar
            )
          );
        } catch {
          // File lama tidak ditemukan.
        }
      }
    }
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

    const [rows] = await db.query(
      "SELECT gambar FROM berita WHERE id = ? LIMIT 1",
      [id]
    );

    const berita = (rows as any[])[0];

    if (!berita) {
      return Response.json(
        {
          success: false,
          message: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM berita WHERE id = ?",
      [id]
    );

    if (berita.gambar) {
      if (useS3) {
        try {
          await deleteFromS3(berita.gambar);
        } catch (error) {
          console.error(
            "GAGAL HAPUS GAMBAR S3:",
            error
          );
        }
      } else {
        try {
          await unlink(
            path.join(
              process.cwd(),
              "public",
              "uploads",
              "berita",
              berita.gambar
            )
          );
        } catch {
          // File tidak ditemukan.
        }
      }
    }

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
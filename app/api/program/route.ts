import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToS3 } from "@/lib/s3";

export const runtime = "nodejs";

const useS3 =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        nama,
        deskripsi,
        gambar,
        detail,
        status,
        urutan
      FROM program
      ORDER BY urutan ASC, id ASC`
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
        message: "Gagal mengambil data program",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nama = String(formData.get("nama") || "");
    const deskripsi = String(formData.get("deskripsi") || "");
    const detail = String(formData.get("detail") || "");
    const status = String(formData.get("status") || "published");

    const urutanInput = Number(formData.get("urutan"));

    if (!nama || !deskripsi || !detail) {
      return Response.json(
        {
          success: false,
          message: "Data program belum lengkap",
        },
        { status: 400 }
      );
    }

    // =========================
    // HITUNG URUTAN BARU
    // =========================

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM program`
    );

    const total = Number(
      (countRows as { total: number }[])[0].total
    );

    let urutan = urutanInput;

    if (!urutan || urutan < 1) {
      urutan = total + 1;
    }

    if (urutan > total + 1) {
      urutan = total + 1;
    }

    // Geser data lama
    await db.query(
      `UPDATE program
       SET urutan = urutan + 1
       WHERE urutan >= ?`,
      [urutan]
    );

    // =========================
    // UPLOAD GAMBAR
    // =========================

    const gambar = formData.get("gambar");

    let namaFile = null;

    if (gambar instanceof File && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const extension = path.extname(gambar.name);

      namaFile = `${Date.now()}-${nama
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}${extension}`;

      if (useS3) {
        await uploadToS3(
          namaFile,
          buffer,
          gambar.type || "image/jpeg"
        );
      } else {
        const folderUpload = path.join(
          process.cwd(),
          "public",
          "uploads",
          "program"
        );

        await mkdir(folderUpload, {
          recursive: true,
        });

        await writeFile(
          path.join(folderUpload, namaFile),
          buffer
        );
      }
    }

    // =========================
    // SIMPAN PROGRAM
    // =========================

    await db.query(
      `INSERT INTO program
      (
        nama,
        deskripsi,
        gambar,
        detail,
        status,
        urutan
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nama,
        deskripsi,
        namaFile,
        detail,
        status,
        urutan,
      ]
    );

    return Response.json({
      success: true,
      message: "Program berhasil ditambahkan",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal menambahkan program",
      },
      { status: 500 }
    );
  }
}
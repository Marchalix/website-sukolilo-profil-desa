import db from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
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
// GET PROGRAM
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
        nama,
        deskripsi,
        gambar,
        detail,
        status,
        urutan
      FROM program
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    const program = (rows as any[])[0];

    if (!program) {
      return Response.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

      let gambarUrl = program.gambar;

      if (program.gambar && useS3) {
        try {
          gambarUrl = await getS3Url(program.gambar);
        } catch (error) {
          console.error("GAGAL MEMBUAT URL GAMBAR PROGRAM:", error);
        }
      } else if (program.gambar) {
        gambarUrl = `/uploads/program/${program.gambar}`;
      }

      return Response.json({
        success: true,
        data: {
          ...program,
          gambar: gambarUrl,
        },
      });

  } catch (error) {
    console.error("GET PROGRAM ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data program",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE PROGRAM
// =========================

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const nama = String(formData.get("nama") || "");
    const deskripsi = String(formData.get("deskripsi") || "");
    const detail = String(formData.get("detail") || "");
    const status = String(formData.get("status") || "published");
    const urutan = Number(formData.get("urutan") || 0);

    const gambar = formData.get("gambar");

    // =========================
    // CEK PROGRAM LAMA
    // =========================

    const [rows] = await db.query(
      `SELECT
        id,
        gambar
      FROM program
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    const programLama = (rows as any[])[0];

    if (!programLama) {
      return Response.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // =========================
    // TANPA GANTI GAMBAR
    // =========================

    if (!(gambar instanceof File) || gambar.size === 0) {

      await db.query(
        `UPDATE program
        SET
          nama = ?,
          deskripsi = ?,
          detail = ?,
          status = ?,
          urutan = ?
        WHERE id = ?`,
        [
          nama,
          deskripsi,
          detail,
          status,
          urutan,
          id,
        ]
      );

      return Response.json({
        success: true,
        message: "Program berhasil diperbarui",
      });
    }

    // =========================
    // GANTI GAMBAR
    // =========================

    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = path.extname(gambar.name);

    const namaFile = `${Date.now()}-${nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}${extension}`;

    if (useS3) {
      await uploadToS3(
        namaFile,
        buffer,
        gambar.type || "image/jpeg"
      );

      if (programLama.gambar) {
        try {
          await deleteFromS3(programLama.gambar);
        } catch (error) {
          console.error(
            "GAGAL MENGHAPUS GAMBAR PROGRAM LAMA:",
            error
          );
        }
      }
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

    // =========================
    // UPDATE DATABASE
    // =========================

    await db.query(
      `UPDATE program
      SET
        nama = ?,
        deskripsi = ?,
        gambar = ?,
        detail = ?,
        status = ?,
        urutan = ?
      WHERE id = ?`,
      [
        nama,
        deskripsi,
        namaFile,
        detail,
        status,
        urutan,
        id,
      ]
    );

    // =========================
    // HAPUS GAMBAR LAMA
    // =========================

    if (programLama.gambar) {

      const gambarLama = path.join(
        process.cwd(),
        "public",
        "uploads",
        "program",
        programLama.gambar
      );

      try {
        await unlink(gambarLama);
      } catch {
        // File lama tidak ditemukan.
      }
    }

    return Response.json({
      success: true,
      message: "Program berhasil diperbarui",
    });

  } catch (error) {
    console.error("UPDATE PROGRAM ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui program",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE PROGRAM
// =========================

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      `SELECT gambar
       FROM program
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const program = (rows as any[])[0];

    if (!program) {
      return Response.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await db.query(
      `DELETE FROM program WHERE id = ?`,
      [id]
    );

  if (program.gambar) {
    if (useS3) {
      try {
        await deleteFromS3(program.gambar);
      } catch (error) {
        console.error(
          "GAGAL MENGHAPUS GAMBAR PROGRAM:",
          error
        );
      }
    } else {
      const lokasiFile = path.join(
        process.cwd(),
        "public",
        "uploads",
        "program",
        program.gambar
      );

      try {
        await unlink(lokasiFile);
      } catch {
        // File gambar tidak ditemukan.
      }
    }
  }

    return Response.json({
      success: true,
      message: "Program berhasil dihapus",
    });

  } catch (error) {
    console.error("DELETE PROGRAM ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus program",
      },
      { status: 500 }
    );
  }
}
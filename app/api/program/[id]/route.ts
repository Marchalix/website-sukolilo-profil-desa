import db from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

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

    return Response.json({
      success: true,
      data: program,
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

    const folderUpload = path.join(
      process.cwd(),
      "public",
      "uploads",
      "program"
    );

    await mkdir(folderUpload, {
      recursive: true,
    });

    const lokasiFile = path.join(
      folderUpload,
      namaFile
    );

    await writeFile(
      lokasiFile,
      buffer
    );

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
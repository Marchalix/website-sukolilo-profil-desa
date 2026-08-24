import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        nama,
        kategori,
        deskripsi,
        gambar,
        urutan
      FROM potensi
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
        message: "Gagal mengambil data potensi",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nama = formData.get("nama") as string;
    const kategori = formData.get("kategori") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const urutanValue = formData.get("urutan") as string;

    const gambar = formData.get("gambar");

    if (!nama || !kategori || !deskripsi) {
      return Response.json(
        {
          success: false,
          message: "Nama, kategori, dan deskripsi wajib diisi",
        },
        { status: 400 }
      );
    }

    // =========================
    // TENTUKAN URUTAN
    // =========================

    const [maxRows] = await db.query(
      `SELECT MAX(urutan) AS maxUrutan
       FROM potensi`
    );

    const maxUrutan =
      (maxRows as { maxUrutan: number | null }[])[0]
        ?.maxUrutan ?? 0;

    let urutan =
      urutanValue && urutanValue.trim() !== ""
        ? Number(urutanValue)
        : maxUrutan + 1;

    if (!Number.isInteger(urutan) || urutan < 1) {
      return Response.json(
        {
          success: false,
          message: "Urutan harus berupa angka minimal 1",
        },
        { status: 400 }
      );
    }

    // Kalau melebihi jumlah data, taruh di paling bawah
    if (urutan > maxUrutan + 1) {
      urutan = maxUrutan + 1;
    }

    // =========================
    // GESER URUTAN LAMA
    // =========================

    await db.query(
      `UPDATE potensi
       SET urutan = urutan + 1
       WHERE urutan >= ?`,
      [urutan]
    );

    // =========================
    // UPLOAD GAMBAR
    // =========================

    let namaFile: string | null = null;

    if (gambar instanceof File && gambar.size > 0) {
      const extension = path.extname(gambar.name);

      const namaAman = nama
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      namaFile = `${Date.now()}-${namaAman}${extension}`;

      const folderUpload = path.join(
        process.cwd(),
        "public",
        "uploads",
        "potensi"
      );

      await mkdir(folderUpload, {
        recursive: true,
      });

      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(
        path.join(folderUpload, namaFile),
        buffer
      );
    }

    // =========================
    // SIMPAN DATABASE
    // =========================

    await db.query(
      `INSERT INTO potensi
      (nama, kategori, deskripsi, gambar, urutan)
      VALUES (?, ?, ?, ?, ?)`,
      [
        nama,
        kategori,
        deskripsi,
        namaFile,
        urutan,
      ]
    );

    return Response.json({
      success: true,
      message: "Potensi berhasil ditambahkan",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal menambahkan potensi",
      },
      { status: 500 }
    );
  }
}
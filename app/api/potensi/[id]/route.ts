import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET SATU POTENSI
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
        kategori,
        deskripsi,
        gambar,
        urutan
      FROM potensi
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    const data = (rows as any[])[0];

    if (!data) {
      return Response.json(
        {
          success: false,
          message: "Potensi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data,
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

// =========================
// UPDATE POTENSI
// =========================

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

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
    // AMBIL DATA LAMA
    // =========================

    const [rows] = await db.query(
      `SELECT
        gambar,
        urutan
       FROM potensi
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const dataLama = (rows as any[])[0];

    if (!dataLama) {
      return Response.json(
        {
          success: false,
          message: "Potensi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const urutanLama = dataLama.urutan;

    // =========================
    // HITUNG URUTAN BARU
    // =========================

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS jumlah
       FROM potensi
       WHERE id != ?`,
      [id]
    );

    const jumlahLain =
      (countRows as { jumlah: number }[])[0]?.jumlah ?? 0;

    let urutanBaru =
      urutanValue && urutanValue.trim() !== ""
        ? Number(urutanValue)
        : urutanLama;

    if (!Number.isInteger(urutanBaru) || urutanBaru < 1) {
      return Response.json(
        {
          success: false,
          message: "Urutan harus berupa angka minimal 1",
        },
        { status: 400 }
      );
    }

    if (urutanBaru > jumlahLain + 1) {
      urutanBaru = jumlahLain + 1;
    }

    // =========================
    // ATUR ULANG POSISI
    // =========================

    if (urutanLama !== urutanBaru) {

      if (urutanBaru < urutanLama) {
        // Contoh:
        // 1 A
        // 2 B
        // 3 C
        //
        // C pindah ke 1
        //
        // A -> 2
        // B -> 3

        await db.query(
          `UPDATE potensi
           SET urutan = urutan + 1
           WHERE urutan >= ?
           AND urutan < ?
           AND id != ?`,
          [
            urutanBaru,
            urutanLama,
            id,
          ]
        );

      } else {
        // Contoh:
        // 1 A
        // 2 B
        // 3 C
        //
        // A pindah ke 3
        //
        // B -> 1
        // C -> 2

        await db.query(
          `UPDATE potensi
           SET urutan = urutan - 1
           WHERE urutan > ?
           AND urutan <= ?
           AND id != ?`,
          [
            urutanLama,
            urutanBaru,
            id,
          ]
        );
      }
    }

    // =========================
    // GAMBAR
    // =========================

    let namaFile = dataLama.gambar;

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
    // UPDATE DATA
    // =========================

    await db.query(
      `UPDATE potensi
       SET
        nama = ?,
        kategori = ?,
        deskripsi = ?,
        gambar = ?,
        urutan = ?
       WHERE id = ?`,
      [
        nama,
        kategori,
        deskripsi,
        namaFile,
        urutanBaru,
        id,
      ]
    );

    return Response.json({
      success: true,
      message: "Potensi berhasil diperbarui",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui potensi",
      },
      { status: 500 }
    );
  }
}

// =========================
// DELETE POTENSI
// =========================

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    // Ambil urutan data yang akan dihapus
    const [rows] = await db.query(
      `SELECT urutan
       FROM potensi
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const data = (rows as any[])[0];

    if (!data) {
      return Response.json(
        {
          success: false,
          message: "Potensi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const urutanDihapus = data.urutan;

    // Hapus data
    await db.query(
      "DELETE FROM potensi WHERE id = ?",
      [id]
    );

    // Rapikan urutan setelah data dihapus
    if (urutanDihapus !== null) {
      await db.query(
        `UPDATE potensi
         SET urutan = urutan - 1
         WHERE urutan > ?`,
        [urutanDihapus]
      );
    }

    return Response.json({
      success: true,
      message: "Potensi berhasil dihapus",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus potensi",
      },
      { status: 500 }
    );
  }
}
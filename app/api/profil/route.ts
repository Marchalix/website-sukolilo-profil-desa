import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        sejarah,
        visi,
        misi,
        jumlah_penduduk,
        jumlah_kk,
        jumlah_rt,
        jumlah_rw,
        nama_kepala_desa,
        logo
      FROM profil
      LIMIT 1`
    );

    const data =
      Array.isArray(rows) && rows.length > 0
        ? rows[0]
        : null;

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET PROFIL ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data profil",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const sejarah = body.sejarah ?? "";
    const visi = body.visi ?? "";
    const misi = body.misi ?? "";

    const jumlah_penduduk = Number(
      body.jumlah_penduduk || 0
    );

    const jumlah_kk = Number(
      body.jumlah_kk || 0
    );

    const jumlah_rt = Number(
      body.jumlah_rt || 0
    );

    const jumlah_rw = Number(
      body.jumlah_rw || 0
    );

    const nama_kepala_desa =
      body.nama_kepala_desa ?? "";

    const logo =
    body.logo !== undefined
        ? body.logo
        : null;

    // =========================
    // CEK PROFIL
    // =========================

    const [rows] = await db.query(
      "SELECT id FROM profil LIMIT 1"
    );

    const data = rows as { id: number }[];

    // =========================
    // UPDATE JIKA SUDAH ADA
    // =========================

    if (data.length > 0) {
      const id = data[0].id;

        await db.query(
        `UPDATE profil SET
            sejarah = ?,
            visi = ?,
            misi = ?,
            jumlah_penduduk = ?,
            jumlah_kk = ?,
            jumlah_rt = ?,
            jumlah_rw = ?,
            nama_kepala_desa = ?
        WHERE id = ?`,
        [
            sejarah,
            visi,
            misi,
            jumlah_penduduk,
            jumlah_kk,
            jumlah_rt,
            jumlah_rw,
            nama_kepala_desa,
            id,
        ]
        );
    }

    // =========================
    // INSERT JIKA BELUM ADA
    // =========================

    else {
      await db.query(
        `INSERT INTO profil (
          sejarah,
          visi,
          misi,
          jumlah_penduduk,
          jumlah_kk,
          jumlah_rt,
          jumlah_rw,
          nama_kepala_desa,
          logo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sejarah,
          visi,
          misi,
          jumlah_penduduk,
          jumlah_kk,
          jumlah_rt,
          jumlah_rw,
          nama_kepala_desa,
          logo,
        ]
      );
    }

    return Response.json({
      success: true,
      message: "Profil berhasil disimpan",
    });
  } catch (error) {
    console.error("PUT PROFIL ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan profil",
      },
      { status: 500 }
    );
  }
}
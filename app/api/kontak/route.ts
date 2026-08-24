import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        alamat,
        telepon,
        email,
        jam_pelayanan,
        latitude,
        longitude
      FROM kontak
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
    console.error("GET KONTAK ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data kontak",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const alamat = body.alamat ?? "";
    const telepon = body.telepon ?? "";
    const email = body.email ?? "";
    const jam_pelayanan = body.jam_pelayanan ?? "";

    const latitude =
      body.latitude === "" ||
      body.latitude === null ||
      body.latitude === undefined
        ? null
        : Number(body.latitude);

    const longitude =
      body.longitude === "" ||
      body.longitude === null ||
      body.longitude === undefined
        ? null
        : Number(body.longitude);

    const [rows] = await db.query(
      "SELECT id FROM kontak LIMIT 1"
    );

    const data = rows as { id: number }[];

    if (data.length > 0) {
      const id = data[0].id;

      await db.query(
        `UPDATE kontak SET
          alamat = ?,
          telepon = ?,
          email = ?,
          jam_pelayanan = ?,
          latitude = ?,
          longitude = ?
        WHERE id = ?`,
        [
          alamat,
          telepon,
          email,
          jam_pelayanan,
          latitude,
          longitude,
          id,
        ]
      );
    } else {
      await db.query(
        `INSERT INTO kontak (
          id,
          alamat,
          telepon,
          email,
          jam_pelayanan,
          latitude,
          longitude
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          alamat,
          telepon,
          email,
          jam_pelayanan,
          latitude,
          longitude,
        ]
      );
    }

    return Response.json({
      success: true,
      message: "Kontak berhasil disimpan",
    });
  } catch (error) {
    console.error("PUT KONTAK ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan kontak",
      },
      { status: 500 }
    );
  }
}
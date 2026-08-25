import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToS3, getS3Url } from "@/lib/s3";

export const runtime = "nodejs";

// =========================
// CEK STORAGE RAILWAY
// =========================
const useS3 =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

// =========================
// GET SEMUA GALERI
// =========================
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        judul,
        gambar,
        kategori,
        keterangan,
        tanggal
      FROM galeri
      ORDER BY tanggal DESC, id DESC`
    );

    const galeri = await Promise.all(
      (rows as any[]).map(async (item) => {
        let gambarUrl = item.gambar;

        if (item.gambar && useS3) {
          try {
            gambarUrl = await getS3Url(item.gambar);
          } catch (error) {
            console.error(
              "GAGAL MEMBUAT URL GAMBAR GALERI:",
              item.gambar,
              error
            );
          }
        } else if (item.gambar) {
          gambarUrl = `/uploads/galeri/${item.gambar}`;
        }

        return {
          ...item,
          gambar: gambarUrl,
        };
      })
    );

    return Response.json({
      success: true,
      data: galeri,
    });
  } catch (error) {
    console.error("GET GALERI ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data galeri",
      },
      { status: 500 }
    );
  }
}

// =========================
// TAMBAH GALERI
// =========================
export async function POST(request: Request) {
  try {
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

    if (!(gambar instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Gambar wajib dipilih",
        },
        { status: 400 }
      );
    }

    // =========================
    // SIAPKAN FILE GAMBAR
    // =========================
    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension =
      path.extname(gambar.name).toLowerCase() || ".jpg";

    const namaFile = `${Date.now()}-${gambar.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")}`;

    // =========================
    // UPLOAD KE RAILWAY BUCKET
    // =========================
    if (useS3) {
      await uploadToS3(
        namaFile,
        buffer,
        gambar.type || "image/jpeg"
      );
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

      const lokasiFile = path.join(
        folderUpload,
        namaFile
      );

      await writeFile(lokasiFile, buffer);
    }

    // =========================
    // SIMPAN DATA KE DATABASE
    // =========================
    await db.query(
      `INSERT INTO galeri
      (
        judul,
        gambar,
        kategori,
        keterangan,
        tanggal
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        judul,
        namaFile,
        kategori,
        keterangan,
        tanggal,
      ]
    );

    return Response.json({
      success: true,
      message: useS3
        ? "Galeri berhasil ditambahkan dan gambar disimpan ke Storage."
        : "Galeri berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST GALERI ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan galeri",
      },
      { status: 500 }
    );
  }
}
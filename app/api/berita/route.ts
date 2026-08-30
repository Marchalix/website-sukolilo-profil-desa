import db from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToS3, getS3Url } from "@/lib/s3";

export const runtime = "nodejs";

const useS3 =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

// =========================
// GET SEMUA BERITA
// =========================
export async function GET() {
  try {
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
      ORDER BY tanggal DESC, id DESC`
    );

    const berita = await Promise.all(
      (rows as any[]).map(async (item) => {
        let gambarUrl = item.gambar;

        if (item.gambar && useS3) {
          try {
            gambarUrl = await getS3Url(item.gambar);
          } catch (error) {
            console.error("GAGAL MEMBUAT URL GAMBAR:", error);
          }
        } else if (item.gambar) {
          gambarUrl = `/uploads/berita/${item.gambar}`;
        }

        return {
          ...item,
          gambar: gambarUrl,
        };
      })
    );

    return Response.json({
      success: true,
      data: berita,
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
// TAMBAH BERITA
// =========================
export async function POST(request: Request) {
  try {

    const formData = await request.formData();

    const judul = formData.get("judul") as string;
    const slug = formData.get("slug") as string;
    const kategori = formData.get("kategori") as string;
    const tanggal = formData.get("tanggal") as string;
    const ringkasan = formData.get("ringkasan") as string;
    const isi = formData.get("isi") as string;
    const status = formData.get("status") as string;

    const gambar = formData.get("gambar");

    if (!(gambar instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Gambar wajib dipilih",
        },
        { status: 400 }
      );
    }

    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension =
      path.extname(gambar.name).toLowerCase() || ".jpg";

    const namaFile = `${Date.now()}-${slug}${extension}`;

    // =========================
    // SIMPAN KE STORAGE BUCKET
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
        "berita"
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
      `INSERT INTO berita
      (
        judul,
        slug,
        kategori,
        tanggal,
        gambar,
        ringkasan,
        isi,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul,
        slug,
        kategori,
        tanggal,
        namaFile,
        ringkasan,
        isi,
        status,
      ]
    );

    return Response.json({
      success: true,
      message: useS3
        ? "Berita berhasil ditambahkan dan gambar disimpan ke Storage."
        : "Berita berhasil ditambahkan.",
    });
  } catch (error) {
    console.error("POST BERITA ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan berita",
      },
      { status: 500 }
    );
  }
}

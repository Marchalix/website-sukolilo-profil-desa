import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getS3Url, uploadToS3 } from "@/lib/s3";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const hasS3Config =
  !!process.env.AWS_ENDPOINT_URL &&
  !!process.env.AWS_ACCESS_KEY_ID &&
  !!process.env.AWS_SECRET_ACCESS_KEY &&
  !!process.env.AWS_S3_BUCKET_NAME;

// =========================
// GET BANNER
// =========================

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        gambar,
        updated_at
       FROM banner
       WHERE halaman = 'global'
       LIMIT 1`
    );

    const banner = (rows as {
      id: number;
      gambar: string;
      updated_at: string;
    }[])[0];

    if (!banner) {
      return NextResponse.json(null);
    }

    // Gambar lokal dari public/images
    if (banner.gambar.startsWith("/")) {
      return NextResponse.json(banner);
    }

    // Gambar di S3
    if (hasS3Config) {
      return NextResponse.json({
        ...banner,
        gambar: await getS3Url(banner.gambar),
      });
    }

    // Local fallback
    return NextResponse.json({
      ...banner,
      gambar: `/images/${banner.gambar}`,
    });
  } catch (error) {
    console.error("GET BANNER ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengambil data banner" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE BANNER
// =========================

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("gambar");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Gambar belum dipilih" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format gambar harus JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `banner-${Date.now()}.${extension}`;

    let gambarPath = "";

    // =========================
    // PRODUCTION → S3
    // =========================

    if (hasS3Config) {
      const s3Key = `banner/${fileName}`;

      await uploadToS3(
        s3Key,
        buffer,
        file.type
      );

      gambarPath = s3Key;
    }

    // =========================
    // LOCAL → public/images
    // =========================

    else {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "images",
        "banner"
      );

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const filePath = path.join(
        uploadDir,
        fileName
      );

      await fs.writeFile(
        filePath,
        buffer
      );

      gambarPath = `/images/banner/${fileName}`;
    }

    // Update satu-satunya banner global
    await db.query(
      `UPDATE banner
       SET gambar = ?
       WHERE halaman = 'global'`,
      [gambarPath]
    );

    return NextResponse.json({
      message: "Banner berhasil diperbarui",
      gambar: gambarPath,
    });
  } catch (error) {
    console.error("POST BANNER ERROR:", error);

    return NextResponse.json(
      { error: "Gagal memperbarui banner" },
      { status: 500 }
    );
  }
}
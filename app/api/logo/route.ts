import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import db from "@/lib/db";

export async function POST(request: Request) {
  console.log("=== API LOGO TERPANGGIL ===");

  try {
    const formData = await request.formData();

    console.log("=== FORM DATA LOGO DITERIMA ===");

    const file = formData.get("logo") as File | null;

    console.log("FILE:", file?.name);

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File logo wajib dipilih.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK TIPE FILE
    // =========================

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Logo harus berupa JPG, PNG, atau WEBP.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CEK UKURAN FILE
    // Maksimal 2 MB
    // =========================

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran logo maksimal 2 MB.",
        },
        { status: 400 }
      );
    }

    // =========================
    // BUAT NAMA FILE
    // =========================

    const extension =
      file.type === "image/jpeg"
        ? ".jpg"
        : file.type === "image/png"
        ? ".png"
        : ".webp";

    const fileName = `logo-desa-${Date.now()}${extension}`;

    // =========================
    // FOLDER PENYIMPANAN
    // =========================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "logo"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // =========================
    // SIMPAN FILE
    // =========================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await writeFile(filePath, buffer);

    // =========================
    // PATH UNTUK WEBSITE
    // =========================

    const logoPath = `/uploads/logo/${fileName}`;

    // =========================
    // SIMPAN KE DATABASE
    // =========================

    const [rows] = await db.query(
      "SELECT id FROM profil LIMIT 1"
    );

    const data = rows as { id: number }[];

    if (data.length > 0) {
    const id = data[0].id;

    console.log("=== UPDATE LOGO ===");
    console.log("ID PROFIL:", id);
    console.log("LOGO PATH:", logoPath);

    const [updateResult] = await db.query(
        "UPDATE profil SET logo = ? WHERE id = ?",
        [logoPath, id]
    );

    console.log("UPDATE RESULT:", updateResult);
    } else {
      await db.query(
        "INSERT INTO profil (logo) VALUES (?)",
        [logoPath]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Logo berhasil diupload.",
      data: {
        logo: logoPath,
      },
    });
  } catch (error) {
    console.error("UPLOAD LOGO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload logo.",
      },
      { status: 500 }
    );
  }
}
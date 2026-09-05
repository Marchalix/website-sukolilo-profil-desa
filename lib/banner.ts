import db from "@/lib/db";
import { getS3Url } from "@/lib/s3";

export async function getGlobalBannerUrl() {
  try {
    const [rows] = await db.query(
      `SELECT gambar
       FROM banner
       WHERE halaman = 'global'
       LIMIT 1`
    );

    const banner = (rows as { gambar: string }[])[0];

    if (!banner?.gambar) {
      return "/images/gapura-sukolilo.jpg";
    }

    // Kalau masih menggunakan gambar bawaan dari public/images
    if (banner.gambar.startsWith("/")) {
      return banner.gambar;
    }

    // Kalau sudah berupa file di S3
    if (
      process.env.AWS_ENDPOINT_URL &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME
    ) {
      return await getS3Url(banner.gambar);
    }

    return `/images/${banner.gambar}`;
  } catch (error) {
    console.error("GET GLOBAL BANNER ERROR:", error);
    return "/images/gapura-sukolilo.jpg";
  }
}
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { getS3Url } from "@/lib/s3";

type Program = {
  id: number;
  nama: string;
  deskripsi: string;
  gambar: string | null;
  detail: string | null;
  status: string;
  urutan: number | null;
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ProgramDetailPage({ params }: Props) {
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
      AND status = 'published'
    LIMIT 1`,
    [id]
  );

  const program = (rows as Program[])[0];

  if (!program) {
    notFound();
  }

  const gambarUrl =
  program.gambar &&
  process.env.AWS_ENDPOINT_URL &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME
    ? await getS3Url(program.gambar)
    : program.gambar
      ? `/uploads/program/${program.gambar}`
      : null;

  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section
        className="relative flex min-h-[420px] items-center bg-cover bg-center"
        style={{
          backgroundImage: gambarUrl
          ? `url('${gambarUrl}')`
          : "url('/images/gapura-sukolilo.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-green-950/65" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-100">
              Program{" "}
              {program.urutan !== null
                ? String(program.urutan).padStart(2, "0")
                : ""}
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {program.nama}
            </h1>

            <p className="mt-5 text-base leading-7 text-green-50 sm:text-lg">
              {program.deskripsi}
            </p>

          </div>
        </div>
      </section>

      {/* DETAIL */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Tentang Program
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {program.nama}
          </h2>

          <div className="mt-8">
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
              {program.detail || program.deskripsi}
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <a
              href="/program"
              className="text-sm font-semibold text-green-700 transition hover:text-green-900"
            >
              ← Kembali ke Program
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
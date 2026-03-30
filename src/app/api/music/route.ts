import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function GET() {
  const mockMusicData = [
    {
      id: 1,
      title: "Echoes of Tomorrow",
      description: "An experimental track blending ambient textures with driving electronic beats.",
      year: "2026",
      type: "Single",
      link: "https://soundcloud.com",
      gdriveId: "1r_h87rM-wXmKq_3J7R9M7MhJ4b3Q9M" // Contoh ID Google Drive
    },
    {
      id: 2,
      title: "The Silent Cipher",
      description: "A cohesive journey through soundscapes that explore the depths of human emotion.",
      year: "2026",
      type: "Album",
      link: "https://soundcloud.com"
    },
    {
      id: 3,
      title: "Neon Genesis",
      description: "A synth-heavy exploration of futuristic themes and cyberpunk aesthetics.",
      year: "2025",
      type: "EP",
      link: "https://soundcloud.com"
    }
  ];

  // Jika Database aktif, coba ambil data asli
  if (process.env.POSTGRES_URL) {
    try {
      const { rows } = await sql`SELECT * FROM music ORDER BY id DESC`;
      if (rows.length > 0) {
        return NextResponse.json({ success: true, data: rows });
      }
    } catch (e: any) {
      console.log("Postgres connected but table might be empty/missing. Falling back to mock data.");
    }
  }

  // Fallback ke mock data jika konfigurasi DB belum ada / tabel kosong
  return NextResponse.json({ success: true, data: mockMusicData });
}

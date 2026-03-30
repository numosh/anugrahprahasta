"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { initDb } from "@/lib/db";

// Helper for defensive query (returns false if no DB configured)
async function isDbReady() {
  if (!process.env.POSTGRES_URL) return false;
  return true;
}

export async function addMusic(formData: FormData) {
  if (!await isDbReady()) return { error: "POSTGRES_URL is missing. Please link Vercel Postgres." };
  
  try {
    await sql`
      INSERT INTO music (title, description, year, type, link, "youtubeId")
      VALUES (
        ${formData.get("title") as string},
        ${formData.get("description") as string},
        ${formData.get("year") as string},
        ${formData.get("type") as string},
        ${formData.get("link") as string},
        ${formData.get("youtubeId") as string}
      )
    `;
    revalidatePath("/admin");
    revalidatePath("/music");
    return { success: true };
  } catch (e: any) {
    if (e.message.includes('relation "music" does not exist') && !e.message.includes('column')) {
      return { error: "Tabel belum dibuat. Silakan klik Initialize Database." };
    }
    // Menampilkan error asli (misal kesalahan nama kolom)
    return { error: `Internal DB Error: ${e.message}` };
  }
}

export async function deleteMusic(id: number) {
  if (!await isDbReady()) return { error: "No DB" };
  try {
    await sql`DELETE FROM music WHERE id = ${id}`;
    revalidatePath("/admin");
    revalidatePath("/music");
  } catch (e) {}
}

export async function setupDatabase() {
  if (!await isDbReady()) return { error: "POSTGRES_URL is missing. Create Postgres DB on Vercel first." };
  const done = await initDb();
  if (done) return { success: true };
  return { error: "Failed to initialize DB. See server logs." };
}

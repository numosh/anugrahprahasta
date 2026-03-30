"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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
  try {
    await sql`DELETE FROM music WHERE id = ${id}`;
    revalidatePath("/admin");
    revalidatePath("/music");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete music", error);
    return { success: false, error: "Gagal menghapus musik." };
  }
}

export async function addArticle(formData: FormData) {
  const cookieStore = await cookies();
  const password = cookieStore.get("admin_session")?.value;
  if (!password) return { success: false, error: "Unauthorized" };
  
  try {
    await sql`
      INSERT INTO articles (title, excerpt, content, date, link)
      VALUES (
        ${formData.get("title") as string},
        ${formData.get("excerpt") as string},
        ${formData.get("content") as string},
        ${formData.get("date") as string},
        ${formData.get("link") as string}
      )
    `;
    revalidatePath("/admin");
    revalidatePath("/writing");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add article", error);
    return { success: false, error: error.message || "Gagal menambahkan artikel." };
  }
}

export async function deleteArticle(id: number) {
  try {
    await sql`DELETE FROM articles WHERE id = ${id}`;
    revalidatePath("/admin");
    revalidatePath("/writing");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete article", error);
    return { success: false, error: "Gagal menghapus artikel." };
  }
}

export async function setupDatabase() {
  if (!await isDbReady()) return { error: "POSTGRES_URL is missing. Create Postgres DB on Vercel first." };
  const done = await initDb();
  if (done) return { success: true };
  return { error: "Failed to initialize DB. See server logs." };
}

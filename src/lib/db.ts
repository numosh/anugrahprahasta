import { sql } from "@vercel/postgres";

// Fungsi untuk memastikan tabel-tabel database tersedia
export async function initDb() {
  try {
    // Reset tabel untuk memastikan nama kolom ("gdriveId" case-sensitive) terbentuk secara presisi
    await sql`DROP TABLE IF EXISTS music`;
    
    // Membuat tabel music
    await sql`
      CREATE TABLE IF NOT EXISTS music (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        year VARCHAR(10),
        type VARCHAR(50),
        link TEXT,
        "gdriveId" VARCHAR(255)
      );
    `;

    // Membuat tabel articles
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date VARCHAR(50),
        readTime VARCHAR(50),
        link TEXT
      );
    `;
    console.log("Database tables initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database tables:", error);
    return false;
  }
}

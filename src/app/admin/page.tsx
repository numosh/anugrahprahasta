import AdminClientUI from "./AdminClientUI";
import { sql } from "@vercel/postgres";

// Server Component: Fetches live data to pass to Client UI
export default async function AdminPage() {
  let musicData: any[] = [];
  let articlesData: any[] = [];
  
  if (process.env.POSTGRES_URL) {
    try {
      const musicRes = await sql`SELECT * FROM music ORDER BY id DESC`;
      musicData = musicRes.rows;
      
      const articlesRes = await sql`SELECT * FROM articles ORDER BY id DESC`;
      articlesData = articlesRes.rows;
    } catch (e: any) {
      console.log("Database table likely missing or no connection.");
    }
  }

  return (
    <AdminClientUI initialMusic={musicData} initialArticles={articlesData} />
  );
}

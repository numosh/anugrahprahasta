import AdminClientUI from "./AdminClientUI";
import { sql } from "@vercel/postgres";

// Server Component: Fetches live data to pass to Client UI
export default async function AdminPage() {
  let musicData: any[] = [];
  
  if (process.env.POSTGRES_URL) {
    try {
      const { rows } = await sql`SELECT * FROM music ORDER BY id DESC`;
      musicData = rows;
    } catch (e: any) {
      console.log("Database table likely missing or no connection.");
    }
  }

  return (
    <AdminClientUI initialMusic={musicData} />
  );
}

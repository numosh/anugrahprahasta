import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

export async function GET() {
  const mockArticles = [
    {
      id: 1,
      title: "The Frequency of Emotion in Modern Synthesis",
      excerpt: "An in-depth look at how low-frequency oscillations impact our emotional states in electronic compositions.",
      date: "March 30, 2026",
      link: "#"
    }
  ];

  try {
    const { rows } = await sql`SELECT * FROM articles ORDER BY id DESC`;
    
    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: mockArticles });
    }
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.warn("Table articles missing, using mock data");
    return NextResponse.json({ success: true, data: mockArticles });
  }
}

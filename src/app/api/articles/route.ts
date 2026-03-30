import { NextResponse } from 'next/server';

export async function GET() {
  const articlesData = [
    {
      id: 1,
      title: "The Frequency of Emotion in Modern Synthesis",
      description: "An in-depth look at how low-frequency oscillations impact our emotional states in electronic compositions.",
      date: "March 30, 2026",
      readTime: "5 min read",
      link: "/writing"
    },
    {
      id: 2,
      title: "Narrative Structures in Concept Albums",
      description: "Researching the parallel between literary acts and track progression in concept-driven music records.",
      date: "February 14, 2026",
      readTime: "8 min read",
      link: "/writing"
    },
    {
      id: 3,
      title: "Generative AI and the Future of Sound Design",
      description: "Exploring how machine learning models characterize harmonic progressions.",
      date: "January 10, 2026",
      readTime: "12 min read",
      link: "/writing"
    }
  ];

  return NextResponse.json({ success: true, data: articlesData });
}

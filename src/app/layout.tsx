import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Configure premium fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Anugrah Prahasta | Musician & Writer",
  description: "Official portfolio of Anugrah Prahasta. Explore my music releases, videos, writing, and research.",
  keywords: ["Anugrah Prahasta", "Musician", "Writer", "Research", "Portfolio", "Music"],
  openGraph: {
    title: "Anugrah Prahasta | Portfolio",
    description: "Musician, Writer, and Researcher.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Navbar />
        <main className="main-content fade-in">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

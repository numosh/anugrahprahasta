"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import AudioPlayer from "@/components/AudioPlayer";
import ContactForm from "@/components/ContactForm";

interface MusicItem {
  id: number;
  title: string;
  description: string;
  year: string;
  type: string;
  link: string;
  youtubeId?: string;
}

export default function MusicPage() {
  const [music, setMusic] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/music");
        const json = await res.json();
        if (json.success) {
          setMusic(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch music", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className="glow-bg" style={{ top: '20%', right: '10%' }} />
      
      <header className={styles.header}>
        <h1 className="gradient-text fade-in">Sonic Portfolio</h1>
        <p className="text-secondary fade-in" style={{ animationDelay: '0.2s' }}>
          Explore my releases, from ambient singles to concept albums.
        </p>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading frequencies...</div>
      ) : (
        <div className={styles.grid}>
          {music.map((item, index) => (
            <article 
              key={item.id} 
              className={`${styles.item} fade-in`}
              style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            >
              {/* Media First (Dominant) */}
              <div className={styles.mediaWrapper}>
                {item.youtubeId ? (
                  <AudioPlayer youtubeId={item.youtubeId} />
                ) : (
                  <div className={styles.placeholderMedia}>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>No Media Available</span>
                  </div>
                )}
              </div>

              {/* Minimalist Meta & Text Below */}
              <div className={styles.textWrapper}>
                <div className={styles.meta}>
                  <span className={styles.badge}>{item.type}</span>
                  <span className={styles.year}>{item.year}</span>
                </div>
                
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              
            </article>
          ))}
        </div>
      )}

      {/* Menambahkan Contact Form di bawah Music Library karena ini menjadi halaman utama */}
      <div style={{ marginTop: '6rem' }}>
         <ContactForm />
      </div>

    </div>
  );
}

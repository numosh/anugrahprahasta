"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import AudioPlayer from "@/components/AudioPlayer";

interface MusicItem {
  id: number;
  title: string;
  description: string;
  year: string;
  type: string;
  link: string;
  gdriveId?: string;
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
              className={`glass-panel ${styles.card} fade-in`}
              style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{item.type}</span>
                <span className="text-muted">{item.year}</span>
              </div>
              <h2>{item.title}</h2>
              <p className="text-secondary">{item.description}</p>
              
              <div className={styles.cardFooter}>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>
                  View Original
                </a>
              </div>
              
              {/* Dynamic Audio Player injected if gdriveId exists */}
              {item.gdriveId && <AudioPlayer gdriveId={item.gdriveId} />}
              
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

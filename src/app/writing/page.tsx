"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  link: string;
}

export default function WritingPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/articles");
        const json = await res.json();
        if (json.success) {
          setArticles(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className="glow-bg" style={{ top: '10%', left: '0%' }} />
      
      <header className={styles.header}>
        <h1 className="gradient-text fade-in">Research & Writings</h1>
        <p className="text-secondary fade-in" style={{ animationDelay: '0.2s' }}>
          Deep dives into sound design, synthesis, and the emotional impact of music.
        </p>
      </header>

      {loading ? (
        <div className={styles.loading}>Loading intelligence...</div>
      ) : (
        <div className={styles.list}>
          {articles.map((item, index) => (
            <article 
              key={item.id} 
              className={`${styles.articleRow} fade-in`}
              style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
            >
              <div className={styles.articleMeta}>
                <span className={styles.date}>{item.date}</span>
              </div>
              <div className={styles.articleContent}>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
                <Link href={item.link} className={styles.readMore}>
                  Read Article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

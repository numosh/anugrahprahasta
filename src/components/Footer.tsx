import styles from "./Footer.module.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.about}>
          <h3><span className="gradient-text">{siteConfig.name}</span></h3>
          <p className="text-secondary">{siteConfig.description}</p>
        </div>
        <div className={styles.links}>
          <h4>Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/music">Music</Link></li>
            <li><Link href="/writing">Writing</Link></li>
          </ul>
        </div>
        <div className={styles.socials}>
          <h4>Connect</h4>
          <ul>
            <li><a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
            <li><a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

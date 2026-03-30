import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className="gradient-text-accent">Anugrah</span>
          <span>Prahasta</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/music" className={styles.link}>Music</Link>
          <Link href="/writing" className={styles.link}>Writing</Link>
          <a href="#contact" className="btn btn-primary">Contact</a>
        </div>
      </div>
    </nav>
  );
}

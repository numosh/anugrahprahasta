import styles from "./page.module.css";
import Link from "next/link";
import SchemaOrg from "@/components/Schema";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <SchemaOrg />
      
      {/* Background ambient glow */}
      <div className="glow-bg" style={{ top: '-10%', left: '-10%' }} />
      <div className="glow-bg" style={{ bottom: '10%', right: '-10%', filter: 'blur(150px)', opacity: 0.5 }} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="fade-in">
            Crafting Sound.<br />
            <span className="gradient-text-accent">Writing Truths.</span>
          </h1>
          <p className="fade-in" style={{ animationDelay: '0.2s' }}>
            I am Anugrah Prahasta, a musician who translates emotions into frequencies, and a writer passionate about research and storytelling.
          </p>
          <div className={`${styles.ctaGroup} fade-in`} style={{ animationDelay: '0.4s' }}>
            <Link href="/music" className="btn btn-primary">
              Listen to Music
            </Link>
            <Link href="/writing" className="btn btn-glass">
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Music Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Featured <span className="gradient-text">Music</span></h2>
            <Link href="/music" className="btn btn-glass">View All Tracks</Link>
          </div>
          
          <div className={styles.grid}>
            {/* Example Card 1 */}
            <article className={styles.card}>
              <span className={styles.date}>2026 Release</span>
              <h3>Echoes of Tomorrow</h3>
              <p>An experimental track blending ambient textures with driving electronic beats.</p>
              <Link href="/music" className="gradient-text-accent">Listen &rarr;</Link>
            </article>

            {/* Example Card 2 */}
            <article className={styles.card}>
              <span className={styles.date}>Upcoming Album</span>
              <h3>The Silent Cipher</h3>
              <p>A cohesive journey through soundscapes that explore the depths of human emotion.</p>
              <Link href="/music" className="gradient-text-accent">Preview &rarr;</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Featured Writing Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Latest <span className="gradient-text">Research</span></h2>
            <Link href="/writing" className="btn btn-glass">Read All</Link>
          </div>
          
          <div className={styles.grid}>
            <article className={styles.card}>
              <span className={styles.date}>March 30, 2026</span>
              <h3>The Frequency of Emotion in Modern Synthesis</h3>
              <p>An in-depth look at how low-frequency oscillations impact our emotional states in electronic compositions.</p>
              <Link href="/writing" className="gradient-text-accent">Read Article &rarr;</Link>
            </article>

            <article className={styles.card}>
              <span className={styles.date}>February 14, 2026</span>
              <h3>Narrative Structures in Concept Albums</h3>
              <p>Researching the parallel between literary acts and track progression in concept-driven music records.</p>
              <Link href="/writing" className="gradient-text-accent">Read Article &rarr;</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactForm />
    </>
  );
}

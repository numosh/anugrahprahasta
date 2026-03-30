"use client";

import { useState } from "react";
import { setupDatabase, addMusic, deleteMusic, addArticle, deleteArticle } from "./actions";
interface AdminClientUIProps {
  initialMusic: any[];
  initialArticles: any[];
}

export default function AdminClientUI({ initialMusic, initialArticles = [] }: AdminClientUIProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInit = async () => {
    setLoading(true);
    const res = await setupDatabase();
    if (res.error) setMessage(res.error);
    else setMessage("Database Tables Successfully Initialized!");
    setLoading(false);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const res = await addMusic(formData);
    
    if (res.error) setMessage(res.error);
    else {
      setMessage("Success: Music added!");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  const handleAddArticleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const res = await addArticle(formData);
    
    if (res.error) setMessage(res.error);
    else {
      setMessage("Success: Article added!");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text">Admin Control Panel</h1>
          <p className="text-secondary">Secure Content Management System</p>
        </div>
      </header>

      {message && (
        <div style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--accent-primary)', marginBottom: '2rem', borderRadius: '0.5rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* FORM ADD MUSIC */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Add Music</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input name="title" placeholder="Title (e.g. Echoes)" required className="admin-input" />
            <textarea name="description" placeholder="Description..." required className="admin-input" rows={3}></textarea>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input name="year" placeholder="Year" className="admin-input" required />
              <input name="type" placeholder="Type (Single/Album)" className="admin-input" required />
            </div>
            <input name="link" placeholder="External Link (e.g. Spotify url)" className="admin-input" />
            <input name="youtubeId" placeholder="YouTube Video ID (optional, e.g. dQw4w9WgXcQ)" className="admin-input" />
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {loading ? "Adding..." : "Publish Music"}
            </button>
          </form>
        </section>

        {/* LIST MUSIC */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
             <h2>Music Library</h2>
             <button onClick={handleInit} className="btn btn-glass" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>Init Database Tables</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialMusic.length === 0 ? (
              <p className="text-secondary">No tracks in database yet.</p>
            ) : (
              initialMusic.map((m: any) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{m.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.type} • {m.year}</div>
                  </div>
                  <button onClick={() => deleteMusic(m.id)} className="btn btn-glass" style={{ color: '#f87171', border: 'none', padding: '0.5rem' }}>Delete</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ARTICLES MANAGEMENT SECTION */}
      <h2 className="gradient-text" style={{ marginTop: '4rem', marginBottom: '2rem' }}>Article Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* FORM ADD ARTICLE */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Add Article</h2>
          <form onSubmit={handleAddArticleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input name="title" placeholder="Title (e.g. The Synthesis)" required className="admin-input" />
            <textarea name="excerpt" placeholder="Short Excerpt..." required className="admin-input" rows={2}></textarea>
            <textarea name="content" placeholder="Full Content (Markdown/HTML supported)" required className="admin-input" rows={5}></textarea>
            <input name="date" placeholder="Date (e.g. March 2026)" className="admin-input" required />
            <input name="link" placeholder="External Link (Optional Substack/Medium)" className="admin-input" />
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {loading ? "Adding..." : "Publish Article"}
            </button>
          </form>
        </section>

        {/* LIST ARTICLES */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
             <h2>Articles Library</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialArticles.length === 0 ? (
              <p className="text-secondary">No articles in database yet.</p>
            ) : (
              initialArticles.map((a: any) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{a.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.date}</div>
                  </div>
                  <button onClick={() => deleteArticle(a.id)} className="btn btn-glass" style={{ color: '#f87171', border: 'none', padding: '0.5rem' }}>Delete</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          color: white;
          font-family: inherit;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}

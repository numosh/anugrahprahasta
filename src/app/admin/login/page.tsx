"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      
      if (data.success) {
        // Alihkan (Redirect) ke halaman admin
        router.push("/admin");
        router.refresh(); // Paksa middleware untuk mengevaluasi ulang cookie
      } else {
        setError("Akses Ditolak. Password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleLogin} className="glass-panel fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Secured Access</h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Masukkan Master Password untuk mengakses Admin Dashboard.</p>
        </div>
        
        <div>
          <input 
            type="password" 
            placeholder="Master Password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid var(--border-color)', 
              color: 'white',
              fontFamily: 'inherit'
            }}
            required 
          />
        </div>

        {error && <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard | Anugrah Prahasta',
  robots: 'noindex, nofollow' // Sangat penting agar halaman login/admin tidak di-indeks Google
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {children}
    </div>
  );
}

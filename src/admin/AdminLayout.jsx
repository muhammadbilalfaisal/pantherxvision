import { Link } from 'react-router-dom'

export default function AdminLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-brand-dark md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex flex-col border-b md:border-b-0 md:border-r border-brand-border bg-brand-card/60 p-5 md:min-h-screen">
        <Link to="/" className="inline-flex items-center" aria-label="Panther X Vision home">
          <img src="/logo.png" alt="" className="h-12 w-auto" width="1000" height="500" />
        </Link>
        <div className="mt-6 text-xs font-display uppercase tracking-[0.18em] text-gray-500">Admin</div>
        <nav className="mt-3" aria-label="Admin navigation">
          <Link to="/admin/reviews" aria-current="page" className="flex items-center gap-3 rounded-lg border border-purple-700/40 bg-purple-900/25 px-4 py-3 text-sm font-semibold text-purple-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"/><path d="M8 9h8M8 13h5"/></svg>
            Reviews
          </Link>
        </nav>
        <div className="mt-6 border-t border-brand-border pt-5 md:mt-auto">
          <p className="truncate text-xs text-gray-500" title={user.email}>{user.email}</p>
          <button type="button" onClick={onLogout} className="mt-3 text-sm text-gray-300 transition-colors hover:text-white">Sign out</button>
        </div>
      </aside>
      <main id="admin-main-content" className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  )
}

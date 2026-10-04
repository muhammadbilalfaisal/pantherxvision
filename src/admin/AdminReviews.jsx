import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'
import ConfirmDialog from './ConfirmDialog'
import ReviewDetailModal, { Rating, StatusBadge } from './ReviewDetailModal'

const endpoint = '/.netlify/functions/admin-reviews'
const emptyStats = { total: 0, pending: 0, approved: 0, rejected: 0, averageApproved: 0 }

async function apiRequest(url = endpoint, options) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }
  return data
}

function AdminSkeleton() {
  return <div className="min-h-screen bg-brand-dark p-8" aria-label="Loading admin dashboard"><div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-10 w-52 rounded bg-brand-card"/><div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{[0,1,2,3,4].map(item => <div key={item} className="h-28 rounded-xl bg-brand-card"/>)}</div><div className="h-96 rounded-2xl bg-brand-card"/></div></div>
}

export default function AdminReviews() {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', status: '', rating: '', sort: 'newest' })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    apiRequest(`${endpoint}?action=session`)
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setFilters(current => ({ ...current, search }))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadReviews = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    const query = new URLSearchParams({ page: String(page), sort: filters.sort })
    if (filters.search) query.set('search', filters.search)
    if (filters.status) query.set('status', filters.status)
    if (filters.rating) query.set('rating', filters.rating)
    try {
      const data = await apiRequest(`${endpoint}?${query}`)
      setReviews(data.reviews)
      setStats(data.stats)
      setTotal(data.total)
    } catch (loadError) {
      if (loadError.status === 401 || loadError.status === 403) setUser(null)
      else setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [filters, page, user])

  useEffect(() => {
    const timer = setTimeout(loadReviews, 0)
    return () => clearTimeout(timer)
  }, [loadReviews])
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  const totalPages = Math.max(1, Math.ceil(total / 20))
  const hasFilters = Boolean(search || filters.status || filters.rating || filters.sort !== 'newest')
  const emptyMessage = useMemo(() => {
    if (hasFilters) return filters.status === 'pending' && !search && !filters.rating ? "You're all caught up. There are no reviews waiting for moderation." : 'No reviews match your current filters.'
    return 'No reviews have been submitted yet.'
  }, [filters.rating, filters.status, hasFilters, search])

  const mutate = async (review, action) => {
    setBusy(true)
    setError('')
    try {
      if (action === 'delete') {
        await apiRequest(endpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: review.id }) })
      } else {
        const body = action === 'verified'
          ? { id: review.id, action: 'verified', isVerified: !review.is_verified }
          : { id: review.id, action: 'status', status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending' }
        await apiRequest(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      }
      setToast(action === 'delete' ? 'Review deleted.' : action === 'verified' ? `Review ${review.is_verified ? 'unverified' : 'verified'}.` : `Review moved to ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending'}.`)
      setSelected(null)
      setConfirmation(null)
      await loadReviews()
    } catch (mutationError) {
      setError(mutationError.message)
    } finally {
      setBusy(false)
    }
  }

  const requestQuickAction = (review, action) => {
    const copy = action === 'delete'
      ? { title: 'Delete this review permanently?', description: 'This action cannot be undone.', confirmLabel: 'Delete', destructive: true }
      : action === 'approve'
        ? { title: 'Approve this review?', description: 'This review will become eligible to appear publicly.', confirmLabel: 'Approve' }
        : { title: 'Reject this review?', description: 'This review will no longer appear publicly. You can change its status later.', confirmLabel: 'Reject' }
    setConfirmation({ review, action, ...copy })
  }

  const clearFilters = () => { setSearch(''); setFilters({ search: '', status: '', rating: '', sort: 'newest' }); setPage(1) }
  const logout = async () => { await fetch(`${endpoint}?action=logout`, { method: 'POST' }); setUser(null) }

  if (checkingSession) return <AdminSkeleton />
  if (!user) return <AdminLogin onLogin={setUser} />

  return (
    <AdminLayout user={user} onLogout={logout}>
      <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <header><p className="text-xs font-display uppercase tracking-[0.18em] text-purple-400">Moderation</p><h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Reviews</h1><p className="mt-2 text-sm text-gray-400 sm:text-base">Manage, review, approve, and moderate customer feedback.</p></header>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5" aria-label="Review statistics">
          {[['Total Reviews', stats.total], ['Pending', stats.pending], ['Approved', stats.approved], ['Rejected', stats.rejected], ['Avg. Approved Rating', `${stats.averageApproved.toFixed(1)} ★`]].map(([label, value]) => <div key={label} className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5"><div className="text-xs uppercase tracking-wider text-gray-500">{label}</div><div className="mt-2 font-display text-2xl font-bold text-white">{value}</div></div>)}
        </section>

        <section className="mt-7 rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5" aria-label="Review filters">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Search<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, company, email, or review" className="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-3 text-sm font-normal normal-case tracking-normal text-white placeholder-gray-600 focus:border-purple-600 focus:outline-none" /></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status<select value={filters.status} onChange={event => { setPage(1); setFilters(current => ({ ...current, status: event.target.value })) }} className="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-3 py-3 text-sm font-normal normal-case text-white"><option value="">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Rating<select value={filters.rating} onChange={event => { setPage(1); setFilters(current => ({ ...current, rating: event.target.value })) }} className="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-3 py-3 text-sm font-normal normal-case text-white"><option value="">All ratings</option>{[5,4,3,2,1].map(rating => <option key={rating} value={rating}>{rating} stars</option>)}</select></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sort<select value={filters.sort} onChange={event => { setPage(1); setFilters(current => ({ ...current, sort: event.target.value })) }} className="mt-2 w-full rounded-lg border border-brand-border bg-brand-dark px-3 py-3 text-sm font-normal normal-case text-white"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest rating</option><option value="lowest">Lowest rating</option></select></label>
            <button type="button" onClick={clearFilters} disabled={!hasFilters} className="self-end rounded-lg border border-brand-border px-4 py-3 text-sm text-gray-300 hover:border-purple-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">Clear filters</button>
          </div>
        </section>

        {error && <div role="alert" className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300"><span>{error}</span><button type="button" onClick={loadReviews} className="font-semibold underline">Retry</button></div>}

        <section className="mt-6 overflow-hidden rounded-2xl border border-brand-border bg-brand-card" aria-busy={loading}>
          {loading ? <div className="space-y-px" aria-label="Loading reviews">{[0,1,2,3,4].map(item => <div key={item} className="h-20 animate-pulse bg-white/[0.025]" />)}</div> : reviews.length === 0 ? <div className="px-6 py-16 text-center"><h2 className="font-display text-xl font-semibold text-white">Nothing to moderate</h2><p className="mt-2 text-sm text-gray-400">{emptyMessage}</p></div> : <>
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[960px] text-left"><thead className="border-b border-brand-border bg-brand-dark/40 text-xs uppercase tracking-wider text-gray-500"><tr>{['Customer','Rating','Review','Status','Verified','Submitted','Actions'].map(column => <th key={column} className="px-4 py-4 font-semibold">{column}</th>)}</tr></thead><tbody className="divide-y divide-brand-border">{reviews.map(review => <tr key={review.id} className="transition-colors hover:bg-white/[0.025]"><td className="px-4 py-4"><div className="font-medium text-white">{review.name}</div><div className="mt-1 max-w-[150px] truncate text-xs text-gray-500">{review.company || 'No company'}</div></td><td className="px-4 py-4"><Rating value={review.rating}/></td><td className="max-w-xs px-4 py-4"><p className="line-clamp-2 text-sm text-gray-300">{review.review}</p></td><td className="px-4 py-4"><StatusBadge status={review.status}/></td><td className="px-4 py-4 text-sm text-gray-300">{review.is_verified ? 'Verified' : 'Not verified'}</td><td className="px-4 py-4 text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</td><td className="px-4 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => setSelected(review)} className="text-sm font-semibold text-purple-300 hover:text-purple-200">View</button>{review.status !== 'approved' && <button type="button" onClick={() => requestQuickAction(review, 'approve')} aria-label={`Approve review by ${review.name}`} className="text-sm text-emerald-300 hover:text-emerald-200">Approve</button>}{review.status !== 'rejected' && <button type="button" onClick={() => requestQuickAction(review, 'reject')} aria-label={`Reject review by ${review.name}`} className="text-sm text-amber-300 hover:text-amber-200">Reject</button>}<button type="button" onClick={() => requestQuickAction(review, 'delete')} aria-label={`Delete review by ${review.name}`} className="text-sm text-red-400 hover:text-red-300">Delete</button></div></td></tr>)}</tbody></table></div>
            <div className="divide-y divide-brand-border md:hidden">{reviews.map(review => <article key={review.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display font-semibold text-white">{review.name}</h2><p className="mt-1 text-xs text-gray-500">{review.company || 'No company'}</p></div><StatusBadge status={review.status}/></div><div className="mt-4"><Rating value={review.rating}/></div><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">{review.review}</p><div className="mt-4 flex items-center justify-between text-xs text-gray-500"><span>{review.is_verified ? 'Verified client' : 'Not verified'}</span><time>{new Date(review.created_at).toLocaleDateString()}</time></div><button type="button" onClick={() => setSelected(review)} className="btn-outline mt-5 w-full text-center text-sm">View and moderate</button></article>)}</div>
          </>}
        </section>

        {!loading && total > 0 && <nav className="mt-5 flex items-center justify-between gap-4" aria-label="Review pagination"><button type="button" disabled={page <= 1} onClick={() => setPage(current => current - 1)} className="btn-outline text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-gray-400">Page {page} of {totalPages} · {total} results</span><button type="button" disabled={page >= totalPages} onClick={() => setPage(current => current + 1)} className="btn-outline text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button></nav>}
      </m.div>

      <AnimatePresence>{selected && <ReviewDetailModal review={selected} busy={busy} onClose={() => setSelected(null)} onAction={action => mutate(selected, action)} />}</AnimatePresence>
      <AnimatePresence>{confirmation && <ConfirmDialog {...confirmation} busy={busy} onClose={() => setConfirmation(null)} onConfirm={() => mutate(confirmation.review, confirmation.action)} />}</AnimatePresence>
      <AnimatePresence>{toast && <m.div role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-5 right-5 z-[150] max-w-sm rounded-lg border border-purple-700/50 bg-brand-card px-5 py-4 text-sm text-white shadow-2xl">{toast}</m.div>}</AnimatePresence>
    </AdminLayout>
  )
}

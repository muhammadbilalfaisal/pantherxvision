import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import ConfirmDialog from './ConfirmDialog'

const labels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }

export function StatusBadge({ status }) {
  const styles = status === 'approved' ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-300' : status === 'rejected' ? 'border-red-800/50 bg-red-950/40 text-red-300' : 'border-amber-700/50 bg-amber-950/40 text-amber-300'
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}>{labels[status] || status}</span>
}

export function Rating({ value }) {
  return <span className="text-amber-300" aria-label={`${value} out of 5 stars`}>{'★'.repeat(value)}<span className="text-gray-700">{'★'.repeat(5 - value)}</span></span>
}

export default function ReviewDetailModal({ review, busy, onAction, onClose }) {
  const [confirmation, setConfirmation] = useState(null)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape' && !confirmation && !busy) onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(item => !item.disabled)
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKeyDown); previous?.focus?.() }
  }, [busy, confirmation, onClose])

  const request = (action, options) => setConfirmation({ action, ...options })
  const confirm = async () => {
    await onAction(confirmation.action)
    setConfirmation(null)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/85 p-3 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <m.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="review-detail-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-brand-card border-glow p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div><p className="text-xs font-display uppercase tracking-[0.18em] text-purple-400">Review details</p><h2 id="review-detail-title" className="mt-1 font-display text-2xl font-bold text-white">{review.name}</h2></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close review details" className="rounded-lg border border-brand-border p-2 text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="mt-7 grid gap-7 md:grid-cols-2">
          <section aria-labelledby="customer-heading"><h3 id="customer-heading" className="font-display font-semibold text-white">Customer information</h3><dl className="mt-4 space-y-3 text-sm">
            {[["Full name", review.name], ["Company", review.company || 'Not provided'], ["Job title", review.job_title || 'Not provided'], ["Email", review.email || 'Not provided'], ["Verified", review.is_verified ? 'Verified client' : 'Not verified']].map(([term, value]) => <div key={term}><dt className="text-xs uppercase tracking-wider text-gray-500">{term}</dt><dd className="mt-1 break-words text-gray-200">{value}</dd></div>)}
          </dl></section>
          <section aria-labelledby="moderation-heading"><h3 id="moderation-heading" className="font-display font-semibold text-white">Moderation</h3><dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs uppercase tracking-wider text-gray-500">Status</dt><dd className="mt-1"><StatusBadge status={review.status} /></dd></div>
            <div><dt className="text-xs uppercase tracking-wider text-gray-500">Submitted</dt><dd className="mt-1 text-gray-200">{new Date(review.created_at).toLocaleString()}</dd></div>
            {review.approved_at && <div><dt className="text-xs uppercase tracking-wider text-gray-500">Approved</dt><dd className="mt-1 text-gray-200">{new Date(review.approved_at).toLocaleString()}</dd></div>}
          </dl></section>
        </div>
        <section className="mt-7 border-t border-brand-border pt-7" aria-labelledby="review-heading"><div className="flex items-center justify-between gap-4"><h3 id="review-heading" className="font-display font-semibold text-white">Review</h3><Rating value={review.rating} /></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{review.review}</p></section>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-brand-border pt-6">
          {review.status !== 'approved' && <button type="button" disabled={busy} onClick={() => request('approve', { title: 'Approve this review?', description: 'This review will become eligible to appear in the public reviews section.', confirmLabel: 'Approve' })} className="btn-primary text-sm disabled:opacity-60">Approve</button>}
          {review.status !== 'rejected' && <button type="button" disabled={busy} onClick={() => request('reject', { title: 'Reject this review?', description: 'This review will no longer appear publicly. You can change its status later.', confirmLabel: 'Reject' })} className="btn-outline text-sm disabled:opacity-60">Reject</button>}
          {review.status === 'rejected' && <button type="button" disabled={busy} onClick={() => request('pending', { title: 'Move review to pending?', description: 'The review will return to the moderation queue and remain hidden publicly.', confirmLabel: 'Move to pending' })} className="btn-outline text-sm disabled:opacity-60">Move to Pending</button>}
          <button type="button" disabled={busy} onClick={() => request('verified', { title: review.is_verified ? 'Remove verified status?' : 'Mark as verified client?', description: 'Verified status is controlled by administrators and appears on the public review card.', confirmLabel: review.is_verified ? 'Unverify' : 'Mark verified' })} className="btn-outline text-sm disabled:opacity-60">{review.is_verified ? 'Unverify' : 'Mark as Verified'}</button>
          <button type="button" disabled={busy} onClick={() => request('delete', { title: 'Delete this review permanently?', description: 'This action cannot be undone.', confirmLabel: 'Delete', destructive: true })} className="ml-auto rounded-md px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-950/40 disabled:opacity-60">Delete</button>
        </div>
      </m.div>
      <AnimatePresence>{confirmation && <ConfirmDialog {...confirmation} busy={busy} onConfirm={confirm} onClose={() => setConfirmation(null)} />}</AnimatePresence>
    </div>
  )
}
